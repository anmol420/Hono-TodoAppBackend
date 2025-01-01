import { z } from 'zod';

const registerSchema = z.object({
    username: z.string().min(3, "Username Must Be At Least 3 Characters Long."),
    email: z.string().email("Invalid Email."),
    password: z.string().min(6, "Password Must Be At Least 6 Characters Long."),
});

const loginSchema = z.object({
    email: z.string().email("Invalid Email."),
    password: z.string().min(6, "Password Must Be At Least 6 Characters Long."),
});

export {
    registerSchema,
    loginSchema,
};