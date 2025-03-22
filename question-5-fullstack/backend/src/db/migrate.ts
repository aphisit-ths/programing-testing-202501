import {migrate} from "drizzle-orm/better-sqlite3/migrator";
import {db} from "./db";

export function runMigrations() {
    try {
        const migrationsFolder =  'src/db/migrations';
        console.log(`Migrations folder exists: ${migrationsFolder}`);
        migrate(db, { migrationsFolder });
        console.log('Migrations completed successfully');
    } catch (error) {
        console.error('Migration error:', error);
        throw error;
    }
}

runMigrations()