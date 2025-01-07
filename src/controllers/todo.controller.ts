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
}

export default TodoController;