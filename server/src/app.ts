import cors from "cors";
import express from "express";
import { dashboardAiRouter } from "./routes/dashboardAi.route";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware";
import { requestIdMiddleware } from "./middlewares/requestId.middleware";

export function createApp() {
  const app = express();

  const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean); // loại bỏ các giá trị rỗng/falsy

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
      },
    })
  );

  app.use(express.json({ limit: "1mb" }));

  app.use(requestIdMiddleware);

  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      console.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`
      );
    });
    next();
  });

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use("/api", dashboardAiRouter);

  app.use(notFoundMiddleware);

  app.use(errorMiddleware);

  return app;
}

// Origin = protocol + domain + port

/*
  Client (Frontend)
      ↓ HTTP request
  Express App
      ↓
  CORS middleware
      ↓
  express.json()
      ↓
  requestIdMiddleware
      ↓
  Logger middleware (tính thời gian)
      ↓
  Route matching
      ├── /health
      └── /api → dashboardAiRouter
      ↓
  Nếu không match → notFoundMiddleware
      ↓
  Nếu có error → errorMiddleware
      ↓
  Response trả về client
*/

