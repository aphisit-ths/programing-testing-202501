import {
    Elysia,
    t,
} from "elysia";
import 'dotenv/config';
import {healthChecks} from "./db/schema";
import {db} from "./db/db";
import {UserController} from "./modules/users/user.controller";
import {CustomError, handleErrorResponse} from "./middleware/exceptions";



const DEFAULT_PORT: number = 7777;


const getHealthStatus = async (): Promise<unknown> => {
    try {
        return await db.select().from(healthChecks).limit(1);
    } catch (error) {
        throw new Error('Database health check failed');
    }
};

// Main application setup
const app = new Elysia()
    .error(CustomError)
    .onError(({code, error, set}) => {
        return handleErrorResponse(set, error, code);
    })
    .use(UserController)
    .get('/', async () => await getHealthStatus(), {
        response: t.Any()
    });

const startServer = async (): Promise<void> => {
    try {
        const port: number = Number(process.env.PORT) || DEFAULT_PORT;
        await app.listen(port);
        console.log(`🦊 Elysia is running at ${app.server?.hostname}:${port}`);
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();