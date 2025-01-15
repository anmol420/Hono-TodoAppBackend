import app from "./app";
import aj from "./libs/arcjet";

import { connectDB } from "./db/index.db";
import errorMessage from "./helpers/errorMessage.helper";

connectDB()
  .then(() => {
    Bun.serve({
      fetch: aj.handler(app.fetch),
      port: process.env.PORT 
    });
    console.log(`App Started On Port - ${process.env.PORT}`);
  })
  .catch((e: unknown) => {
    console.log(`Error - ${errorMessage(e)}`);
  });