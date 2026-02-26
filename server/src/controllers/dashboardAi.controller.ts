import { Request, Response, NextFunction } from "express";
import {
  AppError,
  DashboardAiRequest,
  DashboardAiSuccessResponse,
} from "../types/api";
import { askDashboardAI } from "../services/dashboardAi.service";

export async function postDashboardAI(
  req: Request<unknown, DashboardAiSuccessResponse, DashboardAiRequest>,
  res: Response<DashboardAiSuccessResponse>,
  next: NextFunction
) {
  try {
    if (!req.body || typeof req.body !== "object") {
      throw new AppError(400, "INVALID_BODY", "Request body must be a JSON object");
    }
    if (typeof req.body.prompt !== "string") {
      throw new AppError(400, "INVALID_BODY", "prompt must be a string");
    }

    const result = await askDashboardAI(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
