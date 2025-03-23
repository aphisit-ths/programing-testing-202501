import { LRUCache } from 'lru-cache';
import {ICacheRepository, LookUpUrl} from "../types";

export class LRUCacheRepository implements ICacheRepository {
    private urlCache: LRUCache<string, LookUpUrl>;
    private originalUrlCache: LRUCache<string, string>;

    constructor(maxSize: number = 1000) {
        this.urlCache = new LRUCache({
            max: maxSize,
            ttl: 60 * 60 * 1000,
            allowStale: false
        });

        this.originalUrlCache = new LRUCache({
            max: maxSize,
            ttl: 60 * 60 * 1000,
            allowStale: false
        });
    }

    async get(id: string): Promise<LookUpUrl | null> {
        return this.urlCache.get(`url:${id}`) || null;
    }

    async set(id: string, data: LookUpUrl, ttlSeconds?: number): Promise<void> {
        const options = ttlSeconds ? { ttl: ttlSeconds * 1000 } : undefined;
        this.urlCache.set(`url:${id}`, data, options);
    }

    async getByOriginalUrl(url: string): Promise<string | null> {
        return this.originalUrlCache.get(`original:${this.hashUrl(url)}`) || null;
    }

    async setOriginalUrl(url: string, id: string, ttlSeconds?: number): Promise<void> {
        const options = ttlSeconds ? { ttl: ttlSeconds * 1000 } : undefined;
        this.originalUrlCache.set(`original:${this.hashUrl(url)}`, id, options);
    }

    async deleteOriginalUrl(url: string): Promise<void> {
        this.originalUrlCache.delete(`original:${this.hashUrl(url)}`);
    }

    private hashUrl(url: string): string {
        return Buffer.from(url).toString('base64');
    }
}