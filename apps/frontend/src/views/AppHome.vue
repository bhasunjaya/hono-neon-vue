<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "../stores/auth.js";
import { usePostsStore } from "../stores/posts.js";

const auth = useAuthStore();
const posts = usePostsStore();
const title = ref("");
const content = ref("");

onMounted(() => posts.fetchAll());

async function onCreate() {
  if (!title.value || !content.value) return;
  await posts.create(title.value, content.value);
  title.value = "";
  content.value = "";
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <span class="font-semibold">App</span>
      <div class="flex items-center gap-3">
        <RouterLink v-if="auth.isAdmin()" to="/admin" class="text-sm underline">Admin</RouterLink>
        <button class="text-sm underline" @click="auth.signOut">Sign out</button>
      </div>
    </header>
    <main class="max-w-2xl mx-auto p-6 space-y-6">
      <form class="bg-white rounded-xl shadow p-4 space-y-3" @submit.prevent="onCreate">
        <h2 class="font-medium">New post</h2>
        <input v-model="title" placeholder="Title" class="w-full border rounded-lg px-3 py-2" />
        <textarea v-model="content" placeholder="Content" class="w-full border rounded-lg px-3 py-2" />
        <button class="rounded-lg bg-black text-white py-2 px-4">Create</button>
      </form>
      <div v-if="posts.loading">Loading…</div>
      <ul class="space-y-3">
        <li v-for="p in posts.items" :key="p.id" class="bg-white rounded-xl shadow p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-medium">{{ p.title }}</h3>
              <p class="text-sm text-gray-600">{{ p.content }}</p>
            </div>
            <button class="text-sm text-red-600 underline" @click="posts.remove(p.id)">Delete</button>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>
