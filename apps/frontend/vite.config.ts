import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [vue(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        // Local: Vite -> wrangler dev. In prod set VITE_API_URL to Workers URL.
        "/api": {
          target: env.VITE_API_URL ?? "http://localhost:8787",
          changeOrigin: true,
        },
      },
    },
  };
});
