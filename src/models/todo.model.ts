import { Schema, model } from "mongoose";

import { Todo } from "../utils/interfaceModel/interface";

const todoSchema = new Schema<Todo>({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

const Todo = model<Todo>("Todo", todoSchema);
export default Todo;