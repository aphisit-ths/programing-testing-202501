import {BadRequestException} from "../middleware/exceptions";
import {CreteUserDto, IQueryParams, UpdateUserDto} from "../controllers/type";
import {User} from "../models/user.model";

export class UserRepo {

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

    get(query:IQueryParams): Promise<User[]> {
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