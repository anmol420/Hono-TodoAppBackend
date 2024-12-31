import { Context } from "hono";

import getPrismaClient from "../libs/prisma";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import errorMessage from "../helpers/errorMessage.helper";

const prisma = getPrismaClient();

const registerUser = async (c: Context) => {
    const { username: newUsername, email: newEmail, password: newPassword } = await c.req.json();
    if (!newUsername || !newEmail || !newPassword) {
        return c.json(
            new ApiError(404, { message: "Username, Email and Passoword Not Found." }),
            404
        );
    }
    const existedUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username: newUsername },
                { email: newEmail }
            ]
        }
    });
    if (existedUser) {
        return c.json(
            new ApiError(400, { message: "User Already Exists."})
        )
    }
    try {
        const hashedPassword = await Bun.password.hash(newPassword, {
            algorithm: "argon2id",
            timeCost: 13,
        });
        const user = await prisma.user.create({
            data: {
                username: newUsername,
                email: newEmail,
                password: hashedPassword,
            }
        });
        return c.json(
            new ApiResponse(200, user, "User Registered Successfully."),
            200
        );
    } catch (error: unknown) {
        return c.json(
            new ApiError(500, errorMessage(error)),
            500
        );
    }
}

export {
    registerUser,
};