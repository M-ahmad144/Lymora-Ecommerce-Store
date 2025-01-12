import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://lymora-backend.vercel.app", // Added 'https://'
        changeOrigin: true,
        secure: false, // Optional, allows for self-signed certificates (if needed)
      },
      "/uploads": {
        target: "https://lymora-backend.vercel.app", // Added 'https://'
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
