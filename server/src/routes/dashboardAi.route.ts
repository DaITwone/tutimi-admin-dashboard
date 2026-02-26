import { Router } from "express";
import { postDashboardAI } from "../controllers/dashboardAi.controller";

export const dashboardAiRouter = Router();

dashboardAiRouter.post("/dashboard-ai", postDashboardAI);
