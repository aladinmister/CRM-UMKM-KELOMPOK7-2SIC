import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://ahm.inspirasienergiprimanusa.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`Proxy request: ${req.method} ${req.url}`);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(`Proxy response: ${req.url} -> ${proxyRes.statusCode}`);
          });
        }
      },
      '/rajaongkir-api': {
        target: 'https://api.rajaongkir.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rajaongkir-api/, ''),
        secure: false,
        headers: {
          'key': 'YOUR_RAJAONGKIR_API_KEY' // Ganti dengan API key Anda
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
});