import { defineConfig } from "vitest/config";
import react from '@vitejs/plugin-react'
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom'
  },
  resolve: {
    alias: {
      "@services": path.resolve(__dirname, "./src/services"),
      "@crudValidators": path.resolve(__dirname, "./src/crudValidators"),
      "@components": path.resolve(__dirname, "./src/components")
    },
  },
});
