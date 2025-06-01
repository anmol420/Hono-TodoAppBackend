import { Hono } from "hono";

import TodoController from "../controllers/todo.controller";

import authenticateUser from "../middlewares/auth.middleware";
import zodValidator from "../middlewares/zodValidator.middlware";
import arcjetMiddleware from "../middlewares/arcjet.middleware";

import {
    createTodoSchema,
    toggleTodoStatusSchema,
    updateTodoSchema,
    findTodoByIdSchema,
    deleteTodoSchema,
} from "../utils/zod";

const todoRoutes = new Hono();
const todoController = new TodoController();

todoRoutes.use(arcjetMiddleware);

todoRoutes.post("/create", authenticateUser, zodValidator(createTodoSchema), todoController.createTodo);
todoRoutes.patch("/toggleStatus", authenticateUser, zodValidator(toggleTodoStatusSchema), todoController.toggleTodoStatus);
todoRoutes.patch("/updateTodo", authenticateUser, zodValidator(updateTodoSchema), todoController.updateTodo);
todoRoutes.post("/findTodoById", authenticateUser, zodValidator(findTodoByIdSchema), todoController.findTodoById);
todoRoutes.get("/todoDashboard", authenticateUser, todoController.todoDashboard);
todoRoutes.delete("/deleteTodo", authenticateUser, zodValidator(deleteTodoSchema),todoController.deleteTodo);

export default todoRoutes;