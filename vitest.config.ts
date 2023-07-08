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
      "@assets": path.resolve(__dirname, "./src/shared/assets"),
      "@components": path.resolve(__dirname, "./src/shared/components"),
      "@ts-types": path.resolve(__dirname, "./src/shared/types"),
      "@services": path.resolve(__dirname, "./src/shared/services"),
      "@utils": path.resolve(__dirname, "./src/shared/utils"),
      "@validatorRules": path.resolve(__dirname, "./src/shared/validatorRules"),
      "@features": path.resolve(__dirname, "./src/features")
    },
  },
});
