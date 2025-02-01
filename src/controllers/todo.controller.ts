import { Context } from "hono";

import getPrismaClient from "../libs/prisma";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import errorMessage from "../helpers/errorMessage.helper";

const prisma = getPrismaClient();

class TodoController {
    async createTodo(c: Context) {
        const { title, description } = c.get("validatedBody");
        if (!title || !description) {
            return c.json(
                new ApiError(404, { message: "Title and Description Not Found." }),
                404
            );
        }
        const user = c.get("user");
        const todo = await prisma.todo.findFirst({
            where: {
                AND: [
                    { title },
                    { ownerId: user.id },
                ],
            },
        });
        if (todo) {
            return c.json(
                new ApiError(400, { message: "Todo With Same Title Already Exists." }),
                400
            );
        }
        try {
            const newTodo = await prisma.todo.create({
                data: {
                    title,
                    description,
                    ownerId: user.id,
                },
            });
            return c.json(
                new ApiResponse(200, newTodo, "Todo Created Successfully."),
                200
            );
        } catch (error: unknown) {
            return c.json(
                new ApiError(500, errorMessage(error)),
                500
            );
        }
    }
    async toggleTodoStatus(c: Context) {
        const { title, isCompleted } = c.get("validatedBody");
        if (!title) { 
            return c.json(

                new ApiError(404, { message: "Title Not Found." }),
                404
            );
        }
        const toggleStatus = isCompleted ? isCompleted : false;
        const user = c.get("user");
        const todo = await prisma.todo.findFirst({
            where: {
                AND: [
                    { title },
                    { ownerId: user.id },
                ],
            },
        });
        if (!todo) {
            return c.json(
                new ApiError(404, { message: "Todo Not Found." }),
                404
            );
        }
        try {
            const updatedTodo = await prisma.todo.update({
                where: {
                    id: todo.id,
                },
                data: {
                    isCompleted: toggleStatus,
                },
            });
            return c.json(
                new ApiResponse(200, updatedTodo, "Todo Status Updated Successfully."),
                200
            );
        } catch (error: unknown) {
            return c.json(
                new ApiError(500, errorMessage(error)),
                500
            );
        }
    }
}

export default TodoController;