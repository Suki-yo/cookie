import postgres from "postgres";
import { config } from "./config.js";

const sql = postgres(config.db);

export async function getScore(sessionId: string): Promise<number> {
  const rows = await sql<{ count: bigint }[]>`
    SELECT count FROM scores WHERE session_id = ${sessionId}
  `;
  return rows.length ? Number(rows[0].count) : 0;
}

export async function incrementScore(sessionId: string): Promise<number> {
  const rows = await sql<{ count: bigint }[]>`
    INSERT INTO scores (session_id, count, updated_at)
    VALUES (${sessionId}, 1, now())
    ON CONFLICT (session_id)
    DO UPDATE SET
      count = scores.count + 1,
      updated_at = now()
    RETURNING count
  `;
  return Number(rows[0].count);
}

export default sql;
