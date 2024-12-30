import { Hono } from "hono";

import {
    registerUser,
} from "../controllers/user.controller";

const userRoutes = new Hono();

userRoutes.post("/register", registerUser);

export default userRoutes;