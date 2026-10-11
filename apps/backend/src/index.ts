import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAuth } from "./auth.js";
import { parseOrigins, type Env } from "./env.js";
import { adminRouter } from "./routes/admin.js";
import { meRouter } from "./routes/me.js";
import { postsRouter } from "./routes/posts.js";

const app = new Hono<{ Bindings: Env }>();

app.use("*", async (c, next) => {
  const origins = parseOrigins(c.env);
  const corsMw = cors({
    origin: origins.length > 0 ? origins : [],
    credentials: true,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  });
  return corsMw(c, next);
});

app.get("/api/health", (c) => c.json({ ok: true }));

// Better Auth handler — must come before other /api/* routes.
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  const auth = getAuth(c.env);
  return auth.handler(c.req.raw);
});

app.route("/api/me", meRouter);
app.route("/api/posts", postsRouter);
app.route("/api/admin", adminRouter);

app.notFound((c) => c.json({ error: "Not found" }, 404));

export default app;
// hono/client type-safe contract — frontend imports this type only.
export type AppType = typeof app;
