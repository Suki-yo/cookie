import Fastify from "fastify";
import { clickRoutes } from "./routes/clicks.js";

const app = Fastify({ logger: true });

app.get("/healthz", async () => ({ ok: true }));
await app.register(clickRoutes);

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

try {
  await app.listen({ port, host });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
