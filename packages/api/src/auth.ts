import { createRemoteJWKSet, jwtVerify } from "jose";
import type { FastifyRequest } from "fastify";
import { config } from "./config.js";

const JWKS = createRemoteJWKSet(new URL(config.keycloak.jwksUri));

export async function verifyToken(req: FastifyRequest): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw { statusCode: 401, message: "Missing token" };
  }

  const token = authHeader.slice(7);

  try {
    await jwtVerify(token, JWKS, { algorithms: ["RS256"] });
  } catch {
    throw { statusCode: 401, message: "Invalid token" };
  }
}
