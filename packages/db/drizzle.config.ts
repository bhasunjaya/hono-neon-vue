import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Export your Neon branch URL first, e.g.\n" +
      '  DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require" pnpm --filter @repo/db db:migrate',
  );
}

export default defineConfig({
  schema: "./src/schema/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Neon branch URL from the Neon console. Never commit the real value.
    url: process.env.DATABASE_URL,
  },
});
