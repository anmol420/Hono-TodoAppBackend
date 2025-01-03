import app from "./app";

import { connectDB } from "./db/index.db";
import errorMessage from "./helpers/errorMessage.helper";

connectDB()
  .then(() => {
    Bun.serve({
      fetch: app.fetch,
      port: process.env.PORT 
    });
    console.log(`App Started On Port - ${process.env.PORT}`);
  })
  .catch((e: unknown) => {
    console.log(`Error - ${errorMessage(e)}`);
  });