<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "../lib/api.js";

type AdminUser = { id: string; email: string; name: string; role: string };
const users = ref<AdminUser[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    const res = await api.api.admin.users.$get();
    if (res.ok) users.value = ((await res.json()) as { data: AdminUser[] }).data;
  } finally {
    loading.value = false;
  }
}

async function setRole(id: string, role: string) {
  await api.api.admin.users[":id"].role.$patch({ param: { id }, json: { role: role as "admin" | "user" } });
  await load();
}

onMounted(load);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <span class="font-semibold">Admin — Users</span>
      <RouterLink to="/app" class="text-sm underline">Back to app</RouterLink>
    </header>
    <main class="max-w-3xl mx-auto p-6">
      <div v-if="loading">Loading…</div>
      <table v-else class="w-full bg-white rounded-xl shadow overflow-hidden text-sm">
        <thead>
          <tr class="text-left border-b">
            <th class="p-3">Email</th>
            <th class="p-3">Name</th>
            <th class="p-3">Role</th>
            <th class="p-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id" class="border-b last:border-0">
            <td class="p-3">{{ u.email }}</td>
            <td class="p-3">{{ u.name }}</td>
            <td class="p-3">{{ u.role }}</td>
            <td class="p-3 text-right space-x-2">
              <button class="underline" @click="setRole(u.id, 'admin')">Make admin</button>
              <button class="underline" @click="setRole(u.id, 'user')">Make user</button>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>
