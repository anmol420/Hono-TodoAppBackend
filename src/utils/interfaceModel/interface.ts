import {Types} from "mongoose";

interface User {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    verificationOTP: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Todo {
    title: string;
    description: string;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    ownerId: Types.ObjectId;
}

export { User, Todo };