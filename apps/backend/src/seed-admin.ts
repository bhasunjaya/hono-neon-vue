// Promote an existing Google-login user to admin by email.
// Usage: DATABASE_URL=... pnpm --filter backend seed:admin -- user@example.com
// Runs locally with Node (tsx), never on Workers.
import { eq } from "drizzle-orm";
import { createDb, user } from "@repo/db";

const email = process.argv[2] ?? process.env.ADMIN_EMAIL;
const databaseUrl = process.env.DATABASE_URL;

if (!email) {
  console.error("Pass an email: pnpm --filter backend seed:admin -- user@example.com");
  process.exit(1);
}
if (!databaseUrl) {
  console.error("Set DATABASE_URL to your Neon branch URL.");
  process.exit(1);
}

const db = createDb(databaseUrl);
const [updated] = await db.update(user).set({ role: "admin" }).where(eq(user.email, email)).returning();

if (!updated) {
  console.error(`No user found with email ${email}. Log in with Google first, then re-run.`);
  process.exit(1);
}
console.log(`Promoted ${updated.email} to admin.`);
