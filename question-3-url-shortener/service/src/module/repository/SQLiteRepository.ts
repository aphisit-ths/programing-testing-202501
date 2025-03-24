import {IBaseStorageRepository, LookUpUrl} from "../types";
import {BunSQLiteDatabase} from "drizzle-orm/bun-sqlite";
import {Database} from "bun:sqlite";
import {lookupUrls} from "../../db/schema";
import {eq} from "drizzle-orm";

export class SQLiteRepository implements IBaseStorageRepository {
    constructor(private db: BunSQLiteDatabase<any> & { $client: Database }) {
    }

    async find(id: string): Promise<LookUpUrl | null> {
        const [lookUpData] = await this.db
            .select()
            .from(lookupUrls)
            .where(eq(lookupUrls.id, id))
            .limit(1)
        return lookUpData;
    }

    async findByOriginalUrl(url: string): Promise<LookUpUrl | null> {
        const [lookUpData] = await this.db
            .select()
            .from(lookupUrls)
            .where(eq(lookupUrls.originalUrl, url))
            .limit(1)
        return lookUpData
    }

    async list(limit?: number, offset?: number): Promise<LookUpUrl[]> {
        return this.db
            .select()
            .from(lookupUrls)
            .offset(offset)
            .limit(limit);
    }

    async save(data: LookUpUrl): Promise<void> {
        const [savedLookupData] = await this.db
            .insert(lookupUrls)
            .values(data)
            .returning();
        console.log('Lookup Created Complete: ', savedLookupData.originalUrl);
    }

    async update(data: LookUpUrl): Promise<void> {
        // @ts-ignore
        let toUpdateLookupData: LookUpUrl = {};
        if (data.originalUrl !== undefined) toUpdateLookupData.originalUrl = data.originalUrl;
        if (data.isActive !== undefined) toUpdateLookupData.isActive = data.isActive;
        if (data.lastVisit !== undefined) toUpdateLookupData.lastVisit = data.lastVisit;
        if (data.visits !== undefined) toUpdateLookupData.visits = data.visits;
        if (data.expiresAt !== undefined) toUpdateLookupData.expiresAt = data.expiresAt;

        const [updatedLookupData] = await this.db
            .update(lookupUrls)
            .set(toUpdateLookupData)
            .where(eq(lookupUrls.id, data.id))
            .returning();
        console.log('Lookup Update Complete: ', updatedLookupData.originalUrl);
    }

    async atomicUpdate(id: string, updates: Partial<LookUpUrl>): Promise<LookUpUrl | null> {
        try {
            const [updatedData] = await this.db
                .update(lookupUrls)
                .set(updates)
                .where(eq(lookupUrls.id, id))
                .returning();
            return updatedData;
        } catch (error) {
            console.error(`Error in atomicUpdate: ${error.message}`);
            return null;
        }
    }
}