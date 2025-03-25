import {nanoid} from 'nanoid';
import {IBaseStorageRepository, LookUpUrl, ICacheRepository} from './types';

export interface ShortenerOptions {
    expiryDays?: number;
    customId?: string;
    validateUrl?: boolean;
}

export interface IShortenerBusinessFlow {
    createLookUpData(longUrl: string, options?: ShortenerOptions): Promise<LookUpUrl>;
    getRealUrl(shortUrl: string): Promise<LookUpUrl | null>;
    findByOriginalUrl(originalUrl: string): Promise<LookUpUrl | null>;
    reactivateUrl(id: string): Promise<boolean>;
}

export class ShortenerBusinessFlow implements IShortenerBusinessFlow {
    private readonly storage: IBaseStorageRepository;
    private readonly cache: ICacheRepository | null;
    private readonly DEFAULT_EXPIRY_DAYS = 30;
    private readonly MAX_COLLISION_RETRIES = 5;
    private readonly MAX_URL_LENGTH = 2048;
    private readonly CUSTOM_ID_PATTERN = /^[a-zA-Z0-9_-]{3,16}$/;

    constructor(storage: IBaseStorageRepository, cache: ICacheRepository | null = null) {
        this.storage = storage;
        this.cache = cache;
    }

    async createLookUpData(longUrl: string, options?: ShortenerOptions): Promise<LookUpUrl> {
        this.validateUrl(longUrl);

        if (longUrl.length > this.MAX_URL_LENGTH) {
            throw new Error(`URL exceeds maximum length of ${this.MAX_URL_LENGTH} characters`);
        }

        if (options?.customId && !this.CUSTOM_ID_PATTERN.test(options.customId)) {
            throw new Error('Custom ID must be 3-16 characters and contain only letters, numbers, underscores, and hyphens');
        }

        // Check if URL already exists
        const existingUrl = await this.findByOriginalUrl(longUrl);

        // If active and not expired, return it
        if (existingUrl && existingUrl.isActive && !this.isExpired(existingUrl)) {
            return existingUrl;
        }

        // If URL exists but inactive or expired
        if (existingUrl) {
            // If customId provided and different from existing, create new
            if (options?.customId && options.customId !== existingUrl.id) {
                return this.createNewLookup(longUrl, options);
            }

            // If expired, extend expiration
            if (this.isExpired(existingUrl)) {
                const extended = await this.extendExpiration(existingUrl.id);
                if (extended) {
                    const refreshed = await this.storage.find(existingUrl.id);
                    if (refreshed && refreshed.isActive) return refreshed;
                }
            }

            // If inactive, reactivate
            if (!existingUrl.isActive) {
                const reactivated = await this.reactivateUrl(existingUrl.id);
                if (reactivated) {
                    const refreshed = await this.storage.find(existingUrl.id);
                    if (refreshed) return refreshed;
                }
            }
        }

        // Create new URL
        return this.createNewLookup(longUrl, options);
    }

    async getRealUrl(shortUrl: string): Promise<LookUpUrl | null> {
        const id = this.extractIdFromShortUrl(shortUrl);
        if (!id) return null;

        // Check cache first
        if (this.cache) {
            const cachedData = await this.cache.get(id);
            if (cachedData && cachedData.isActive && !this.isExpired(cachedData)) {
                this.updateVisitCount(cachedData).catch(() => {});
                return cachedData;
            }
        }

        const lookupData = await this.storage.find(id);
        if (!lookupData || !lookupData.isActive || this.isExpired(lookupData)) {
            return null;
        }

        // Update visit count
        await this.atomicVisitUpdate(lookupData);
        return lookupData;
    }

    async findByOriginalUrl(originalUrl: string): Promise<LookUpUrl | null> {
        if (this.cache) {
            const cachedId = await this.cache.getByOriginalUrl(originalUrl);
            if (cachedId) {
                const lookupData = await this.cache.get(cachedId);
                if (lookupData && lookupData.isActive && !this.isExpired(lookupData)) {
                    return lookupData;
                }
            }
        }

        return this.storage.findByOriginalUrl(originalUrl);
    }

    async reactivateUrl(id: string): Promise<boolean> {
        const lookupData = await this.storage.find(id);
        if (!lookupData) return false;

        if (this.isExpired(lookupData)) {
            await this.extendExpiration(id);
        }

        lookupData.isActive = true;
        await this.storage.update(lookupData);

        if (this.cache) {
            await this.cache.set(id, lookupData);
            await this.cache.setOriginalUrl(lookupData.originalUrl, id);
        }

        return true;
    }

    async deactivateUrl(id: string): Promise<boolean> {
        const lookupData = await this.storage.find(id);
        if (!lookupData) return false;

        lookupData.isActive = false;
        await this.storage.update(lookupData);

        if (this.cache) {
            await this.cache.set(id, lookupData);
            await this.cache.deleteOriginalUrl(lookupData.originalUrl);
        }

        return true;
    }

    async listUrls(limit: number = 100, offset: number = 0): Promise<LookUpUrl[]> {
        return this.storage.list(limit, offset);
    }

    async extendExpiration(id: string, additionalDays: number = 30): Promise<boolean> {
        const lookupData = await this.storage.find(id);
        if (!lookupData) return false;

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + additionalDays);
        lookupData.expiresAt = expiresAt.toISOString();

        await this.storage.update(lookupData);

        if (this.cache) {
            await this.cache.set(id, lookupData);
        }

        return true;
    }

    private async createNewLookup(longUrl: string, options?: ShortenerOptions): Promise<LookUpUrl> {
        let id = options?.customId || '';
        let retryCount = 0;

        if (!id) {
            do {
                id = nanoid(6);
                const existingId = await this.storage.find(id);
                if (!existingId) break;
                retryCount++;
            } while (retryCount < this.MAX_COLLISION_RETRIES);

            if (retryCount >= this.MAX_COLLISION_RETRIES) {
                throw new Error('Failed to generate unique ID after multiple attempts');
            }
        } else {
            const existingId = await this.storage.find(id);
            if (existingId) {
                throw new Error(`Custom ID '${id}' already exists`);
            }
        }

        const now = new Date();
        const expiresAt = new Date();
        const expiryDays = options?.expiryDays ?? this.DEFAULT_EXPIRY_DAYS;
        expiresAt.setDate(now.getDate() + expiryDays);

        const lookupData: LookUpUrl = {
            id,
            originalUrl: longUrl,
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            visits: 0,
            isActive: true,
            lastVisit: null
        };

        await this.storage.save(lookupData);

        if (this.cache) {
            await this.cache.set(id, lookupData);
            await this.cache.setOriginalUrl(longUrl, id);
        }

        return lookupData;
    }

    private validateUrl(url: string): void {
        try {
            const parsedUrl = new URL(url);
            if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
                throw new Error('URL must use HTTP or HTTPS protocol');
            }
        } catch (error) {
            throw new Error(`Invalid URL format: ${error.message}`);
        }
    }

    private extractIdFromShortUrl(shortUrl: string): string | null {
        try {
            const url = new URL(shortUrl);
            return url.pathname.slice(1);
        } catch (e) {
            return shortUrl;
        }
    }

    private isExpired(lookupData: LookUpUrl): boolean {
        if (!lookupData.expiresAt) return false;
        return new Date() > new Date(lookupData.expiresAt);
    }

    private async updateVisitCount(lookupData: LookUpUrl): Promise<void> {
        lookupData.visits += 1;
        lookupData.lastVisit = new Date().toISOString();
        await this.storage.update(lookupData);

        if (this.cache) {
            await this.cache.set(lookupData.id, lookupData);
        }
    }

    private async atomicVisitUpdate(lookupData: LookUpUrl): Promise<LookUpUrl> {
        try {
            const updatedData = await this.storage.atomicUpdate(lookupData.id, {
                visits: lookupData.visits + 1,
                lastVisit: new Date().toISOString()
            });

            if (this.cache && updatedData) {
                await this.cache.set(lookupData.id, updatedData);
            }

            return updatedData || lookupData;
        } catch {
            lookupData.visits += 1;
            lookupData.lastVisit = new Date().toISOString();
            await this.storage.update(lookupData);
            return lookupData;
        }
    }
}