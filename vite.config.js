import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
  };
});