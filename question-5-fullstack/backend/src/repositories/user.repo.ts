import {CreteUserDto, UpdateUserDto, User} from "../models/user.model";
import {BadRequestException} from "../middleware/exceptions";

interface IUser {
    get(query: string, start: number, limit: number): Promise<User[]>;

    getById(id: number): Promise<User>;

    getByEmail(email: string): Promise<User>;

    create(body: CreteUserDto): Promise<User>;

    update(body: UpdateUserDto): Promise<User>;

    delete(id: number): Promise<User>;
}

export class UserRepo implements IUser {

    constructor(private readonly db: any) {
    }

    create(body: CreteUserDto): Promise<User> {
        try {
            throw new BadRequestException('Cant create a new user');
        } catch (err) {
            throw new Error('Cant create a new user');
        }
    }

    delete(id: number): Promise<User> {
        try {
            throw new BadRequestException('Cant delete a user');
        } catch (err) {
            throw new Error('Cant delete a user');
        }
    }

    get(query: string, start: number, limit: number): Promise<User[]> {
        return Promise.resolve([]);
    }

    getById(id: number): Promise<User> {
        try {
            throw new BadRequestException('This method not implemented');
        } catch (err) {
            throw new Error('This method not implemented');
        }
    }

    update(body: UpdateUserDto): Promise<User> {
        try {
            throw new BadRequestException('This method not implemented');
        } catch (err) {
            throw new Error('This method not implemented');
        }
    }

    getByEmail(email: string): Promise<User> {
        try {
            throw new BadRequestException('This method not implemented');
        } catch (err) {
            throw new Error('This method not implemented');
        }
    }

}