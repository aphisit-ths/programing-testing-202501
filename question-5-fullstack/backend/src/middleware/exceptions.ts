import {CONTENT_TYPE_JSON, ErrorConfig, ErrorResponse, PossibleErrorCode} from "./types";

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


export const createErrorResponse = (message: string, code: number): ErrorResponse => ({
    status: 'error',
    message,
    code
});



export const CustomError = {
    BadRequestException,
    NotFoundException
};


export function handleErrorResponse<LiteralError>(set:any, error: any, code: PossibleErrorCode) {

    set.headers['Content-Type'] = CONTENT_TYPE_JSON;

    const errorMap: Record<string, ErrorConfig> = {
        NotFoundException: {
            status: 404,
            response: createErrorResponse(error.message, error.status)
        },
        BadRequestException: {
            status: 400,
            response: createErrorResponse(error.message, error.status)
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
