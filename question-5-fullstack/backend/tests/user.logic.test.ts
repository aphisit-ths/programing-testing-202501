import { describe, it, expect } from 'vitest';
import {USER_VALIDATION_ERRORS} from "../src/utils/constants/user.constants";
import {UserBusiness} from "../src/modules/users/user.logic";
import {CreateUserDto} from "../src/modules/users/types";



describe('UserBusiness', () => {
    let userBusiness = new UserBusiness();


    describe('validate', () => {
        it('should throw an error when data is not an object', () => {
            expect(() => userBusiness.validate(null)).toThrow(USER_VALIDATION_ERRORS.INVALID_FORMAT);
            expect(() => userBusiness.validate(undefined)).toThrow(USER_VALIDATION_ERRORS.INVALID_FORMAT);
            expect(() => userBusiness.validate('string')).toThrow(USER_VALIDATION_ERRORS.INVALID_FORMAT);
            expect(() => userBusiness.validate(123)).toThrow(USER_VALIDATION_ERRORS.INVALID_FORMAT);
        });

        it('should return the validated data when valid', () => {
            const validData: CreateUserDto = {
                name: 'John Doe',
                age: 30,
                email: 'john@example.com',
                avatarUrl: 'https://example.com/avatar.jpg'
            };

            expect(userBusiness.validate(validData)).toEqual(validData);
        });
    });

    describe('validateName', () => {
        it('should throw an error when name is not a string', () => {
            expect(() => userBusiness.validateName(123)).toThrow(USER_VALIDATION_ERRORS.NAME_STRING);
            expect(() => userBusiness.validateName({})).toThrow(USER_VALIDATION_ERRORS.NAME_STRING);
            expect(() => userBusiness.validateName(null)).toThrow(USER_VALIDATION_ERRORS.NAME_STRING);
        });

        it('should throw an error when name is empty', () => {
            expect(() => userBusiness.validateName('')).toThrow(USER_VALIDATION_ERRORS.NAME_EMPTY);
            expect(() => userBusiness.validateName('   ')).toThrow(USER_VALIDATION_ERRORS.NAME_EMPTY);
        });

        it('should throw an error when name exceeds 100 characters', () => {
            const longName = 'a'.repeat(101);
            expect(() => userBusiness.validateName(longName)).toThrow(USER_VALIDATION_ERRORS.NAME_TOO_LONG);
        });

        it('should return the name when valid', () => {
            expect(userBusiness.validateName('John Doe')).toBe('John Doe');
        });
    });

    describe('validateAge', () => {
        it('should throw an error when age is not a number', () => {
            expect(() => userBusiness.validateAge('30')).toThrow(USER_VALIDATION_ERRORS.AGE_NUMBER);
            expect(() => userBusiness.validateAge({})).toThrow(USER_VALIDATION_ERRORS.AGE_NUMBER);
            expect(() => userBusiness.validateAge(null)).toThrow(USER_VALIDATION_ERRORS.AGE_NUMBER);
        });

        it('should throw an error when age is negative', () => {
            expect(() => userBusiness.validateAge(-1)).toThrow(USER_VALIDATION_ERRORS.AGE_NEGATIVE);
        });

        it('should throw an error when age exceeds 150', () => {
            expect(() => userBusiness.validateAge(151)).toThrow(USER_VALIDATION_ERRORS.AGE_TOO_HIGH);
        });

        it('should return the age when valid', () => {
            expect(userBusiness.validateAge(30)).toBe(30);
            expect(userBusiness.validateAge(0)).toBe(0);
            expect(userBusiness.validateAge(150)).toBe(150);
        });
    });

    describe('validateEmail', () => {
        it('should throw an error when email is not a string', () => {
            expect(() => userBusiness.validateEmail(123)).toThrow(USER_VALIDATION_ERRORS.EMAIL_STRING);
            expect(() => userBusiness.validateEmail({})).toThrow(USER_VALIDATION_ERRORS.EMAIL_STRING);
            expect(() => userBusiness.validateEmail(null)).toThrow(USER_VALIDATION_ERRORS.EMAIL_STRING);
        });

        it('should throw an error when email format is invalid', () => {
            expect(() => userBusiness.validateEmail('invalid')).toThrow(USER_VALIDATION_ERRORS.EMAIL_INVALID);
            expect(() => userBusiness.validateEmail('invalid@')).toThrow(USER_VALIDATION_ERRORS.EMAIL_INVALID);
            expect(() => userBusiness.validateEmail('invalid@domain')).toThrow(USER_VALIDATION_ERRORS.EMAIL_INVALID);
            expect(() => userBusiness.validateEmail('@domain.com')).toThrow(USER_VALIDATION_ERRORS.EMAIL_INVALID);
        });

        it('should return the email when valid', () => {
            expect(userBusiness.validateEmail('john@example.com')).toBe('john@example.com');
            expect(userBusiness.validateEmail('john.doe@example.co.th')).toBe('john.doe@example.co.th');
            expect(userBusiness.validateEmail('john+test@example.org')).toBe('john+test@example.org');
        });
    });

    describe('isValidEmail', () => {
        it('should return false for invalid email formats', () => {
            expect(userBusiness.isValidEmail('invalid')).toBe(false);
            expect(userBusiness.isValidEmail('invalid@')).toBe(false);
            expect(userBusiness.isValidEmail('invalid@domain')).toBe(false);
            expect(userBusiness.isValidEmail('@domain.com')).toBe(false);
        });

        it('should return true for valid email formats', () => {
            expect(userBusiness.isValidEmail('john@example.com')).toBe(true);
            expect(userBusiness.isValidEmail('john.doe@example.co.th')).toBe(true);
            expect(userBusiness.isValidEmail('john+test@example.org')).toBe(true);
        });
    });

    describe('validateAvatarUrl', () => {
        it('should throw an error when avatarUrl is not a string', () => {
            expect(() => userBusiness.validateAvatarUrl(123)).toThrow(USER_VALIDATION_ERRORS.AVATAR_STRING);
            expect(() => userBusiness.validateAvatarUrl({})).toThrow(USER_VALIDATION_ERRORS.AVATAR_STRING);
            expect(() => userBusiness.validateAvatarUrl(null)).toThrow(USER_VALIDATION_ERRORS.AVATAR_STRING);
        });

        it('should throw an error when avatarUrl format is invalid', () => {
            expect(() => userBusiness.validateAvatarUrl('invalid')).toThrow(USER_VALIDATION_ERRORS.AVATAR_INVALID);
            expect(() => userBusiness.validateAvatarUrl('example.com/avatar.jpg')).toThrow(USER_VALIDATION_ERRORS.AVATAR_INVALID);
        });

        it('should throw an error when avatarUrl protocol is not http or https', () => {
            expect(() => userBusiness.validateAvatarUrl('ftp://example.com/avatar.jpg')).toThrow(USER_VALIDATION_ERRORS.AVATAR_PROTOCOL);
            expect(() => userBusiness.validateAvatarUrl('file:///avatar.jpg')).toThrow(USER_VALIDATION_ERRORS.AVATAR_PROTOCOL);
        });

        it('should return the avatarUrl when valid', () => {
            expect(userBusiness.validateAvatarUrl('http://example.com/avatar.jpg')).toBe('http://example.com/avatar.jpg');
            expect(userBusiness.validateAvatarUrl('https://example.com/avatar.jpg')).toBe('https://example.com/avatar.jpg');
        });
    });

    describe('validateUserData', () => {
        it('should validate all fields when present', () => {
            const userData: CreateUserDto = {
                name: 'John Doe',
                age: 30,
                email: 'john@example.com',
                avatarUrl: 'https://example.com/avatar.jpg'
            };

            expect(() => userBusiness.validateUserData(userData)).not.toThrow();
        });

        it('should not validate fields that are not present', () => {
            // Only validate name
            expect(() => userBusiness.validateUserData({ name: 'John Doe' })).not.toThrow();

            // Only validate age
            expect(() => userBusiness.validateUserData({ age: 30 })).not.toThrow();

            // Only validate email
            expect(() => userBusiness.validateUserData({ email: 'john@example.com' })).not.toThrow();

            // Only validate avatarUrl
            expect(() => userBusiness.validateUserData({ avatarUrl: 'https://example.com/avatar.jpg' })).not.toThrow();
        });

        it('should throw the appropriate error when any field is invalid', () => {
            expect(() => userBusiness.validateUserData({ name: '' })).toThrow(USER_VALIDATION_ERRORS.NAME_EMPTY);
            expect(() => userBusiness.validateUserData({ age: -1 })).toThrow(USER_VALIDATION_ERRORS.AGE_NEGATIVE);
            expect(() => userBusiness.validateUserData({ email: 'invalid' })).toThrow(USER_VALIDATION_ERRORS.EMAIL_INVALID);
            expect(() => userBusiness.validateUserData({ avatarUrl: 'ftp://example.com/avatar.jpg' })).toThrow(USER_VALIDATION_ERRORS.AVATAR_PROTOCOL);
        });
    });
});