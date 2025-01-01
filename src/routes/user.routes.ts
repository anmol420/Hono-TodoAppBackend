import { Hono } from "hono";

import {
    registerUser,
    loginUser,
    logoutUser,
} from "../controllers/user.controller";
import authenticateUser from "../middlewares/auth.middleware";

const userRoutes = new Hono();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);

// secure route
userRoutes.post("/logout", authenticateUser, logoutUser);

export default userRoutes;