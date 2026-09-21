import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Absolute base so deep links such as /ar/pizza load their assets correctly.
  base: "/",
  build: {
    target: "es2019",
    cssCodeSplit: false,
    assetsInlineLimit: 2048,
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/gsap")) return "gsap";
          if (id.includes("node_modules/react")) return "react";
        },
      },
    },
  },
  server: { host: true },
});
