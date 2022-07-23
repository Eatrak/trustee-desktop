import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@services": path.resolve(__dirname, "./src/services"),
      "@crudValidators": path.resolve(__dirname, "./src/crudValidators")
    },
  },
});
