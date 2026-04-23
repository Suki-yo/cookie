import postgres from "postgres";

const sql = postgres({
  host: process.env.PGHOST ?? "localhost",
  port: Number(process.env.PGPORT ?? 5432),
  database: process.env.PGDATABASE ?? "cookie",
  username: process.env.PGUSER ?? "cookie",
  password: process.env.PGPASSWORD ?? "cookie",
});

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
