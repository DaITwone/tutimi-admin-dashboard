import express from "express";
import { dashboardAiRouter } from "./routes/dashboardAi.route";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware";
import { requestIdMiddleware } from "./middlewares/requestId.middleware";

export function createApp() {
  const app = express();

  app.use((req, res, next) => {
    const allowedOrigin = process.env.CORS_ORIGIN ?? "http://localhost:3000";
    res.header("Access-Control-Allow-Origin", allowedOrigin);
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  });
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
