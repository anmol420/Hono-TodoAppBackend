import { Hono } from "hono";

import TodoController from "../controllers/todo.controller";

import authenticateUser from "../middlewares/auth.middleware";
import zodValidator from "../middlewares/zodValidator.middlware";
import arcjetMiddleware from "../middlewares/arcjet.middleware";

import {
    createTodoSchema,
    toggleTodoStatusSchema,
} from "../utils/zod/index";

const todoRoutes = new Hono();
const todoController = new TodoController();

todoRoutes.use(arcjetMiddleware);

todoRoutes.post("/create", authenticateUser, zodValidator(createTodoSchema), todoController.createTodo);
todoRoutes.patch("/toggleStatus", authenticateUser, zodValidator(toggleTodoStatusSchema), todoController.toggleTodoStatus);

export default todoRoutes;