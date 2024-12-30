import { Hono } from "hono";
import { connectDB } from "./db/index.db";

const app = new Hono();

app.notFound((c) => c.html('<h1>404-Not Found</h1>'));

// ROUTES
import healthRouter from "./routes/healthCheck.routes";
app.route('/api/v1', healthRouter);

connectDB()
  .then(() => {
    Bun.serve({
      fetch: app.fetch,
      port: process.env.PORT 
    });
    console.log(`App Started On Port - ${process.env.PORT}`);
  })
  .catch((e: unknown) => {
    const message = e instanceof Error ? e.message : "Database Connection Error.";
    console.log(`Error - ${message}`);
  });