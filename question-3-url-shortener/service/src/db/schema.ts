import {
    sqliteTable,
    text,
    integer,
    primaryKey,
    uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const lookupUrls = sqliteTable(
    "lookup_urls",
    {
        id: text("id").notNull().primaryKey(),
        originalUrl: text("original_url").notNull(),
        visits: integer("visits").notNull().default(0),
        isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
        createdAt: text("created_at")
            .notNull()
            .default(sql`CURRENT_TIMESTAMP`),
        expiresAt: text("expires_at"),
        lastVisit: text("last_visit"),
    },
    (table) => ({
        originalUrlIdx: uniqueIndex("original_url_idx").on(table.originalUrl),
    })
);

export type LookUpUrl = typeof lookupUrls.$inferSelect;
