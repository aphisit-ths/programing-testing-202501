import {IBaseStorageRepository, LookUpUrl} from "../types";

export class InMemoryRepository implements IBaseStorageRepository {
    private urls: Map<string, LookUpUrl> = new Map();

    async save(data: LookUpUrl): Promise<void> {
        this.urls.set(data.id, data);
    }

    async find(id: string): Promise<LookUpUrl | null> {
        return this.urls.get(id) || null;
    }

    async update(data: LookUpUrl): Promise<void> {
        this.urls.set(data.id, data);
    }

    async list(limit?: number, offset?: number): Promise<LookUpUrl[]> {
        const urlList = Array.from(this.urls.values());

        if (offset !== undefined && limit !== undefined) {
            return urlList.slice(offset, offset + limit);
        }

        return urlList;
    }

    async count(): Promise<number> {
        return this.urls.size;
    }

    findByOriginalUrl(url: string): Promise<LookUpUrl | null> {
        return Promise.resolve(undefined);
    }
}