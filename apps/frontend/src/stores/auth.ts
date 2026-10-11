import { defineStore } from "pinia";
import { ref } from "vue";
import { authClient } from "../lib/auth-client.js";

export const useAuthStore = defineStore("auth", () => {
  const session = authClient.useSession();
  const initialized = ref(false);

  async function signInWithGoogle() {
    await authClient.signIn.social({
      provider: "google",
      // Absolute frontend URL — a relative path would resolve against
      // the backend (Better Auth) origin and strand the user on :8787.
      callbackURL: `${window.location.origin}/app`,
    });
  }

  async function signOut() {
    await authClient.signOut();
    window.location.href = "/login";
  }

  function isAdmin() {
    const role = (session.value?.data?.user as { role?: string } | undefined)?.role;
    return role === "admin";
  }

  return { session, initialized, signInWithGoogle, signOut, isAdmin };
});
