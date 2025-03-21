export class NotFoundException extends Error {
    status = 404;
    constructor(message = "ไม่พบข้อมูล") {
        super(message);
    }
}

export class BadRequestException extends Error {
    status = 400;
    constructor(message = "ข้อมูลไม่ถูกต้อง") {
        super(message);
    }
}

import { Elysia } from 'elysia';

export const errorHandler = new Elysia()
    .onError(({ code, error, set }) => {



    });