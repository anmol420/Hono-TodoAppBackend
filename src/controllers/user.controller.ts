import { Context } from "hono";
import { deleteCookie, setSignedCookie } from "hono/cookie";

import getPrismaClient from "../libs/prisma";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import errorMessage from "../helpers/errorMessage.helper";
import { generateToken } from "../helpers/jwtToken";

const prisma = getPrismaClient();

const registerUser = async (c: Context) => {
    const { username, email, password } = c.get("validatedBody");
    if (!username || !email || !password) {
        return c.json(
            new ApiError(404, { message: "Username, Email and Password Not Found." }),
            404
        );
    }
    const existedUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username },
                { email }
            ]
        }
    });
    if (existedUser) {
        return c.json(
            new ApiError(400, { message: "User Already Exists."})
        )
    }
    try {
        const hashedPassword = await Bun.password.hash(password, {
            algorithm: "argon2id",
            timeCost: 13,
        });
        const user = await prisma.user.create({
            data: {
                username,
                email,
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
    const { email, password } = c.get("validatedBody");
    if (!email || !password) {
        return c.json(
            new ApiError(404, { message: "Email and Password Not Found." }),
            404
        );
    }
    const user = await prisma.user.findFirst({
        where: {
            email,
        }
    });
    if (!user) {
        return c.json(
            new ApiError(404, { message: "User Not Found." }),
            404
        );
    }
    const isPasswordMatch = await Bun.password.verify(password, user.password);
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