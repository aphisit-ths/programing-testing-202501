import {eq, and, or, desc, isNull, sql} from 'drizzle-orm';
import {User} from "./user.model";
import {users} from "../../db/schema";
import {BunSQLiteDatabase} from "drizzle-orm/bun-sqlite";
import {Database} from "bun:sqlite";
import {CreateUserDto, IFindAllUserPaginateResp, IQueryParams, UpdateUserDto} from "./types";

export class UserRepo {
    constructor(private db: BunSQLiteDatabase<any> & { $client: Database }) {
    }

    async create(data: CreateUserDto): Promise<User> {
        const [user] = await this.db.insert(users).values(data).returning();
        return user;
    }

    async getById(id: number): Promise<User | null> {
        const [user] = await this.db
            .select()
            .from(users)
            .where(and(
                eq(users.id, id),
                isNull(users.deletedAt)
            ))
            .limit(1);
        return user || null;
    }

    async getByEmail(email: string): Promise<User | null> {
        const [user] = await this.db
            .select()
            .from(users)
            .where(and(
                eq(users.email, email),
                isNull(users.deletedAt)
            ))
            .limit(1);
        return user || null;
    }

    async update(data: UpdateUserDto): Promise<User | null> {
        // @ts-ignore
        const updateData: UpdateUserDto = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.age !== undefined) updateData.age = data.age;
        if (data.email !== undefined) updateData.email = data.email;
        if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;

        if (Object.keys(updateData).length === 0) {
            // ถ้าไม่มีข้อมูลอัปเดต ให้ return ข้อมูลเดิม
            return this.getById(data.id);
        }

        const [user] = await this.db
            .update(users)
            .set(updateData)
            .where(eq(users.id, data.id))
            .returning();
        return user;
    }

    async delete(id: number): Promise<void> {
        await this.db
            .update(users)
            .set({deletedAt: new Date().toISOString()})
            .where(eq(users.id, id));
    }

    async get(queryParams: IQueryParams): Promise<IFindAllUserPaginateResp> {
        const {start = 0, limit = 10, sortBy = 'id', order = 'asc', search} = queryParams;
        // แปลงค่าเป็นตัวเลข
        const numericStart = Math.max(0, typeof start === 'string' ? parseInt(start, 10) : start);
        const numericLimit = Math.max(1, typeof limit === 'string' ? parseInt(limit, 10) : limit);

        const whereConditions = [];

        // กรองเฉพาะรายการที่ไม่ถูกลบ
        // @ts-ignore
        whereConditions.push(isNull(users.deletedAt));

        // เพิ่มเงื่อนไขค้นหาด้วย OR logic
        if (search) {
            whereConditions.push(
                // @ts-ignore
                or(
                    sql`${users.name} LIKE ${'%' + search + '%'} COLLATE NOCASE`,
                    sql`${users.email} LIKE ${'%' + search + '%'} COLLATE NOCASE`
                )
            );
        }


        const validSortFields = ['id', 'name', 'age', 'email', 'avatarUrl'] as const;
        type SortField = typeof validSortFields[number];
        const safeSortBy = validSortFields.includes(sortBy as SortField) ? sortBy as SortField : 'id';

        const [data, [{count}]] = await Promise.all([
            this.db
                .select()
                .from(users)
                .where(and(...whereConditions))
                .orderBy(
                    order === 'asc'
                        ? users[safeSortBy]
                        : desc(users[safeSortBy])
                )
                .offset(numericStart)
                .limit(numericLimit),
            this.db
                .select({count: sql<number>`count(*)`})
                .from(users)
                .where(and(...whereConditions))
        ]);

        return {data, start: numericStart, limit: numericLimit, total: count};
    }
}