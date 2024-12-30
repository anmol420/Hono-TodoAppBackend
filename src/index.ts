import { Hono } from "hono";
import { cors } from "hono/cors";

import { connectDB } from "./db/index.db";
import NotFoundTemplate from "./helpers/notFound.helper";

const app = new Hono();

app.use(cors({
  origin: `${Bun.env.CORS_ORIGIN}`,
  credentials: true,
}));

app.notFound((c) => c.html(NotFoundTemplate));

// ROUTES
import healthRouter from "./routes/healthCheck.routes";
app.route('/api/v1', healthRouter);

connectDB()
  .then(() => {
    Bun.serve({
      fetch: app.fetch,
      port: Bun.env.PORT 
    });
    console.log(`App Started On Port - ${Bun.env.PORT}`);
  })
  .catch((e: unknown) => {
    const message = e instanceof Error ? e.message : "Database Connection Error.";
    console.log(`Error - ${message}`);
  });