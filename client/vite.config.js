import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  //backend route proxy
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
