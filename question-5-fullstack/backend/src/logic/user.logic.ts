
import {BadRequestException} from "../middleware/exceptions";
import {CreteUserDto, UpdateUserDto} from "../controllers/type";

export class UserBusiness {
    public static validateUserData(userData: CreteUserDto | UpdateUserDto): void {
        if ('name' in userData && userData.name !== undefined) {
            if (typeof userData.name !== 'string') {
                throw new BadRequestException('name must be a string');
            }

            if (userData.name.trim().length === 0) {
                throw new BadRequestException('name cannot be empty');
            }

            if (userData.name.length > 100) {
                throw new BadRequestException('name cannot exceed 100 characters');
            }
        }

        if ('age' in userData && userData.age !== undefined) {
            if (typeof userData.age !== 'number') {
                throw new BadRequestException('age must be a number');
            }

            if (userData.age < 0) {
                throw new BadRequestException('age cannot be negative');
            }

            if (userData.age > 150) {
                throw new BadRequestException('age cannot exceed 150');
            }
        }

        if ('email' in userData && userData.email !== undefined) {
            if (typeof userData.email !== 'string') {
                throw new BadRequestException('email must be a string');
            }

            if (!this.isValidEmail(userData.email)) {
                throw new BadRequestException('invalid email format');
            }
        }

        if ('avatarUrl' in userData && userData.avatarUrl !== undefined) {
            if (typeof userData.avatarUrl !== 'string') {
                throw new BadRequestException('avatarUrl must be a string');
            }

            try {
                new URL(userData.avatarUrl);
            } catch (error) {
                throw new BadRequestException('invalid avatarUrl format');
            }
        }
    }

    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}