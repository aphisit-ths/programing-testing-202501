// src/controllers/user.controller.ts
import { Elysia } from 'elysia';
import {db} from "../../db/db";
import {UserRepo} from "./user.repo";
import {UserBusinessFlow} from "./user.flow";
import {errorHandler} from "../../middleware/exceptions";
interface UserContext {
    userBusinessFlow: UserBusinessFlow;
}

const repo = new UserRepo(db);
const userService = new UserBusinessFlow(repo);

// @ts-ignore
export const UserController = new Elysia({ prefix: '/api/user' })
    .get('/:id', ({ params: { id } }) =>
        userService.findById(Number(id))
    )
    .post('/', ({ body }) =>
        userService.create(body)
    )
    .put('/', ({ body }) =>
        userService.update(body)
    )
    .delete('/:id', ({ params: { id } }) =>
        userService.deleteById(Number(id))
    )
    .get('/', ({ query }) =>
        userService.find(query)
    );