import { z } from "zod";

export const userRoleSchema = z.enum(["admin", "user"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  image: z.string().url().nullable().optional(),
  role: userRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type User = z.infer<typeof userSchema>;

export const updateUserRoleSchema = z.object({
  role: userRoleSchema,
});
export type UpdateUserRole = z.infer<typeof updateUserRoleSchema>;

// Example extensible entity — duplicate per resource (products, orders, ...).
export const postSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  authorId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Post = z.infer<typeof postSchema>;

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
});
export type CreatePost = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.partial();
export type UpdatePost = z.infer<typeof updatePostSchema>;

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type Pagination = z.infer<typeof paginationSchema>;
