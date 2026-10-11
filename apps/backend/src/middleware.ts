import { createMiddleware } from "hono/factory";
import { getAuth } from "./auth.js";
import type { Env } from "./env.js";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role?: string | null;
};

export const requireAuth = createMiddleware<{ Bindings: Env; Variables: { user: SessionUser } }>(
  async (c, next) => {
    const auth = getAuth(c.env);
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);
    c.set("user", session.user as SessionUser);
    await next();
  },
);

export const requireAdmin = createMiddleware<{ Bindings: Env; Variables: { user: SessionUser } }>(
  async (c, next) => {
    const auth = getAuth(c.env);
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    const role = (session?.user as SessionUser | undefined)?.role;
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);
    if (role !== "admin") return c.json({ error: "Forbidden" }, 403);
    c.set("user", session.user as SessionUser);
    await next();
  },
);
