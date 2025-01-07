import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import NotFoundTemplate from "./helpers/notFound.helper";

const app = new Hono();

app.use(logger());

app.use(cors({
    origin: `${process.env.CORS_ORIGIN}`,
    credentials: true,
}));

app.notFound((c) => c.html(NotFoundTemplate));

// ROUTES
app.get("/", (c) => c.text('Welcome To TodoAPI'))

import healthRouter from "./routes/healthCheck.routes";
app.route('/api/v1', healthRouter);

import userRoutes from "./routes/user.routes";
app.route('/api/v1/users', userRoutes);

import todoRoutes from "./routes/todo.routes";
app.route('/api/v1/todos', todoRoutes);

export default app;