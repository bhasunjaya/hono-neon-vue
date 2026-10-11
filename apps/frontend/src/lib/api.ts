import { hc } from "hono/client";
import type { AppType } from "../../../backend/src/index.js";

const baseUrl = import.meta.env.VITE_API_URL ?? "";

// Single hono/client instance — always send cookies (Better Auth session).
// TODO: tighten to `hc<AppType>` deep inference once `/api/auth/*` wildcard
// is excluded from AppType (wildcards collapse client inference to unknown).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const api: any = hc<AppType>(baseUrl, {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, { ...init, credentials: "include" }),
});
