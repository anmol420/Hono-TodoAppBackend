import { Hono } from "hono";

import {
    registerUser,
    loginUser,
    logoutUser,
} from "../controllers/user.controller";

import authenticateUser from "../middlewares/auth.middleware";
import zodValidator from "../middlewares/zodValidator.middlware";

import {
    registerSchema,
    loginSchema,
} from "../utils/zod/user.schema";

const userRoutes = new Hono();

userRoutes.post("/register", zodValidator(registerSchema), registerUser);
userRoutes.post("/login", zodValidator(loginSchema), loginUser);

// secure route
userRoutes.post("/logout", authenticateUser, logoutUser);

export default userRoutes;