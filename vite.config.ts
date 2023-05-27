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
      { find: "@inputTypes", replacement: path.resolve(__dirname, "src/shared/inputTypes") },
      { find: "@models", replacement: path.resolve(__dirname, "src/shared/models") },
      { find: "@requestTypes", replacement: path.resolve(__dirname, "src/shared/requestTypes") },
      { find: "@services", replacement: path.resolve(__dirname, "src/shared/services") },
      { find: "@utils", replacement: path.resolve(__dirname, "src/shared/utils") },
      { find: "@validatorRules", replacement: path.resolve(__dirname, "src/shared/validatorRules") },
      { find: "@pages", replacement: path.resolve(__dirname, "src/pages") }
    ],
  },
  server: {
    port: 3000,
  },
})
