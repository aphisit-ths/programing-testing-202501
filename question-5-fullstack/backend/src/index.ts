// index.ts (or your main file)
import { Elysia, t } from "elysia";
import 'dotenv/config';
import { healthChecks } from "./db/schema";
import { db } from "./db/db";
import { UserController } from "./modules/users/user.controller";
import { BadRequestException, NotFoundException } from "./middleware/exceptions";

// Type definitions
interface ErrorResponse {
    status: 'error';
    message: string;
    code: number;
}

interface ErrorConfig {
    status: number;
    response: ErrorResponse;
}

// Constants
const DEFAULT_PORT: number = 7777;
const CONTENT_TYPE_JSON: string = 'application/json';

// Error response factory
const createErrorResponse = (message: string, code: number): ErrorResponse => ({
    status: 'error',
    message,
    code
});

// Health check
const getHealthStatus = async (): Promise<unknown> => {
    try {
        return await db.select().from(healthChecks).limit(1);
    } catch (error) {
        throw new Error('Database health check failed');
    }
};

// Error handler configuration
const errorHandler = {
    BadRequestException,
    NotFoundException
};

function bro<LiteralError>(set: {
    headers: HTTPHeaders;
    status?: number | keyof StatusMap;
    redirect?: string;
    cookie?: Record<string, ElysiaCookie>
}, error: Readonly<Error> | Readonly<ValidationError> | Readonly<NotFoundError> | Readonly<ParseError> | Readonly<InternalServerError> | Readonly<InvalidCookieSignature> | Readonly<ElysiaCustomStatusResponse<number>> | Readonly<BadRequestException> | Readonly<NotFoundException>, code: "UNKNOWN" | "VALIDATION" | "NOT_FOUND" | "PARSE" | "INTERNAL_SERVER_ERROR" | "INVALID_COOKIE_SIGNATURE" | number | "BadRequestException" | "NotFoundException") {
    set.headers['Content-Type'] = CONTENT_TYPE_JSON;

    const errorMap: Record<string, ErrorConfig> = {
        NotFoundException: {
            status: 404,
            response: createErrorResponse(error.message, 404)
        },
        BadRequestException: {
            status: 400,
            response: createErrorResponse(error.message, 400)
        }
    };

    const errorConfig: ErrorConfig = errorMap[code] || {
        status: 500,
        response: createErrorResponse(
            error?.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ',
            500
        )
    };

    set.status = errorConfig.status;
    return errorConfig.response;
}

// Main application setup
const app = new Elysia()
    .error(errorHandler)
    .onError(({ code, error, set }) => {
        return bro(set, error, code);
    })
    .use(UserController)
    .get('/', async () => await getHealthStatus(), {
        response: t.Any()
    });

// Server initialization
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