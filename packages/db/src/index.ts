import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema/index";

// Workers-safe: neon-http uses fetch, no TCP sockets.
// Call per-request (or cache per isolate); never migrate at runtime.
export function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

export type Database = ReturnType<typeof createDb>;
export * from "./schema/index";
