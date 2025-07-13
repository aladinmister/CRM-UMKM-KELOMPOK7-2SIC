// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/rajaongkir-api': { 
        target: 'https://api.rajaongkir.com', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rajaongkir-api/, ''), 
        secure: false, 
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[Vite Proxy] Meneruskan permintaan: ${req.method} ${req.url} -> <span class="math-inline">\{proxyReq\.protocol\}//</span>{proxyReq.host}${proxyReq.path}`);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(`[Vite Proxy] Menerima respons dari ${req.url} dengan status: ${proxyRes.statusCode}`);
          });
        }
      },
    },
  },
});