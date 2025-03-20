import {UserRepo} from "../repositories/user.repo";
import {CreteUserDto, UpdateUserDto, User} from "../models/user.model";
import {BadRequestException, NotFoundException} from "../middleware/exceptions";
import {UserLogic} from "../logic/user.logic";

export class UserFlow {
    constructor(private readonly repo: UserRepo) {
    }

    public async create(user: CreteUserDto) {
        this.validateUser(user);
        const existingUser = await this.repo.getByEmail(user.email);

        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        return await this.repo.create(user);
    }

    private validateUser(user: CreteUserDto) {
        UserLogic.validateEmail(user.email);
        UserLogic.validateAge(user.age);
        UserLogic.validateName(user.name);
        UserLogic.validateAvatar(user.name);
    }

    public async findUserById(id: number): Promise<User> {
        const user = await this.repo.getById(id)
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user
    }

    public async update(user: UpdateUserDto) {
        this.validateUser(user);
        const existingUser = await this.repo.getByEmail(user.email);
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }
        return await this.repo.update(user);
    }

    public async delete(id: number) {
        const existingUser = await this.repo.getById(id);
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }
        return await this.repo.delete(id);
    }

    public async findAll(query: string, start: number, limit: number): Promise<User[]> {
        return await this.repo.get(query, start, limit)
    }
}