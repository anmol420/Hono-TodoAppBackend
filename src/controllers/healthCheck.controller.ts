import { Context } from "hono";

import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import errorMessage from "../helpers/errorMessage.helper";

class HealthCheckController {
    async healthCheck(c: Context) {
        try {
            return c.json(
                new ApiResponse(200, null, "API Running Good."),
                200
            );
        } catch (error: unknown) {
            return c.json(
                new ApiError(500, errorMessage(error)),
                500
            )
        }
    }
} 

export default HealthCheckController;