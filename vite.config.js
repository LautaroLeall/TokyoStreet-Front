import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: {
        // Separa librerías pesadas para que la Landing inicial vuele en redes móviles 4G
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@supabase")) return "supabase";
            if (id.includes("qrcode")) return "qr";
            if (id.includes("three")) return "three-vendor";
            if (id.includes("framer-motion") || id.includes("lenis"))
              return "motion";
            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              id.includes("react-router")
            ) {
              return "react-vendor";
            }
          }
          return undefined;
        },
      },
    },
  },
});
