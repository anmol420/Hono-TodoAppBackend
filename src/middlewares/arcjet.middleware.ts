import { Context } from "hono";

import ApiError from "../utils/ApiError";
import errorMessage from "../helpers/errorMessage.helper";
import aj from "../libs/arcjet.lib";

const arcjetMiddleware = async (c: Context, next: Function) => {
    try {
        const decision = await aj.protect(c.req.raw, { requested: 1 });
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return c.json(
                    new ApiError(429, "Too Many Requests."),
                    429,
                );
            } else if (decision.reason.isBot()) {
                return c.json(
                    new ApiError(403, "No Bots Allowed."),
                    403
                );
            } else {
                return c.json(
                    new ApiError(403, "Forbidden"),
                    403
                );
            }
        }
        return next();
    } catch (error: unknown) {
        return c.json(
            new ApiError(500, errorMessage(error)),
            500
        );
    }
};

export default arcjetMiddleware;