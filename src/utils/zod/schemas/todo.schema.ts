import { z } from "zod";

const createTodoSchema = z.object({
    title: z
        .string()
        .min(5, "Title Must Be At Least 5 Characters Long.")
        .max(50, "Title Must Be Less Than 50 Characters"),
    description: z
        .string()
        .min(5, "Description Must Be At Least 5 Characters Long.")
        .max(255, "Description Must Be Less Than 255 Characters"),
});

const toggleTodoStatusSchema = z.object({
    title: z
        .string()
        .min(5, "Title Must Be At Least 5 Characters Long.")
        .max(50, "Title Must Be Less Than 50 Characters"),
    isCompleted: z.boolean(),
});

export {
    createTodoSchema,
    toggleTodoStatusSchema,
};