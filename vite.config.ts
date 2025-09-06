import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          dayjs: ['dayjs'],
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    svgr(),
    VitePWA({
      strategies: 'generateSW',
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      manifest: {
        name: '마음:ON',
        short_name: '마음ON',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ff4a93',
        icons: [
          { src: '/logo-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/logo-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,

        globPatterns: ['**/*.{js,css,html,ico,svg,webp,avif,woff2}'],

        globIgnores: ['**/assets/divider-*.js', '**/assets/diary-mammon-card-*.js', '**/image.png'],

        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'script',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'js-runtime',
              expiration: { maxEntries: 60, maxAgeSeconds: 7 * 24 * 3600 },
            },
          },
          {
            urlPattern: /\.(png|jpg|jpeg|gif|webp|avif)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets',
              expiration: { maxEntries: 120, maxAgeSeconds: 30 * 24 * 3600 },
            },
          },
          {
            urlPattern: /\.(woff2?|ttf|otf)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 365 * 24 * 3600 },
            },
          },
        ],
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
});
