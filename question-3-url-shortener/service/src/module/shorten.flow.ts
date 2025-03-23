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
}

export class ShortenerBusinessFlow implements IShortenerBusinessFlow {
    private readonly storage: IBaseStorageRepository;
    private readonly cache: ICacheRepository | null;
    private readonly DEFAULT_EXPIRY_DAYS = 30;
    private readonly MAX_COLLISION_RETRIES = 5;

    constructor(storage: IBaseStorageRepository, cache: ICacheRepository | null = null) {
        this.storage = storage;
        this.cache = cache;
    }

    async createLookUpData(longUrl: string, options?: ShortenerOptions): Promise<LookUpUrl> {

        this.validateUrl(longUrl);

        // Lookup by Original URL - เช็คก่อนว่าเคยมีการย่อ URL นี้แล้วหรือไม่
        const existingUrl = await this.findByOriginalUrl(longUrl);
        if (existingUrl && existingUrl.isActive && !this.isExpired(existingUrl)) {
            return existingUrl;
        }

        // ใช้ customId ถ้ามี หรือสร้าง nanoid
        let id = options?.customId || '';
        let retryCount = 0;

        // Collision Handling
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
            // ตรวจสอบ collision สำหรับ customId
            const existingId = await this.storage.find(id);
            if (existingId) {
                throw new Error(`Custom ID '${id}' already exists`);
            }
        }

        // 3. Custom Expiry
        const now = new Date();
        const expiresAt = new Date();
        const expiryDays = options?.expiryDays ?? this.DEFAULT_EXPIRY_DAYS;
        expiresAt.setDate(now.getDate() + expiryDays);

        const lookupData: LookUpUrl = {
            id,
            originalUrl: longUrl,
            createdAt: now.toString(),
            expiresAt: expiresAt.toString() ?? null,
            visits: 0,
            isActive: true
        };

        await this.storage.save(lookupData);

        // 4. Cache Layer - เพิ่มข้อมูลลง cache
        if (this.cache) {
            await this.cache.set(id, lookupData);
            await this.cache.setOriginalUrl(longUrl, id);
        }

        return lookupData;
    }

    async getRealUrl(shortUrl: string): Promise<LookUpUrl | null> {
        const id = this.extractIdFromShortUrl(shortUrl);
        if (!id) return null;

        // 4. Cache Layer - เช็ค cache ก่อน
        if (this.cache) {
            const cachedData = await this.cache.get(id);
            if (cachedData && cachedData.isActive && !this.isExpired(cachedData)) {
                // อัปเดต visits ใน background โดยไม่รอ
                await this.updateVisitCount(cachedData).catch(console.error);
                return cachedData;
            }
        }

        const lookupData = await this.storage.find(id);


        if (!lookupData || !lookupData.isActive || this.isExpired(lookupData)) {
            return null;
        }

        lookupData.visits += 1;
        lookupData.lastVisit = new Date().toString();

        // อัปเดตข้อมูลใน storage
        await this.storage.update(lookupData);

        // อัปเดต cache
        if (this.cache) {
            await this.cache.set(id, lookupData);
        }

        return lookupData;
    }

    async findByOriginalUrl(originalUrl: string): Promise<LookUpUrl | null> {
        // เช็ค cache ก่อน
        if (this.cache) {
            const cachedId = await this.cache.getByOriginalUrl(originalUrl);
            if (cachedId) {
                const lookupData = await this.cache.get(cachedId);
                if (lookupData && lookupData.isActive && !this.isExpired(lookupData)) {
                    return lookupData;
                }
            }
        }

        // ถ้าไม่มีใน cache ค้นหาจาก storage
        return this.storage.findByOriginalUrl(originalUrl);
    }

    async listUrls(limit: number = 100, offset: number = 0): Promise<LookUpUrl[]> {
        return this.storage.list(limit, offset);
    }

    async deactivateUrl(id: string): Promise<boolean> {
        const lookupData = await this.storage.find(id);

        if (!lookupData) {
            return false;
        }

        lookupData.isActive = false;
        await this.storage.update(lookupData);

        // อัปเดต cache
        if (this.cache) {
            await this.cache.set(id, lookupData);
            // ลบความสัมพันธ์กับ originalUrl จาก cache
            await this.cache.deleteOriginalUrl(lookupData.originalUrl);
        }

        return true;
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
            return url.pathname.slice(1); // ตัด '/' ออก
        } catch (e) {
            return shortUrl;
        }
    }

    private isExpired(lookupData: LookUpUrl): boolean {
        if (!lookupData.expiresAt) return false;
        return new Date() > new Date(lookupData.expiresAt);
    }

    // แยกการอัปเดต visits เพื่อให้สามารถทำงานแบบ async ได้
    private async updateVisitCount(lookupData: LookUpUrl): Promise<void> {
        lookupData.visits += 1;
        lookupData.lastVisit = new Date().toString();
        console.log(`Lookup update count: ${lookupData.visits}`);
        await this.storage.update(lookupData);

        if (this.cache) {
            await this.cache.set(lookupData.id, lookupData);
        }
    }
}