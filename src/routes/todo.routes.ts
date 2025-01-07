import { Hono } from "hono";

import TodoController from "../controllers/todo.controller";

import authenticateUser from "../middlewares/auth.middleware";
import zodValidator from "../middlewares/zodValidator.middlware";

import {
    createTodoSchema,
} from "../utils/zod/todo.schema"

const todoRoutes = new Hono();
const todoController = new TodoController();

todoRoutes.post("/create", authenticateUser, zodValidator(createTodoSchema), todoController.createTodo);

export default todoRoutes;