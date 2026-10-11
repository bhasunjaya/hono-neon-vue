import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "../lib/api.js";

export type PostItem = {
  id: string;
  title: string;
  content: string;
  authorId: string;
};

export const usePostsStore = defineStore("posts", () => {
  const items = ref<PostItem[]>([]);
  const loading = ref(false);

  async function fetchAll() {
    loading.value = true;
    try {
      const res = await api.api.posts.$get({ query: { page: "1", pageSize: "20" } });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const json = (await res.json()) as { data: PostItem[] };
      items.value = json.data;
    } finally {
      loading.value = false;
    }
  }

  async function create(title: string, content: string) {
    const res = await api.api.posts.$post({ json: { title, content } });
    if (!res.ok) throw new Error(`Create failed: ${res.status}`);
    await fetchAll();
  }

  async function remove(id: string) {
    const res = await api.api.posts[":id"].$delete({ param: { id } });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
    await fetchAll();
  }

  return { items, loading, fetchAll, create, remove };
});
