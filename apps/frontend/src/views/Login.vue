<script setup lang="ts">
import { useAuthStore } from "../stores/auth.js";
const auth = useAuthStore();
</script>

<template>
  <div class="min-h-screen grid place-items-center bg-gray-50 p-6">
    <div class="w-full max-w-sm bg-white rounded-xl shadow p-6 space-y-4">
      <h1 class="text-xl font-semibold">Sign in</h1>
      <p class="text-sm text-gray-600">Google-only login for v1 (Better Auth).</p>
      <button
        class="w-full rounded-lg bg-black text-white py-2 px-4 hover:opacity-90"
        @click="auth.signInWithGoogle"
      >
        Continue with Google
      </button>
    </div>
  </div>
</template>
