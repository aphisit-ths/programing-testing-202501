// lib/api.ts
import { User, UserQueryParams, PaginatedResponse } from '@/types';

const API_BASE_URL = '/api';

export async function getUsers(params: UserQueryParams): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.set("search", params.search);
    if (params.start !== undefined) queryParams.set("start", params.start.toString());
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.sortBy) queryParams.set("sortBy", params.sortBy);
    if (params.order) queryParams.set("order", params.order);

    const response = await fetch(`${API_BASE_URL}/user?${queryParams.toString()}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    return response.json();
}

export async function getUser(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/${id}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch user with ID ${id}: ${response.statusText}`);
    }

    return response.json();
}

export async function createUser(userData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error(`Failed to create user: ${response.statusText}`);
    }

    return response.json();
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error(`Failed to update user with ID ${id}: ${response.statusText}`);
    }

    return response.json();
}

export async function deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error(`Failed to delete user with ID ${id}: ${response.statusText}`);
    }
}