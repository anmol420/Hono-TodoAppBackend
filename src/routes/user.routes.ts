import { Hono } from "hono";

import UserController from "../controllers/user.controller";

import authenticateUser from "../middlewares/auth.middleware";
import zodValidator from "../middlewares/zodValidator.middlware";
import arcjetMiddleware from "../middlewares/arcjet.middleware";

import {
    registerSchema,
    verifyRegistrationOTPSchema,
    loginSchema,
    forgotPasswordSchema,
    verifyForgotPasswordOTPSchema,
    changeForgotPasswordSchema,
    changePasswordSchema,
} from "../utils/zod";

const userRoutes = new Hono();
const userController = new UserController();

userRoutes.use(arcjetMiddleware);

userRoutes.post("/register", zodValidator(registerSchema), userController.registerUser);
userRoutes.post("/verifyRegistrationOTP", zodValidator(verifyRegistrationOTPSchema), userController.verifyRegisteredUser);
userRoutes.post("/login", zodValidator(loginSchema), userController.loginUser);

userRoutes.post("/forgotPassword", zodValidator(forgotPasswordSchema), userController.forgotPassword);
userRoutes.post("/verifyForgotPasswordOTP", zodValidator(verifyForgotPasswordOTPSchema), userController.verifyForgotPasswordOTP);
userRoutes.post("/changeForgotPassword", zodValidator(changeForgotPasswordSchema), userController.changeForgotPassword);

// secure route
userRoutes.post("/logout", authenticateUser, userController.logoutUser);
userRoutes.patch("/changePassword", authenticateUser, zodValidator(changePasswordSchema), userController.changePassword);
userRoutes.get("/profile", authenticateUser, userController.userProfile);
userRoutes.get("/dashboard", authenticateUser, userController.userDashboard);

export default userRoutes;