import { createRouter, createWebHistory } from "vue-router";
import { authClient } from "../lib/auth-client.js";

const Login = () => import("../views/Login.vue");
const AppHome = () => import("../views/AppHome.vue");
const AdminUsers = () => import("../views/AdminUsers.vue");
const Forbidden = () => import("../views/Forbidden.vue");

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/app" },
    { path: "/login", component: Login, meta: { public: true } },
    { path: "/403", component: Forbidden, meta: { public: true } },
    {
      path: "/app",
      component: AppHome,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin",
      component: AdminUsers,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
});

router.beforeEach(async (to) => {
  if (to.meta.public) return true;
  const { data } = await authClient.getSession({ fetchOptions: { credentials: "include" } });
  if (!data?.user) return "/login";
  if (to.meta.requiresAdmin && (data.user as { role?: string }).role !== "admin") return "/403";
  return true;
});
