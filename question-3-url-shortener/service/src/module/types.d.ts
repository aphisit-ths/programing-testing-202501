
export interface LookUpUrl {
    id: string;
    originalUrl: string;
    createdAt: string;
    expiresAt?: string;
    visits: number;
    lastVisit?: string;
    isActive: boolean;
}

export interface IBaseStorageRepository {
    save(data: LookUpUrl): Promise<void>;
    find(id: string): Promise<LookUpUrl | null>;
    findByOriginalUrl(url: string): Promise<LookUpUrl | null>; // เพิ่ม method นี้
    update(data: LookUpUrl): Promise<void>;
    list(limit?: number, offset?: number): Promise<LookUpUrl[]>;
}

export interface ICacheRepository {
    get(id: string): Promise<LookUpUrl | null>;
    set(id: string, data: LookUpUrl, ttl?: number): Promise<void>;
    getByOriginalUrl(url: string): Promise<string | null>;
    setOriginalUrl(url: string, id: string, ttl?: number): Promise<void>;
    deleteOriginalUrl(url: string): Promise<void>;
}