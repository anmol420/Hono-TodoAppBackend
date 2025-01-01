import { Context } from "hono";
import { deleteCookie, setSignedCookie } from "hono/cookie";

import getPrismaClient from "../libs/prisma";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import errorMessage from "../helpers/errorMessage.helper";
import { generateToken } from "../helpers/jwtToken";

const prisma = getPrismaClient();

const registerUser = async (c: Context) => {
    const text = await c.req.text();
    let body;
    try {
        body = JSON.parse(text);
    } catch {
        return c.json(
            new ApiError(400, { message: "Invalid JSON." }),
            400
        );
    }
    const { username: newUsername, email: newEmail, password: newPassword } = body;
    if (!newUsername || !newEmail || !newPassword) {
        return c.json(
            new ApiError(404, { message: "Username, Email and Password Not Found." }),
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

const loginUser = async (c: Context) => {
    const text = await c.req.text();
    let body;
    try {
        body = JSON.parse(text);
    } catch {
        return c.json(
            new ApiError(400, { message: "Invalid JSON." }),
            400
        );
    }
    const { email: userEmail, password: userPassword } = body;
    if (!userEmail || !userPassword) {
        return c.json(
            new ApiError(404, { message: "Email and Password Not Found." }),
            404
        );
    }
    const user = await prisma.user.findFirst({
        where: {
            email: userEmail,
        }
    });
    if (!user) {
        return c.json(
            new ApiError(404, { message: "User Not Found." }),
            404
        );
    }
    const isPasswordMatch = await Bun.password.verify(userPassword, user.password);
    if (!isPasswordMatch) {
        return c.json(
            new ApiError(400, { message: "Invalid Password." }),
            400
        );
    }
    try {
        const token = await generateToken({ userid: user.id });
        await setSignedCookie(
            c,
            "token",
            token as string,
            process.env.COOKIE_SIGNATURE as string,
            {
                httpOnly: true,
                secure: true,
            }
        );
        return c.json(
            new ApiResponse(200, user, "User Logged In Successfully."),
            200
        );
    } catch (error: unknown) {
        return c.json(
            new ApiError(500, errorMessage(error)),
            500
        );
    }
};

const logoutUser = async (c: Context) => {
    try {
        deleteCookie(c, "token");
        return c.json(
            new ApiResponse(200, null, "User Logged Out Successfully."),
            200
        );
    } catch (error: unknown) {
        return c.json(
            new ApiError(500, errorMessage(error)),
            500
        );
    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
};