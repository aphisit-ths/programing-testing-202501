import {User} from "../models/users/user.model";

interface IUser {
    get(query: string, start: number, limit:number): Promise<User[]>;
    getById(id:number): Promise<User>;
    create(body:User): Promise<User>;
    update(body:User): Promise<User>;
    delete(id:number): Promise<User>;
}

export class UserRepo implements IUser {
    create(body: User): Promise<User> {
        return Promise.resolve(undefined);
    }

    delete(id: number): Promise<User> {
        return Promise.resolve(undefined);
    }

    get(query: string, start: number, limit: number): Promise<User[]> {
        return Promise.resolve([]);
    }

    getById(id: number): Promise<User> {
        return Promise.resolve(undefined);
    }

    update(body: User): Promise<User> {
        return Promise.resolve(undefined);
    }
}