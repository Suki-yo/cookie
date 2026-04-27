export const config = {
  db: {
    host: process.env.PGHOST ?? "localhost",
    port: Number(process.env.PGPORT ?? 5432),
    database: process.env.PGDATABASE ?? "cookie",
    username: process.env.PGUSER ?? "cookie",
    password: process.env.PGPASSWORD ?? "cookie",
  },
  keycloak: {
    jwksUri:
      process.env.KEYCLOAK_JWKS_URI ??
      "http://keycloak/realms/cookie/protocol/openid-connect/certs",
  },
};
