import {Context} from "hono";
import {deleteCookie, setSignedCookie} from "hono/cookie";

import getPrismaClient from "../libs/prisma.lib";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import errorMessage from "../helpers/errorMessage.helper";
import {generateToken} from "../helpers/jwtToken.helper";
import userProducer from "../utils/mq/producer/user.producer";
import generateOTP from "../helpers/otpGenerator.helper";

const prisma = getPrismaClient();

class UserController {
    async registerUser(c: Context) {
        const {username, email, password} = c.get("validatedBody");
        if (!username || !email || !password) {
            return c.json(
                new ApiError(404, {message: "Username, Email and Password Not Found."}),
                404
            );
        }
        const existedUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {email}
                ]
            }
        });
        if (existedUser) {
            return c.json(
                new ApiError(400, {message: "User Already Exists."})
            )
        }
        try {
            const hashedPassword = await Bun.password.hash(password, {
                algorithm: "bcrypt",
                cost: 10,
            });
            const otp = generateOTP();
            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    verificationOTP: otp,
                }
            });
            await userProducer<{ email: string, otp: string }>("user.register.registrationOTP", {
                email: email,
                otp: otp
            });
            return c.json(
                new ApiResponse(200, user, "Registration OTP Send Successfully."),
                200
            );
        } catch (error: unknown) {
            return c.json(
                new ApiError(500, errorMessage(error)),
                500
            );
        }
    }

    async verifyRegisteredUser(c: Context) {
        const {email, otp} = c.get("validatedBody");
        if (!email || !otp) {
            return c.json(
                new ApiError(404, {message: "Email and OTP Not Found."}),
                404
            );
        }
        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            return c.json(
                new ApiError(404, {message: "User Not Found."}),
                404
            );
        }
        if (user.verificationOTP != otp) {
            return c.json(
                new ApiError(400, {message: "User Verification OTP Invalid."}),
                400
            );
        }
        try {
            await prisma.user.update({
                where: {
                    email,
                },
                data: {
                    isVerified: true,
                }
            });
            await userProducer<{ email: string }>("user.register.welcomeMessage", {email: email});
            return c.json(
                new ApiResponse(200, null, "User Registered Successfully."),
                200
            );
        } catch (error: unknown) {
            return c.json(
                new ApiError(500, errorMessage(error)),
                500
            );
        }
    };

    async loginUser(c: Context) {
        const {email, password} = c.get("validatedBody");
        if (!email || !password) {
            return c.json(
                new ApiError(404, {message: "Email and Password Not Found."}),
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
                new ApiError(404, {message: "User Not Found."}),
                404
            );
        }
        if (user.isVerified === false) {
            return c.json(
                new ApiError(400, {message: "User Not Verified."}),
                400
            )
        }
        const isPasswordMatch = await Bun.password.verify(password, user.password);
        if (!isPasswordMatch) {
            return c.json(
                new ApiError(400, {message: "Invalid Password."}),
                400
            );
        }
        try {
            const token = await generateToken({userid: user.id});
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
    }

    async logoutUser(c: Context) {
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
    }

    async userProfile(c: Context) {
        const user = c.get("user");
        try {
            return c.json(
                new ApiResponse(200, user, "User Profile Retrieved Successfully."),
                200
            );
        } catch (error: unknown) {
            return c.json(
                new ApiError(500, errorMessage(error)),
                500
            );

        }
    }

    async userDashboard(c: Context) {
        const user = c.get("user");
        try {
            const userData = await prisma.user.findUnique({
                where: {
                    id: user.id,
                },
                include: {
                    Todo: true,
                }
            });
            const result = {
                username: userData?.username,
                email: userData?.email,
                todos: userData?.Todo.map((todo) => {
                    return {
                        title: todo.title,
                        description: todo.description,
                        isCompleted: todo.isCompleted,
                    };
                }),
            };
            return c.json(
                new ApiResponse(200, result, "User Dashboard Retrieved Successfully."),
                200
            );
        } catch (error: unknown) {
            return c.json(
                new ApiError(500, errorMessage(error)),
                500
            );
        }
    }

    async forgotPassword(c: Context) {
        const {email} = c.get("validatedBody");
        if (!email) {
            return c.json(
                new ApiError(404, {message: "Email Not Found."}),
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
                new ApiError(404, {message: "User Not Found."}),
                404
            );
        }
        try {
            const otp = generateOTP();
            await prisma.user.update({
                where: {
                    email,
                },
                data: {
                    verificationOTP: otp,
                }
            });
            await userProducer<{email: string, otp: string}>("user.password.forgotPasswordOTP", {email: email, otp: otp});
            return c.json(
                new ApiResponse(200, null, "OTP Send Successfully."),
                200
            );
        } catch (error: unknown) {
            return c.json(
                new ApiError(500, errorMessage(error)),
                500
            )
        }
    }

    async verifyForgotPasswordOTP(c: Context) {
        const {email, otp} = c.get("validatedBody");
        if (!email || !otp) {
            return c.json(
                new ApiError(404, {message: "Email and OTP Not Found."}),
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
                new ApiError(404, {message: "User Not Found."}),
                404
            );
        }
        if (user.verificationOTP != otp) {
            return c.json(
                new ApiError(400, {message: "Password Change OTP Invalid."}),
                400
            );
        }
        try {
            return c.json(
                new ApiResponse(200, null, "OTP Verified Successfully."),
                200
            );
        } catch (error: unknown) {
            return c.json(
                new ApiError(500, errorMessage(error)),
                500
            );
        }
    }

    async changeForgotPassword(c: Context) {
        const {email,password} = c.get("validatedBody");
        if (!email || !password) {
            return c.json(
                new ApiError(404, {message: "Email And Password Not Found."}),
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
                new ApiError(404, {message: "User Not Found."}),
                404
            );
        }
        try {
            const hashedPassword = await Bun.password.hash(password, {
                algorithm: "bcrypt",
                cost: 10,
            });
            await prisma.user.update({
                where: {
                    email,
                },
                data: {
                    password: hashedPassword,
                }
            });
            await userProducer<{email: string}>("user.password.changePassword", {email: email});
            return c.json(
                new ApiResponse(200, null, "Password Changed Successfully."),
                200
            );
        } catch (error: unknown) {
            return c.json(
                new ApiError(500, errorMessage(error)),
                500
            );
        }
    }

    async changePassword(c: Context) {
        const {email, oldPassword, newPassword} = c.get("validatedBody");
        if (!email || !newPassword || !oldPassword) {
            return c.json(
                new ApiError(404, {message: "Email And Old and New Password Not Found."}),
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
                new ApiError(404, {message: "User Not Found."}),
                404
            );
        }
        const comparedPassword = await Bun.password.verify(oldPassword, user.password);
        if (!comparedPassword) {
            return c.json(
                new ApiError(400, {message: "Invalid Password."}),
                400
            );
        }
        try {
            const hashedPassword = await Bun.password.hash(newPassword, {
                algorithm: "bcrypt",
                cost: 10,
            });
            await prisma.user.update({
                where: {
                    email
                },
                data: {
                    password: hashedPassword,
                }
            });
            await userProducer<{email: string}>("user.password.changePassword", {email: email});
            return c.json(
                new ApiResponse(200, null, "Password Changed Successfully."),
                200
            );
        } catch (error: unknown) {
            return c.json(
                new ApiError(500, errorMessage(error)),
                500
            );
        }
    }
}

export default UserController;