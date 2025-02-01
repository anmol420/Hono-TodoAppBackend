import { sign, decode } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

const generateToken = async (payload: JWTPayload) => {
    try {
        return await sign(
            payload,
            process.env.JWT_SECRET_KEY as string,
        );
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};

const decodeToken = async (token: string) => {
    try {
        return decode(token);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};

export {
    generateToken,
    decodeToken
};