import { Hono } from "hono";

import HealthCheckController from "../controllers/healthCheck.controller";

import arcjetMiddleware from "../middlewares/arcjet.middleware";

const healthRouter = new Hono();
const healthCheckController = new HealthCheckController();

healthRouter.use(arcjetMiddleware);

healthRouter.get('/healthCheck', healthCheckController.healthCheck);

export default healthRouter;