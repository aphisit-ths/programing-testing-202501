
export interface LookUpUrl {
    id: string;
    originalUrl: string;
    createdAt: string;
    expiresAt: string | null;
    visits: number;
    isActive: boolean;
    lastVisit?: string | null;
}

export interface IBaseStorageRepository {
    save(data: LookUpUrl): Promise<void>;
    find(id: string): Promise<LookUpUrl | null>;
    findByOriginalUrl(originalUrl: string): Promise<LookUpUrl | null>;
    update(data: LookUpUrl): Promise<void>;
    atomicUpdate(id: string, updates: Partial<LookUpUrl>): Promise<LookUpUrl | null>;
    list(limit?: number, offset?: number): Promise<LookUpUrl[]>;
}

export interface ICacheRepository {
    get(id: string): Promise<LookUpUrl | null>;
    set(id: string, data: LookUpUrl): Promise<void>;
    getByOriginalUrl(originalUrl: string): Promise<string | null>;
    setOriginalUrl(originalUrl: string, id: string): Promise<void>;
    deleteOriginalUrl(originalUrl: string): Promise<void>;
}