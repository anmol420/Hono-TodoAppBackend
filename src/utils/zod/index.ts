import {
    registerSchema,
    verifyRegistrationOTPSchema,
    loginSchema,
    forgotPasswordSchema,
    verifyForgotPasswordOTPSchema,
    changeForgotPasswordSchema,
    changePasswordSchema,
} from "./schemas/user.schema";

import {
    createTodoSchema,
    toggleTodoStatusSchema,
    updateTodoSchema,
    findTodoByIdSchema,
    deleteTodoSchema,
} from "./schemas/todo.schema"

export {
    registerSchema,
    verifyRegistrationOTPSchema,
    loginSchema,
    forgotPasswordSchema,
    verifyForgotPasswordOTPSchema,
    changeForgotPasswordSchema,
    changePasswordSchema,
    createTodoSchema,
    toggleTodoStatusSchema,
    updateTodoSchema,
    findTodoByIdSchema,
    deleteTodoSchema,
};