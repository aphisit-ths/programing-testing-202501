// src/repo/user.repo.ts
import { eq, ilike, and, desc, isNull, sql } from 'drizzle-orm';
import {User} from "./user.model";
import {users} from "../../db/schema";
import {BunSQLiteDatabase} from "drizzle-orm/bun-sqlite";
import {Database} from "bun:sqlite";
import {CreateUserDto, IFindAllUserPaginateResp, IQueryParams, UpdateUserDto} from "./types";

export class UserRepo {
    constructor(private db: BunSQLiteDatabase<any> & {$client: Database}){}

    async create(data: CreateUserDto): Promise<User> {
        const [user] = await this.db.insert(users).values(data).returning();
        return user;
    }

    async getById(id: number): Promise<User | null> {
        const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
        return user || null;
    }

    async getByEmail(email: string): Promise<User | null> {
        const [user] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
        return user || null;
    }

    async update(data: UpdateUserDto): Promise<User> {
        const [user] = await this.db
            .update(users)
            .set({
                name: data.name,
                age: data.age,
                email: data.email,
                avatarUrl: data.avatarUrl
            })
            .where(eq(users.id, data.id))
            .returning();
        return user;
    }

    async delete(id: number): Promise<void> {
        await this.db
            .update(users)
            .set({ deletedAt: new Date() })
            .where(eq(users.id, id));
    }

    async get(query: IQueryParams): Promise<IFindAllUserPaginateResp> {
        const { start = 0, limit = 10, sortBy = 'id', order = 'asc', query: search } = query;
        const whereConditions = [];

        if (search) {
            whereConditions.push(ilike(users.name, `%${search}%`));
            whereConditions.push(ilike(users.email, `%${search}%`));
        }
        // ใช้ isNull แทน eq เมื่อตรวจสอบ NULL
        whereConditions.push(isNull(users.deletedAt));

        // Type guard สำหรับ sortBy
        const validSortFields = ['id', 'name', 'age', 'email', 'avatarUrl'] as const;
        type SortField = typeof validSortFields[number];
        const safeSortBy = validSortFields.includes(sortBy as SortField) ? sortBy as SortField : 'id';

        const [data, [{ count }]] = await Promise.all([
            this.db
                .select()
                .from(users)
                .where(and(...whereConditions))
                .orderBy(
                    order === 'asc'
                        ? users[safeSortBy]
                        : desc(users[safeSortBy])
                )
                .offset(start)
                .limit(limit),
            this.db
                .select({ count: sql<number>`count(*)` })
                .from(users)
                .where(and(...whereConditions))
        ]);

        return { data, start, limit, total: count };
    }
}