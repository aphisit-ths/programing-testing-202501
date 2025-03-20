import {BadRequestException} from "../middleware/exceptions";

export class UserLogic {
    static validateEmail(email: string) {
        throw new BadRequestException('')
    }

    static validateAge(age: number) {

    }

    static validateName(name: string) {

    }

    static validateAvatar(avatarUrl: string) {

    }
}