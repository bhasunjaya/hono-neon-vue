import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { updateUserRoleSchema } from "@repo/shared";
import { createDb, user } from "@repo/db";
import type { Env } from "../env.js";
import { requireAdmin } from "../middleware.js";

export const adminRouter = new Hono<{ Bindings: Env }>();

adminRouter.get("/users", requireAdmin, async (c) => {
  const db = createDb(c.env.DATABASE_URL);
  const rows = await db.select().from(user).limit(100);
  return c.json({ data: rows });
});

adminRouter.patch("/users/:id/role", requireAdmin, zValidator("json", updateUserRoleSchema), async (c) => {
  const id = c.req.param("id");
  const { role } = c.req.valid("json");
  const db = createDb(c.env.DATABASE_URL);
  const [updated] = await db.update(user).set({ role }).where(eq(user.id, id)).returning();
  if (!updated) return c.json({ error: "Not found" }, 404);
  return c.json(updated);
});
