import { getToken } from "./auth.js";

const API_URL = "/api";

function getSessionId(): string {
  let id = localStorage.getItem("session_id");
  if (!id) {
    id = typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("session_id", id);
  }
  return id;
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

export async function fetchScore(): Promise<number> {
  const sessionId = getSessionId();
  const res = await fetch(`${API_URL}/score/${sessionId}`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch score");
  const data = (await res.json()) as { score: number };
  return data.score;
}

export async function postClick(): Promise<number> {
  const sessionId = getSessionId();
  const res = await fetch(`${API_URL}/click`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ session_id: sessionId }),
  });
  if (!res.ok) throw new Error("Failed to post click");
  const data = (await res.json()) as { score: number };
  return data.score;
}
