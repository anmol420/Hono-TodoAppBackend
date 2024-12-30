import { Hono } from "hono";

import { healthCheck } from "../controllers/healthCheck.controller";

const healthRouter = new Hono();

healthRouter.get('/healthCheck', healthCheck);

export default healthRouter;