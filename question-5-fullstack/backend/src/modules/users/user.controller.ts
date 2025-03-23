import {Elysia} from 'elysia';
import {db} from "../../db/db";
import {UserRepo} from "./user.repo";
import {UserBusinessFlow} from "./user.flow";
import {CreateUserDto, UpdateUserDto} from "./types";
import {handleErrorResponse} from "../../middleware/exceptions";

const repo = new UserRepo(db);
const userService = new UserBusinessFlow(repo);

export const UserController = new Elysia({prefix: '/api/user'})
    .get('/:id', ({params: {id}, set}) => {
        try {
            return userService.findById(Number(id));
        } catch (error: any) {
            return handleErrorResponse(set, error, error.constructor.name);
        }
    })
    .post('/', ({body, set}) => {
        try {
            return userService.create(body as CreateUserDto);
        } catch (error: any) {
            return handleErrorResponse(set, error, error.constructor.name);
        }
    })
    .put('/:id', ({params: {id}, body, set}) => {
        try {
            const updateData = {...body as UpdateUserDto, id: Number(id)} as UpdateUserDto;
            return userService.update(updateData);
        } catch (error: any) {
            return handleErrorResponse(set, error, error.constructor.name);
        }
    })
    .delete('/:id', ({params: {id}, set}) => {
        try {
            return userService.deleteById(Number(id));
        } catch (error: any) {
            return handleErrorResponse(set, error, error.constructor.name);
        }
    })
    .get('/', ({query, set}) => {
        try {
            return userService.find(query);
        } catch (error: any) {
            return handleErrorResponse(set, error, error.constructor.name);
        }
    });