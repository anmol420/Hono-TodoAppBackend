import * as mongoose from "mongoose";

import errorMessage from "../helpers/errorMessage.helper";

const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.DATABASE_URL as string);
        console.log("MongoDB Connected: ", db.connection.host);
    } catch (error) {
        console.log(`Error In Connecting To MongoDB - ${errorMessage(error)}`);
        process.exit(1);
    }
};

export {
    connectDB,
};