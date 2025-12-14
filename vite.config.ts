import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 全站 CDN：设置静态资源的基础路径
  // 本地开发时使用 `/`，生产环境使用 CDN URL
  base: process.env.VITE_CDN_URL || "/",
});
