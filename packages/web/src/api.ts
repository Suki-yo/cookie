const API_URL = "/api";

function getSessionId(): string {
  let id = localStorage.getItem("session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("session_id", id);
  }
  return id;
}

export async function fetchScore(): Promise<number> {
  const sessionId = getSessionId();
  const res = await fetch(`${API_URL}/score/${sessionId}`);
  if (!res.ok) throw new Error("Failed to fetch score");
  const data = (await res.json()) as { score: number };
  return data.score;
}

export async function postClick(): Promise<number> {
  const sessionId = getSessionId();
  const res = await fetch(`${API_URL}/click`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
  if (!res.ok) throw new Error("Failed to post click");
  const data = (await res.json()) as { score: number };
  return data.score;
}
