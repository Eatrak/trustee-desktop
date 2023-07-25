import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
    },
    resolve: {
        alias: {
            "@shared": path.resolve(__dirname, "./src/shared"),
            "@features": path.resolve(__dirname, "./src/features"),
        },
    },
});
