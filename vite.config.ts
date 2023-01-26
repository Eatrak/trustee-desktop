import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin()
  ],
  resolve: {
    alias: [
      { find: "@components", replacement: path.resolve(__dirname, "src/components") },
      { find: "@assets", replacement: path.resolve(__dirname, "src/assets") },
      { find: "@services", replacement: path.resolve(__dirname, "src/services") },
      { find: "@crudValidators", replacement: path.resolve(__dirname, "src/crudValidators") },
      { find: "@sections", replacement: path.resolve(__dirname, "src/sections") },
      { find: "@models", replacement: path.resolve(__dirname, "src/shared/models") },
    ],
  },
  server: {
    port: 3000,
  },
})
