import {z} from "zod";

const createTodoSchema = z.object({
    title: z
        .string()
        .min(5, "Title Must Be At Least 5 Characters Long.")
        .max(50, "Title Must Be Less Than 50 Characters"),
    description: z
        .string()
        .optional(),
});

const toggleTodoStatusSchema = z.object({
    id: z.string(),
    isCompleted: z.boolean(),
});

const updateTodoSchema = z.object({
    id: z.string(),
    title: z
        .string()
        .min(5, "Title Must Be At Least 5 Characters Long.")
        .max(50, "Title Must Be Less Than 255 Characters"),
    description: z
        .string()
        .optional(),
});

const findTodoByIdSchema = z.object({
    id: z.string()
});

const deleteTodoSchema = z.object({
    id: z.string()
});

export {
    createTodoSchema,
    toggleTodoStatusSchema,
    updateTodoSchema,
    findTodoByIdSchema,
    deleteTodoSchema
};