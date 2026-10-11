import { Hono } from "hono";
import type { Env } from "../env.js";
import { requireAuth } from "../middleware.js";

export const meRouter = new Hono<{ Bindings: Env }>();

meRouter.get("/", requireAuth, (c) => {
  return c.json({ user: c.get("user" as never) });
});
