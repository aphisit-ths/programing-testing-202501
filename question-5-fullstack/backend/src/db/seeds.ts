// File: seed.ts
import { faker } from '@faker-js/faker';
import {HealthCheck, healthChecks, users} from "./schema";
import {runMigrations} from "./migrate";
import {db} from "./db";
import {sql} from "drizzle-orm";

async function seedUsers(count: number = 100) {
    console.log(`Starting to seed ${count} users...`);

    runMigrations();

    await db.delete(users)
    await db.delete(healthChecks)

    await db.run(sql`DELETE FROM sqlite_sequence WHERE name='users'`);
    await db.run(sql`DELETE FROM sqlite_sequence WHERE name='health_checks'`);


    // Generate random users
    const userData = Array.from({ length: count }, () => ({
        name: faker.person.fullName(),
        age: faker.number.int({ min: 18, max: 80 }),
        email: faker.internet.email().toLowerCase(),
        avatarUrl: faker.image.avatar(),
        created_at: faker.date.past(),
        updated_at: new Date(),
    }));

    const healthCheckData = {
        say: "I'm fine !"
    }

    await db.insert(healthChecks).values([healthCheckData]);

    const BATCH_SIZE = 100;
    for (let i = 0; i < userData.length; i += BATCH_SIZE) {
        const batch = userData.slice(i, i + BATCH_SIZE);
        await db.insert(users).values(batch);
        console.log(`Inserted batch ${i / BATCH_SIZE + 1} (${batch.length} users)`);
    }

    console.log(`Successfully seeded ${count} users`);
}

if (require.main === module) {
    const count = process.argv[2] ? parseInt(process.argv[2], 10) : 100;

    seedUsers(count)
        .then(() => {
            console.log('Seeding completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Seeding failed:', error);
            process.exit(1);
        });
}

export { seedUsers };