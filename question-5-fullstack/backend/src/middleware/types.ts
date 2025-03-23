export interface ErrorResponse {
    status: 'error';
    message: string;
    code: number;
}

export interface ErrorConfig {
    status: number;
    response: ErrorResponse;
}

export const CONTENT_TYPE_JSON: string = 'application/json';

export type PossibleErrorCode =
    number
    | "NotFoundException"
    | "BadRequestException"
    | "UNKNOWN"
    | "VALIDATION"
    | "NOT_FOUND"
    | "PARSE"
    | "INTERNAL_SERVER_ERROR"
    | "INVALID_COOKIE_SIGNATURE"