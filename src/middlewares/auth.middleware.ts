import { Context } from "hono";
import { getSignedCookie } from "hono/cookie";

import ApiError from "../utils/ApiError";
import getPrismaClient from "../libs/prisma";
import { decodeToken } from "../helpers/jwtToken.helper";
import errorMessage from "../helpers/errorMessage.helper";

const prisma = getPrismaClient();

const authenticateUser = async (c: Context, next: Function) => {
    const token = await getSignedCookie(c, process.env.COOKIE_SIGNATURE as string, "token");
    if (!token) {
        return c.json(
            new ApiError(401, "Unauthorized"),
            401
        );
    }
    const decodedToken = await decodeToken(token as string);
    if (!decodedToken) {
        return c.json(
            new ApiError(401, "Unauthorized"),
            401
        );
    }
    const user = await prisma.user.findUnique({
        where: {
            id: decodedToken.payload.userid as string,
        }
    });
    if (!user) {
        return c.json(
            new ApiError(401, "Unauthorized"),
            401
        );
    }
    try {
        c.set("user", user);
        return next();
    } catch (error: unknown) {
        return c.json(
        new ApiError(500, errorMessage(error)),
            500
        );
    }
};

export default authenticateUser;