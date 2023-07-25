import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
    resolve: {
        alias: [
            {
                find: "@shared",
                replacement: path.resolve(__dirname, "src/shared"),
            },
            { find: "@features", replacement: path.resolve(__dirname, "src/features") },
        ],
    },
    server: {
        port: 3000,
    },
});
