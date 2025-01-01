import { Context, MiddlewareHandler } from "hono";
import { ZodSchema } from "zod";

import ApiError from "../utils/ApiError";

const zodValidator = (schema: ZodSchema): MiddlewareHandler => {
    return async (c: Context, next: Function) => {
        const text = await c.req.text();
        let body;
        try {
            body = JSON.parse(text);
        } catch (error: unknown) {
            return c.json(
                new ApiError(400, "Invalid JSON"),
                400
            );
        }

        const result = schema.safeParse(body);
        if (!result.success) {
            return c.json(
                new ApiError(400, result.error.errors),
                400
            );
        }

        c.set("validatedBody", result.data);
        await next();
    };
};

export default zodValidator;