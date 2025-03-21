import {UserRepo} from "../repositories/user.repo";
import { User} from "../models/user.model";
import {BadRequestException, NotFoundException} from "../middleware/exceptions";
import {UserBusiness} from "../logic/user.logic";
import {CreteUserDto, IQueryParams, UpdateUserDto} from "../controllers/type";

export class UserFlow {
    constructor(private readonly repo: UserRepo) {
    }

    public async create(user: CreteUserDto) {
        UserBusiness.validateUserData(user);
        const existingUser = await this.repo.getByEmail(user.email);

        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        return await this.repo.create(user);
    }


    public async findUserById(id: number): Promise<User> {
        const user = await this.repo.getById(id)
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user
    }

    public async update(user: UpdateUserDto) {
        UserBusiness.validateUserData(user);
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

    public async findAll(query:IQueryParams): Promise<User[]> {
        return await this.repo.get(query)
    }
}