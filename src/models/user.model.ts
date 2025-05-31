import { Schema, model } from "mongoose";
import { User } from "../utils/interfaceModel/interface";

const userSchema = new Schema<User>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationOTP: {
        type: String,
    },
}, {
    timestamps: true,
});

const User = model<User>("User", userSchema);
export default User;