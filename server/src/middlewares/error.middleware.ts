import { NextFunction, Request, Response } from "express";
import { ApiErrorResponse, AppError } from "../types/api";
import { RequestWithId } from "./requestId.middleware";

export function notFoundMiddleware(req: Request, res: Response<ApiErrorResponse>) {
  res.status(404).json({
    errorCode: "NOT_FOUND",
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorMiddleware(
  err: unknown,
  req: RequestWithId,
  res: Response<ApiErrorResponse>,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errorCode: err.errorCode,
      message: err.message,
      requestId: req.requestId,
    });
  }

  console.error("Unhandled error:", err);

  return res.status(500).json({
    errorCode: "INTERNAL_ERROR",
    message: "Internal server error",
    requestId: req.requestId,
  });
}

// instanceof là một operator trong JavaScript dùng để kiểm tra một object có được tạo từ class cụ thể hay không.