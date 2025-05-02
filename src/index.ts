import app from "./app";
import aj from "./libs/arcjet.lib";

import {connectDB} from "./db/index.db";
import errorMessage from "./helpers/errorMessage.helper";
import startConsumer from "./utils/mq/consumers";

connectDB()
    .then(() => {
        startConsumer()
            .then(() => {
                console.log("Starting consumer...");
            }).catch((err: Error) => {
            console.log(`Error starting consumer: ${errorMessage(err)}`);
        });
        Bun.serve({
            fetch: aj.handler(app.fetch),
            port: process.env.PORT
        });
        console.log(`App Started On Port - ${process.env.PORT}`);
    })
    .catch((e: Error) => {
        console.log(`Error - ${errorMessage(e)}`);
    });