import {Context} from "hono";

import Todo from "../models/todo.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import errorMessage from "../helpers/errorMessage.helper";
import { Document, Types } from "mongoose";

class TodoController {
    async createTodo(c: Context) {
        const {title, description} = c.get("validatedBody");
        if (!title) {
            return c.json(
                new ApiError(404, {message: "Title Not Found."}),
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
        const {id, isCompleted} = c.get("validatedBody");
        if (!id) {
            return c.json(
                new ApiError(404, {message: "Title Not Found."}),
                404
            );
        }
        const toggleStatus = isCompleted ? isCompleted : false;
        const user = c.get("user");
        const todo = await Todo.findOne({
            _id: id,
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

    async updateTodo(c: Context) {
        const {id, title, description} = c.get("validatedBody");
        if (!id || (!title && !description)) {
            return c.json(
                new ApiError(404, {message: "Title Not Found."}),
                404,
            );
        }
        try {
            const des = description ? description : "";
            await Todo.findByIdAndUpdate(
                id,
                {
                    title,
                    description: des,
                }
            );
            return c.json(
                new ApiResponse(200, null, "Content Updated Successfully."),
                200
            );
        } catch (error: unknown) {
            return c.json(
                new ApiError(500, errorMessage(error)),
                500
            );
        }
    }

    async findTodoById(c: Context) {
        const {id} = c.get("validatedBody");
        if (!id) {
            return c.json(
                new ApiError(404, {message: "Id Not Found."}),
                404
            );
        }
        const todoById = await Todo.findById(id);
        if (!todoById) {
            return c.json(
                new ApiError(404, {message: "Todo Not Found."}),
                404,
            );
        }
        try {
            return c.json(
                new ApiResponse(200, todoById, "Todo Fetched Successfully."),
                200
            );
        } catch (error: unknown) {
            return c.json(
                new ApiError(500, errorMessage(error)),
                500
            );
        }
    }

    async todoDashboard(c: Context) {
        const user = c.get("user");
        if (!user) {
            return c.json(
                new ApiError(404, {message: "User Not Found."}),
                404
            );
        }
        const userTodos = await Todo.find({
            ownerId: user._id,
        });
        try {
            const notCompletedTodos: (Document<unknown, {}, Todo, {}> & Todo & { _id: Types.ObjectId; } & { __v: number; })[] = [];
            const completedTodos: (Document<unknown, {}, Todo, {}> & Todo & { _id: Types.ObjectId; } & { __v: number; })[] = [];
            if (!userTodos) {
                return c.json(
                    new ApiResponse(200, {completedTodos: completedTodos, notCompletedTodos: notCompletedTodos}, "Content Updated Successfully."),
                    200
                );
            }
            userTodos.forEach(todo => {
                if (todo.isCompleted) {
                    completedTodos.push(todo);
                } else {
                    notCompletedTodos.push(todo);
                }
            });
            return c.json(
                new ApiResponse(200, {completedTodos: completedTodos, notCompletedTodos: notCompletedTodos}, "Content Updated Successfully."),
                200
            );
        } catch (error: unknown) {
            return c.json(
                new ApiError(500, errorMessage(error)),
                500
            );
        }
    }

    async deleteTodo(c: Context) {
        const {id} = c.get("validatedBody");
        if (!id) {
            return c.json(
                new ApiError(404, {message: "Id Not Found."}),
                404
            );
        }
        const todoById = await Todo.findById(id);
        if (!todoById) {
            return c.json(
                new ApiError(404, {message: "Todo Not Found."}),
                404
            );
        }
        try {
            await Todo.findByIdAndDelete(id);
            return c.json(
                new ApiResponse(200, null, "Todo Deleted Successfully."),
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