import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { createPostSchema, paginationSchema, updatePostSchema } from "@repo/shared";
import { createDb, posts } from "@repo/db";
import type { Env } from "../env.js";
import { requireAuth } from "../middleware.js";

export const postsRouter = new Hono<{ Bindings: Env }>();

postsRouter.get("/", requireAuth, zValidator("query", paginationSchema), async (c) => {
  const { page, pageSize } = c.req.valid("query");
  const db = createDb(c.env.DATABASE_URL);
  const rows = await db.select().from(posts).limit(pageSize).offset((page - 1) * pageSize);
  return c.json({ data: rows, page, pageSize });
});

postsRouter.post("/", requireAuth, zValidator("json", createPostSchema), async (c) => {
  const user = c.get("user" as never) as { id: string };
  const input = c.req.valid("json");
  const db = createDb(c.env.DATABASE_URL);
  const [row] = await db
    .insert(posts)
    .values({ title: input.title, content: input.content, authorId: user.id })
    .returning();
  return c.json(row, 201);
});

postsRouter.patch("/:id", requireAuth, zValidator("json", updatePostSchema), async (c) => {
  const user = c.get("user" as never) as { id: string; role?: string | null };
  const id = c.req.param("id");
  const input = c.req.valid("json");
  const db = createDb(c.env.DATABASE_URL);
  const existing = await db.select().from(posts).where(eq(posts.id, id));
  const row = existing[0];
  if (!row) return c.json({ error: "Not found" }, 404);
  if (row.authorId !== user.id && user.role !== "admin") return c.json({ error: "Forbidden" }, 403);
  const [updated] = await db.update(posts).set(input).where(eq(posts.id, id)).returning();
  return c.json(updated);
});

postsRouter.delete("/:id", requireAuth, async (c) => {
  const user = c.get("user" as never) as { id: string; role?: string | null };
  const id = c.req.param("id");
  const db = createDb(c.env.DATABASE_URL);
  const existing = await db.select().from(posts).where(eq(posts.id, id));
  const row = existing[0];
  if (!row) return c.json({ error: "Not found" }, 404);
  if (row.authorId !== user.id && user.role !== "admin") return c.json({ error: "Forbidden" }, 403);
  await db.delete(posts).where(eq(posts.id, id));
  return c.json({ ok: true });
});
