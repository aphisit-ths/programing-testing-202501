export const USER_VALIDATION_ERRORS = {
    INVALID_FORMAT: 'Invalid data format',
    NAME_STRING: 'name must be a string',
    NAME_EMPTY: 'name cannot be empty',
    NAME_TOO_LONG: 'name cannot exceed 100 characters',
    AGE_NUMBER: 'age must be a number',
    AGE_NEGATIVE: 'age cannot be negative',
    AGE_TOO_HIGH: 'age cannot exceed 150',
    EMAIL_STRING: 'email must be a string',
    EMAIL_INVALID: 'invalid email format',
    AVATAR_STRING: 'avatarUrl must be a string',
    AVATAR_INVALID: 'invalid avatarUrl format',
    AVATAR_PROTOCOL: 'avatarUrl must use HTTP or HTTPS protocol',

    ID_REQUIRED: 'user id is required',

    EMAIL_EXISTS: 'Email already exists',
    USER_NOT_FOUND: 'User not found',
    EMAIL_REQUIRED: 'Email is required for update',
    ALREADY_DELETED: 'Cant delete a user',
    DELETE_SUCCESS: 'I will missing you',
    MISSING_REQUIRED_FIELDS: "Missing some require fields",
    NO_UPDATE_DATA: "No fields to update"
};
