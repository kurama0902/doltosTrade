import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        home: "index.html",
        privacy: "privacy/index.html",
        desktop: "desktop/index.html",
      },
      output: {
        manualChunks: {
          charts: ["recharts"],
          animation: ["gsap"],
        },
      },
    },
  },
});
