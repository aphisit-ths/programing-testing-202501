import {CreateUserDto, IFindAllUserPaginateResp, IQueryParams, UpdateUserDto} from "../controllers/type";
import {User} from "./user.model";

interface IUserBusinessFlow {
    create(userData: CreateUserDto): Promise<User>;

    update(userData: UpdateUserDto): Promise<User|null>;

    deleteById(id: number): Promise<{ message: string }>;

    find(query: IQueryParams): Promise<IFindAllUserPaginateResp>

    findById(id: number): Promise<User>
}


export interface IFindAllUserPaginateResp {
    data: User[]
    start: number
    limit: number,
    total: number
}

export type Order = 'asc' | 'desc';

export interface IQueryParams {
    search?: string
    start?: number
    limit?: number
    sortBy?: string
    order?: Order
}

export interface CreateUserDto {
    name: string
    age: number
    email: string
    avatarUrl: string
}

export interface UpdateUserDto {
    id: number,
    name?: string,
    age?: number,
    email?: string,
    avatarUrl?: string
}
