import {UserRepo} from "./user.repo";
import {User} from "./user.model";
import {BadRequestException, NotFoundException} from "../../middleware/exceptions";
import {UserBusiness} from "./user.logic";
import {USER_VALIDATION_ERRORS} from "../../utils/constants/user.constants";
import {CreateUserDto, IFindAllUserPaginateResp, IQueryParams, IUserBusinessFlow, UpdateUserDto} from "./types";

export class UserBusinessFlow implements IUserBusinessFlow {
    private readonly userBusiness: UserBusiness;

    constructor(private readonly repo: UserRepo) {
        this.userBusiness = new UserBusiness();
    }

    public async create(userData: CreateUserDto): Promise<User> {
        if (!userData.name || !userData.age === undefined || !userData.email || !userData.avatarUrl) {
            throw new BadRequestException(USER_VALIDATION_ERRORS.MISSING_REQUIRED_FIELDS);
        }

        this.userBusiness.validateUserData(userData);

        const existingUser = await this.repo.getByEmail(userData.email);
        if (existingUser) {
            throw new BadRequestException(USER_VALIDATION_ERRORS.EMAIL_EXISTS);
        }

        return await this.repo.create(userData);
    }

    public async findById(id: number): Promise<User> {
        const user = await this.repo.getById(id);
        if (!user) {
            throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND);
        }
        return user;
    }

    public async update(userData: UpdateUserDto): Promise<User | null> {
        if (!userData.id) {
            throw new BadRequestException(USER_VALIDATION_ERRORS.ID_REQUIRED);
        }

        if (userData.name === undefined &&
            userData.age === undefined &&
            userData.email === undefined &&
            userData.avatarUrl === undefined) {
            throw new BadRequestException(USER_VALIDATION_ERRORS.NO_UPDATE_DATA);
        }

        this.userBusiness.validateUserData(userData);

        const existingUser = await this.repo.getById(userData.id);
        if (!existingUser) {
            throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND);
        }

        if (userData.email && userData.email !== existingUser.email) {
            const userWithSameEmail = await this.repo.getByEmail(userData.email);
            if (userWithSameEmail) {
                throw new BadRequestException(USER_VALIDATION_ERRORS.EMAIL_EXISTS);
            }
        }

        return await this.repo.update(userData);
    }

    public async deleteById(id: number): Promise<{ message: string }> {
        const existingUser = await this.repo.getById(id);
        if (!existingUser) {
            throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND);
        }
        if (existingUser.deletedAt != null) {
            throw new BadRequestException(USER_VALIDATION_ERRORS.ALREADY_DELETED);
        }
        await this.repo.delete(id);
        return {message: `${USER_VALIDATION_ERRORS.DELETE_SUCCESS} ${existingUser.name}`};
    }

    public async find(query: IQueryParams): Promise<IFindAllUserPaginateResp> {
        return await this.repo.get(query);
    }
}