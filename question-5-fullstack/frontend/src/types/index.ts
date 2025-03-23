export interface User {
    id: string;
    name: string;
    age: number;
    email: string;
    avatarUrl: string;
    createdAt: Date
    updatedAt: Date
    deletedAt:Date | null
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    limit: number;
    start: number;
}

export interface UserQueryParams {
    search?: string;
    start?: number;
    limit?: number;
    sortBy?: string;
    order?: string;
}