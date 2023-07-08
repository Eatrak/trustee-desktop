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
      { find: "@assets", replacement: path.resolve(__dirname, "src/shared/assets") },
      { find: "@components", replacement: path.resolve(__dirname, "src/shared/components") },
      { find: "@ts-types", replacement: path.resolve(__dirname, "src/shared/types") },
      { find: "@services", replacement: path.resolve(__dirname, "src/shared/services") },
      { find: "@utils", replacement: path.resolve(__dirname, "src/shared/utils") },
      { find: "@validatorRules", replacement: path.resolve(__dirname, "src/shared/validatorRules") },
      { find: "@features", replacement: path.resolve(__dirname, "src/features") }
    ],
  },
  server: {
    port: 3000,
  },
})
