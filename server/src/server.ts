import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), "../.env.local") });

async function bootstrap() {
  const { createApp } = await import("./app"); // import sau khi load env
  const PORT = Number(process.env.PORT ?? 4000);
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Express server listening on http://localhost:${PORT}`);
  });
}

bootstrap();
