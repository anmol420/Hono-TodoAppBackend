import {Context} from "hono";

import Todo from "../models/todo.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import errorMessage from "../helpers/errorMessage.helper";

class TodoController {
    async createTodo(c: Context) {
        const {title, description} = c.get("validatedBody");
        if (!title || !description) {
            return c.json(
                new ApiError(404, {message: "Title and Description Not Found."}),
                404
            );
        }
        const user = c.get("user");
        const todo = await Todo.findOne({
            title,
            ownerId: user._id,
        });
        if (todo) {
            return c.json(
                new ApiError(400, {message: "Todo With Same Title Already Exists."}),
                400
            );
        }
        try {
            const newTodo = await Todo.create({
                title,
                description,
                ownerId: user._id,
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
        const {title, isCompleted} = c.get("validatedBody");
        if (!title) {
            return c.json(
                new ApiError(404, {message: "Title Not Found."}),
                404
            );
        }
        const toggleStatus = isCompleted ? isCompleted : false;
        const user = c.get("user");
        const todo = await Todo.findOne({
            title,
            ownerId: user._id,
        });
        if (!todo) {
            return c.json(
                new ApiError(404, {message: "Todo Not Found."}),
                404
            );
        }
        try {
            const updatedTodo = await Todo.findByIdAndUpdate(
                todo._id,
                {
                    $set: {
                        isCompleted: toggleStatus,
                    }
                },
                {
                    new: true,
                }
            );
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