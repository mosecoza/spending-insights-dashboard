import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      Components: path.resolve(__dirname, 'src/components'),
      Features: path.resolve(__dirname, 'src/features'),
      Store: path.resolve(__dirname, 'src/store'),
      Lib: path.resolve(__dirname, 'src/lib'),
      Constants: path.resolve(__dirname, 'src/constants'),
      Types: path.resolve(__dirname, 'src/types'),
    },
  },
  server: { port: 5173 },
  test: {
    environment: 'node',
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
});
