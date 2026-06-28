import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/dokumen': {
        target: 'https://api-simpeg.widy4aa.my.id',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            delete proxyRes.headers['content-disposition'];
          });
        },
      },
      // '/dokumen': {
      //   target: 'http://be-simpeg-rskalisat.test',
      //   changeOrigin: true,
      //   configure: (proxy) => {
      //     proxy.on('proxyRes', (proxyRes) => {
      //       delete proxyRes.headers['content-disposition'];
      //     });
      //   },
      // },
    },
  },
})