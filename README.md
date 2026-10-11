# Hono Neon Vue

Monorepo: Hono + Drizzle + Neon (Cloudflare Workers) + Vue 3 Vite SPA.

## Layout

- `apps/backend` — Hono on Workers, Better Auth (Google-only), `neon-http` Drizzle, RBAC (`admin|user`).
- `apps/frontend` — Vue 3 + Vite + TS + Router + Pinia + Tailwind v4, `hono/client` with cookies.
- `packages/db` — Drizzle schema + `createDb(url)` (Workers-safe), `drizzle-kit` migrations.
- `packages/shared` — Zod schemas + types (single source of truth).

## Quickstart

1. `pnpm install`
2. `cp apps/backend/.dev.vars.example apps/backend/.dev.vars` and fill Neon URL + Google OAuth + secrets.
3. `cp apps/frontend/.env.example apps/frontend/.env`
4. DB: `pnpm --filter @repo/db db:generate && pnpm --filter @repo/db db:migrate`
5. Dev: `pnpm dev` (turbo runs `wrangler dev` :8787 + `vite` :5173).
6. First login with Google, then `DATABASE_URL=... pnpm --filter backend seed:admin -- you@example.com`.

## Deploy

- Backend: `pnpm --filter backend deploy` after `wrangler secret put DATABASE_URL BETTER_AUTH_SECRET GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET` and setting `BETTER_AUTH_URL` + `CORS_ORIGINS` in `wrangler.toml`.
- Frontend: Cloudflare Pages, `VITE_API_URL=https://<workers-domain>`.
