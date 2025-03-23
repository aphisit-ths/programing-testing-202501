import { BadRequestException } from "../../middleware/exceptions";
import {USER_VALIDATION_ERRORS} from "../../utils/constants/user.constants";
import {CreateUserDto, UpdateUserDto} from "./types";


export interface IUserBusiness {
    validateUserData(userData: CreateUserDto | UpdateUserDto): void;

    isValidEmail(email: string): boolean;

    validate(data: unknown): CreateUserDto | UpdateUserDto;

    validateName(name: any): string;

    validateAge(age: any): number;

    validateEmail(email: any): string;

    validateAvatarUrl(url: any): string;
}


export class UserBusiness implements IUserBusiness {

    public validate(data: unknown): CreateUserDto | UpdateUserDto {
        if (typeof data !== 'object' || data === null) {
            throw new BadRequestException(USER_VALIDATION_ERRORS.INVALID_FORMAT);
        }

        this.validateUserData(data as CreateUserDto | UpdateUserDto);

        return data as CreateUserDto | UpdateUserDto;
    }

    public validateUserData(userData: CreateUserDto | UpdateUserDto): void {
        // ตรวจสอบชื่อ
        if (Object.hasOwn(userData, 'name') && userData.name !== undefined) {
            this.validateName(userData.name);
        }

        // ตรวจสอบอายุ
        if (Object.hasOwn(userData, 'age') && userData.age !== undefined) {
            this.validateAge(userData.age);
        }

        // ตรวจสอบอีเมล
        if (Object.hasOwn(userData, 'email') && userData.email !== undefined) {
            this.validateEmail(userData.email);
        }

        // ตรวจสอบ URL รูปโปรไฟล์
        if (Object.hasOwn(userData, 'avatarUrl') && userData.avatarUrl !== undefined) {
            this.validateAvatarUrl(userData.avatarUrl);
        }
    }

     public isValidEmail(email: string): boolean {
        // This regex requires at least one character before @, proper domain format, and TLD
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    public validateName(name: any): string {
        if (typeof name !== 'string') {
            throw new BadRequestException(USER_VALIDATION_ERRORS.NAME_STRING);
        }

        if (name.trim().length === 0) {
            throw new BadRequestException(USER_VALIDATION_ERRORS.NAME_EMPTY);
        }

        if (name.length > 100) {
            throw new BadRequestException(USER_VALIDATION_ERRORS.NAME_TOO_LONG);
        }

        return name;
    }

    public validateAge(age: any): number {
        if (typeof age !== 'number') {
            throw new BadRequestException(USER_VALIDATION_ERRORS.AGE_NUMBER);
        }

        if (age < 0) {
            throw new BadRequestException(USER_VALIDATION_ERRORS.AGE_NEGATIVE);
        }

        if (age > 150) {
            throw new BadRequestException(USER_VALIDATION_ERRORS.AGE_TOO_HIGH);
        }

        return age;
    }

    public validateEmail(email: any): string {
        if (typeof email !== 'string') {
            throw new BadRequestException(USER_VALIDATION_ERRORS.EMAIL_STRING);
        }

        if (!this.isValidEmail(email)) {
            throw new BadRequestException(USER_VALIDATION_ERRORS.EMAIL_INVALID);
        }

        return email;
    }

    public validateAvatarUrl(url: any): string {
        if (typeof url !== 'string') {
            throw new BadRequestException(USER_VALIDATION_ERRORS.AVATAR_STRING);
        }

        try {
            const parsedUrl = new URL(url);

            // ตรวจสอบว่าใช้ protocol HTTP หรือ HTTPS เท่านั้น
            if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
                throw new BadRequestException(USER_VALIDATION_ERRORS.AVATAR_PROTOCOL);
            }
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException(USER_VALIDATION_ERRORS.AVATAR_INVALID);
        }

        return url;
    }
}