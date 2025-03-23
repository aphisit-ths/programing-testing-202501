import {
    sqliteTable,
    text,
    integer,
    uniqueIndex,
} from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";

export const users = sqliteTable(
    "users",
    {
        id: integer("id").primaryKey({autoIncrement: true}),
        name: text("name").notNull(),
        age: integer("age").notNull(),
        email: text("email").notNull(),
        avatarUrl: text("avatar_url").notNull(),

        createdAt: text("created_at")
            .notNull()
            .default(sql`CURRENT_TIMESTAMP`),
        updatedAt: text("updated_at")
            .notNull()
            .default(sql`CURRENT_TIMESTAMP`),
        deletedAt: text("deleted_at"),
    },
    (table) => ({
        emailIdx: uniqueIndex("email_idx").on(table.email),
    })
);

export const healthChecks = sqliteTable("healthcheck", {
    id: integer("id").primaryKey({autoIncrement: true}).notNull(),
    say: text("say").notNull(),
});
export type HealthCheck = typeof healthChecks.$inferSelect;
export type User = typeof users.$inferSelect;
