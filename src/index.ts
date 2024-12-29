import { Hono } from "hono";
import { connectDB } from "./db/index.db";

const app = new Hono();

connectDB();

app.notFound((c) => c.html('<h1>404-Not Found</h1>'))

// ROUTES
import healthRouter from "./routes/healthCheck.routes";
app.route('/api/v1', healthRouter);

export default {
  port: 8080,
  fetch: app.fetch,
};