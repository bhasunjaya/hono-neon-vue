import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { createDb } from "@repo/db";
import type { Env } from "./env.js";
import { parseOrigins } from "./env.js";

// Per-isolate factory: Workers have no long-lived TCP, so build the
// neon-http Drizzle instance + Better Auth instance per request scope.
// Cache per isolate for warm-start reuse.
// `any` avoids better-auth's overloaded generic leaking across tsconfigs
// (backend Workers lib vs frontend DOM lib both import this file for AppType).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached: { key: string; auth: any } | null = null;

export function getAuth(env: Env) {
  const key = `${env.DATABASE_URL}|${env.BETTER_AUTH_URL}|${env.GOOGLE_CLIENT_ID}`;
  if (cached && cached.key === key) return cached.auth;

  const db = createDb(env.DATABASE_URL);

  const auth = betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: parseOrigins(env),
    database: drizzleAdapter(db, { provider: "pg" }),
    emailAndPassword: { enabled: false }, // Google-only for v1
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    plugins: [admin()],
    advanced: {
      // Cross-origin SPA (Pages -> Workers) needs Secure cookies.
      // Better Auth sets SameSite=None automatically for trusted cross origins over https.
      useSecureCookies: env.BETTER_AUTH_URL.startsWith("https://"),
    },
  });

  cached = { key, auth };
  return auth;
}

export type Auth = ReturnType<typeof getAuth>;
