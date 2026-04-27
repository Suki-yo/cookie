import { describe, it } from "node:test";
import assert from "node:assert/strict";
import Fastify from "fastify";
import { clickRoutes } from "../routes/clicks.js";
import { verifyToken } from "../auth.js";

function buildApp(
  getScore = async (_id: string) => 0,
  incrementScore = async (_id: string) => 0
) {
  const app = Fastify({ logger: false });
  app.get("/healthz", async () => ({ ok: true }));
  app.register(clickRoutes, { getScore, incrementScore });
  return app;
}

function buildAppWithAuth(
  getScore = async (_id: string) => 0,
  incrementScore = async (_id: string) => 0
) {
  const app = Fastify({ logger: false });
  app.get("/healthz", async () => ({ ok: true }));
  app.register(async (protected_) => {
    protected_.addHook("preHandler", verifyToken);
    protected_.register(clickRoutes, { getScore, incrementScore });
  });
  return app;
}

describe("GET /healthz", () => {
  it("returns ok: true", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/healthz" });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.json(), { ok: true });
  });
});

describe("POST /click", () => {
  it("returns incremented score", async () => {
    let calledWith: string | undefined;
    const app = buildApp(
      async () => 0,
      async (id) => { calledWith = id; return 5; }
    );
    const res = await app.inject({
      method: "POST",
      url: "/click",
      payload: { session_id: "abc" },
    });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.json(), { score: 5 });
    assert.equal(calledWith, "abc");
  });

  it("returns 400 when session_id is missing", async () => {
    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/click",
      payload: {},
    });
    assert.equal(res.statusCode, 400);
  });
});

describe("GET /score/:session_id", () => {
  it("returns score for session", async () => {
    let calledWith: string | undefined;
    const app = buildApp(
      async (id) => { calledWith = id; return 42; }
    );
    const res = await app.inject({ method: "GET", url: "/score/abc" });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.json(), { score: 42 });
    assert.equal(calledWith, "abc");
  });

  it("returns 0 for unknown session", async () => {
    const app = buildApp(async () => 0);
    const res = await app.inject({ method: "GET", url: "/score/unknown" });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.json(), { score: 0 });
  });
});

describe("auth", () => {
  it("returns 401 when no token is provided", async () => {
    const app = buildAppWithAuth();
    const res = await app.inject({ method: "POST", url: "/click", payload: { session_id: "abc" } });
    assert.equal(res.statusCode, 401);
  });

  it("returns 401 when token is invalid", async () => {
    const app = buildAppWithAuth();
    const res = await app.inject({
      method: "POST",
      url: "/click",
      payload: { session_id: "abc" },
      headers: { authorization: "Bearer not-a-real-token" },
    });
    assert.equal(res.statusCode, 401);
  });

  it("does not require auth for /healthz", async () => {
    const app = buildAppWithAuth();
    const res = await app.inject({ method: "GET", url: "/healthz" });
    assert.equal(res.statusCode, 200);
  });
});
