import { Context } from "hono";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

const healthCheck = async (c: Context) => {
    try {
        return c.json(
            new ApiResponse(200, null, "API Running Good."),
            200
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message: "Internal Server Error.";
        throw new ApiError(500, message);
    }
}

export {
    healthCheck,
};