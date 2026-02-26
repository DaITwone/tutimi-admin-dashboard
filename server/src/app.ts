import cors from "cors";
import express from "express";
import { dashboardAiRouter } from "./routes/dashboardAi.route";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware";
import { requestIdMiddleware } from "./middlewares/requestId.middleware";

export function createApp() {
  const app = express();

  app.use(cors({ origin: "http://localhost:3000" }));
  app.use(express.json({ limit: "1mb" }));
  app.use(requestIdMiddleware);
  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use("/api", dashboardAiRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

  return app;
}

// Origin = protocol + domain + port

/*
  localhost:3000
      ↓ fetch
  localhost:4000/api
      ↓
  Express server check cors
      ↓ allowed
      ↓
  response trả về frontend
*/