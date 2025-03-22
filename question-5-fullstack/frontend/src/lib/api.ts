// lib/api.ts
import {User, UserQueryParams, PaginatedResponse} from '@/types';

const API_BASE_URL = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            // ถ้า API ส่ง error response เป็น JSON
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        } else {
            // ถ้า API ส่ง error response ในรูปแบบอื่น
            const errorText = await response.text();
            throw new Error(errorText || response.statusText);
        }
    }

    return response.json() as Promise<T>;
}

export async function getUsers(params: UserQueryParams): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.set("search", params.search);
    if (params.start !== undefined) queryParams.set("start", params.start.toString());
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.sortBy) queryParams.set("sortBy", params.sortBy);
    if (params.order) queryParams.set("order", params.order);

    const response = await fetch(`${API_BASE_URL}/user?${queryParams.toString()}`);
    return handleResponse<PaginatedResponse<User>>(response);
}

export async function getUser(id: string): Promise<User | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/user/${id}`);

        if (response.status === 404) {
            return null;
        }
        return handleResponse<User>(response);
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

export async function createUser(userData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    return handleResponse<User>(response);
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    return handleResponse<User>(response);
}

export async function deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: "DELETE"
    });

    return handleResponse<void>(response);
}