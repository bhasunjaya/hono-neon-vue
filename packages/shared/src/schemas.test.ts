import { describe, expect, it } from "vitest";
import { createPostSchema, userRoleSchema } from "./schemas.js";

describe("shared schemas", () => {
  it("accepts admin/user roles", () => {
    expect(userRoleSchema.parse("admin")).toBe("admin");
    expect(() => userRoleSchema.parse("superadmin")).toThrow();
  });

  it("rejects empty post", () => {
    expect(() => createPostSchema.parse({ title: "", content: "" })).toThrow();
  });
});
