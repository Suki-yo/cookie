import Fastify from "fastify";
import { clickRoutes } from "./routes/clicks.js";
import { getScore, incrementScore } from "./db.js";

export default function buildApp() {
  const app = Fastify({ logger: false });
  app.get("/healthz", async () => ({ ok: true }));
  app.register(clickRoutes, { getScore, incrementScore });
  return app;
}
