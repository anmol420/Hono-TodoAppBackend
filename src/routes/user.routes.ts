import { Hono } from "hono";

import UserController from "../controllers/user.controller";

import authenticateUser from "../middlewares/auth.middleware";
import zodValidator from "../middlewares/zodValidator.middlware";
import arcjetMiddleware from "../middlewares/arcjet.middleware";

import {
    registerSchema,
    loginSchema,
} from "../utils/zod/index";

const userRoutes = new Hono();
const userController = new UserController();

userRoutes.use(arcjetMiddleware);

userRoutes.post("/register", zodValidator(registerSchema), userController.registerUser);
userRoutes.post("/login", zodValidator(loginSchema), userController.loginUser);

// secure route
userRoutes.post("/logout", authenticateUser, userController.logoutUser);
userRoutes.get("/profile", authenticateUser, userController.userProfile);
userRoutes.get("/dashboard", authenticateUser, userController.userDashboard);

export default userRoutes;