Your next steps:
1. cp apps/backend/.dev.vars.example apps/backend/.dev.vars + cp apps/frontend/.env.example apps/frontend/.env, fill in Neon URL and Google OAuth client ID/secret (Google Cloud Console → authorized origin http://localhost:8787, redirect /api/auth/callback/google).
2. pnpm --filter @repo/db db:migrate, then pnpm dev.
3. Log in with Google once, then promote yourself: DATABASE_URL=... pnpm --filter backend seed:admin -- you@example.com.
4. Deploy: wrangler secret put ... + set BETTER_AUTH_URL/CORS_ORIGINS in wrangler.toml, point Pages VITE_API_URL at the Workers URL.
Two known follow-ups when you're ready: tight hono/client deep inference (wildcard auth route currently forces an any client — runtime is fully working) and shadcn-vue component setup.
