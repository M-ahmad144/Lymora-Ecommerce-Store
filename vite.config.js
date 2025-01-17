import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target:
          "https://5d7cf89b-12ae-43b7-949c-42e2f8982e90.e1-us-east-azure.choreoapps.dev/",

        // target: "http://localhost:5000",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
