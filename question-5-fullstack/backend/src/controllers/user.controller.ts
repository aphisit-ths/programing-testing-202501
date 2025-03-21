import {UserFlow} from "../flows/user.flow";
import {CreteUserDto, IQueryParams, UpdateUserDto} from "./type";

export class UserController {
    constructor(private userFlow: UserFlow) {
    }

    async getUsers(query: IQueryParams) {
        try {
            return await this.userFlow.findAll(query);
        } catch (error) {
            throw error;
        }
    }

    async getUserById(userId: number) {
        try {
            return await this.userFlow.findUserById(userId);
        } catch (error) {
            throw error;
        }
    }

    async createUser(userData: CreteUserDto) {
        try {
            return await this.userFlow.create(userData);
        } catch (error) {
            throw error;
        }
    }

    async updateUser(userData: UpdateUserDto) {
        try {
            return await this.userFlow.update(userData);
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(userId: number) {
        try {
            return await this.userFlow.delete(userId);
        } catch (error) {
            throw error;
        }
    }

}