import {Context} from "hono";
import {deleteCookie, setSignedCookie} from "hono/cookie";

import User from "../models/user.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import errorMessage from "../helpers/errorMessage.helper";
import {generateToken} from "../helpers/jwtToken.helper";
import userProducer from "../utils/mq/producer/user.producer";
import generateOTP from "../helpers/otpGenerator.helper";

class UserController {
    async registerUser(c: Context) {
        const {username, email, password} = c.get("validatedBody");
        if (!username || !email || !password) {
            return c.json(
                new ApiError(404, {message: "Username, Email and Password Not Found."}),
                404
            );
        }
        const usernameExists = await User.findOne({
            username,
        });
        if (usernameExists) {
            return c.json(
                new ApiError(404, {message: "Username already exists"}),
            );
        }
        const emailExists = await User.findOne({
            email,
        });
        if (emailExists) {
            return c.json(
                new ApiError(404, {message: "Email already exists"}),
            );
        }
        try {
            const hashedPassword = await Bun.password.hash(password, {
                algorithm: "bcrypt",
                cost: 10,
            });
            const otp = generateOTP();
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                verificationOTP: otp,
            })
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
        const user = await User.findOne({
            email,
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
            await User.findOneAndUpdate(
                {
                    email,
                },
                {
                    $set: {
                        isVerified: true,
                    }
                },
            );
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
        const user = await User.findOne({
            email,
        })
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
            const token = await generateToken({userid: user._id});
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

    async forgotPassword(c: Context) {
        const {email} = c.get("validatedBody");
        if (!email) {
            return c.json(
                new ApiError(404, {message: "Email Not Found."}),
                404
            );
        }
        const user = await User.findOne({
            email,
        });
        if (!user) {
            return c.json(
                new ApiError(404, {message: "User Not Found."}),
                404
            );
        }
        try {
            const otp = generateOTP();
            await User.findOneAndUpdate(
                {
                    email,
                },
                {
                    $set: {
                        verificationOTP: otp,
                    }
                }
            );
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
        const user = await User.findOne({
            email,
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
        const user = await User.findOne({
            email,
        });
        if (!user) {
            return c.json(
                new ApiError(404, {message: "User Not Found."}),
                404
            );
        }
        const comparedPassword = await Bun.password.verify(password, user.password);
        if (comparedPassword) {
            return c.json(
                new ApiError(400, {message: "Old and New Password Are Same."}),
                400
            );
        }
        try {
            const hashedPassword = await Bun.password.hash(password, {
                algorithm: "bcrypt",
                cost: 10,
            });
            await User.findOneAndUpdate(
                {
                    email,
                },
                {
                    $set: {
                        password: hashedPassword,
                    }
                }
            )
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
        const {oldPassword, newPassword} = c.get("validatedBody");
        if (!newPassword || !oldPassword) {
            return c.json(
                new ApiError(404, {message: "Email And Old and New Password Not Found."}),
                404
            );
        }
        if (oldPassword === newPassword) {
            return c.json(
                new ApiError(400, {message: "Old And New Password Can't Be Same."}),
                400
            );
        }
        const fetchUser = c.get("user");
        const email = fetchUser.email;
        const user = await User.findOne({
            email,
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
            await User.findOneAndUpdate(
                {
                    email,
                },
                {
                    $set: {
                        password: hashedPassword,
                    }
                }
            )
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