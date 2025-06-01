import { z } from 'zod';

const passwordSchema = z
    .string()
    .min(6, "Password Must Be At Least 6 Characters Long.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")

const registerSchema = z.object({
    username: z.string().min(3, "Username Must Be At Least 3 Characters Long."),
    email: z.string().email("Invalid Email."),
    password: passwordSchema,
});

const verifyRegistrationOTPSchema = z.object({
    email: z.string().email("Invalid Email."),
    otp: z.string(),
});

const loginSchema = z.object({
    email: z.string().email("Invalid Email."),
    password: passwordSchema,
});

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid Email."),
});

const verifyForgotPasswordOTPSchema = z.object({
    email: z.string().email("Invalid Email."),
    otp: z.string(),
});

const changeForgotPasswordSchema = z.object({
    email: z.string().email("Invalid Email."),
    password: passwordSchema,
});

const changePasswordSchema = z.object({
    oldPassword: z.string(),
    newPassword: passwordSchema,
});

export {
    registerSchema,
    verifyRegistrationOTPSchema,
    loginSchema,
    forgotPasswordSchema,
    verifyForgotPasswordOTPSchema,
    changeForgotPasswordSchema,
    changePasswordSchema,
};