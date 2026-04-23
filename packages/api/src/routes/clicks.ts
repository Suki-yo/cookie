import type { FastifyPluginAsync } from "fastify";
import { getScore as defaultGetScore, incrementScore as defaultIncrementScore } from "../db.js";

type Deps = {
  getScore?: (sessionId: string) => Promise<number>;
  incrementScore?: (sessionId: string) => Promise<number>;
};

export const clickRoutes: FastifyPluginAsync<Deps> = async (app, opts) => {
  const getScore = opts.getScore ?? defaultGetScore;
  const incrementScore = opts.incrementScore ?? defaultIncrementScore;

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
      const score = await incrementScore(req.body.session_id);
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
      const score = await getScore(req.params.session_id);
      return reply.send({ score });
    }
  );
};
