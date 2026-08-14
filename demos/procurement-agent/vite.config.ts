import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

/**
 * 构建产物直接输出到个人站的 public/demos/procurement-agent/，
 * 由 Next.js 作为静态资源托管，案例页用 iframe 嵌入。
 */
export default defineConfig({
  base: '/demos/procurement-agent/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174,
  },
  build: {
    outDir: path.resolve(__dirname, '../../public/demos/procurement-agent'),
    emptyOutDir: true,
    sourcemap: false,
  },
});
