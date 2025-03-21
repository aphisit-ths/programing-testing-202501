import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import {tr} from "@faker-js/faker";

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({autoIncrement: true}),
    name: text('name').notNull(),
    age: integer('age').notNull(),
    email: text('email').notNull(),
    avatarUrl: text('avatar_url').notNull(),
    created_at: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
    updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow(),
    deleted_at: integer('deleted_at', { mode: 'timestamp' }),
}, (table) => ({
    emailIdx: uniqueIndex('email_idx').on(table.email),
}));


export const healthChecks = sqliteTable('healthcheck', {
    id: integer('id').primaryKey({autoIncrement:true}).notNull(),
    say: text('say').notNull(),
});
export type HealthCheck = typeof healthChecks.$inferSelect;
export type User = typeof users.$inferSelect;
