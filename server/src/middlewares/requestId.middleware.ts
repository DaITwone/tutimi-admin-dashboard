import { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

export type RequestWithId = Request & { requestId?: string };

export function requestIdMiddleware(
  req: RequestWithId,
  res: Response,
  next: NextFunction
) {
  const requestId = randomUUID();
  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);
  next();
}

/*
    Request gốc:
    {
     headers,
     body,
     params
    }

    RequestWithId:
    {
     headers,
     body,
     params,
     requestId
    }
*/