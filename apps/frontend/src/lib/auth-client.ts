import { createAuthClient } from "better-auth/vue";

const baseURL = import.meta.env.VITE_API_URL ?? "";

export const authClient = createAuthClient({ baseURL });

export const { useSession } = authClient;
