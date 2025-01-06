import { Hono } from "hono";

import HealthCheckController from "../controllers/healthCheck.controller";

const healthRouter = new Hono();
const healthCheckController = new HealthCheckController();

healthRouter.get('/healthCheck', healthCheckController.healthCheck);

export default healthRouter;