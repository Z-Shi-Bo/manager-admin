import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), WindiCSS()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    open: true,
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  css: {
    // 配置scss全局变量
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";`,
      },
    },
  },
});
