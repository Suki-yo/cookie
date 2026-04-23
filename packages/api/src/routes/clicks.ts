import type { FastifyInstance } from "fastify";
import { getScore, incrementScore } from "../db.js";

type Deps = {
  getScore: (sessionId: string) => Promise<number>;
  incrementScore: (sessionId: string) => Promise<number>;
};

export async function clickRoutes(
  app: FastifyInstance,
  deps: Deps = { getScore, incrementScore }
) {
  app.post<{
    Body: { session_id: string };
    Reply: { score: number };
  }>(
    "/click",
    {
      schema: {
        body: {
          type: "object",
          required: ["session_id"],
          properties: {
            session_id: { type: "string", minLength: 1 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: { score: { type: "number" } },
          },
        },
      },
    },
    async (req, reply) => {
      const score = await deps.incrementScore(req.body.session_id);
      return reply.send({ score });
    }
  );

  app.get<{
    Params: { session_id: string };
    Reply: { score: number };
  }>(
    "/score/:session_id",
    {
      schema: {
        params: {
          type: "object",
          required: ["session_id"],
          properties: {
            session_id: { type: "string", minLength: 1 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: { score: { type: "number" } },
          },
        },
      },
    },
    async (req, reply) => {
      const score = await deps.getScore(req.params.session_id);
      return reply.send({ score });
    }
  );
}
