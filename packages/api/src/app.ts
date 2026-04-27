import Fastify from "fastify";
import { clickRoutes } from "./routes/clicks.js";
import { getScore, incrementScore } from "./db.js";
import { verifyToken } from "./auth.js";

export default function buildApp() {
  const app = Fastify({ logger: false });

  app.get("/healthz", async () => ({ ok: true }));

  app.register(async (protected_) => {
    protected_.addHook("preHandler", verifyToken);
    protected_.register(clickRoutes, { getScore, incrementScore });
  });

  return app;
}
