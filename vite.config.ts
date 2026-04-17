import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('react-dom') || id.includes('/react/') || id.includes('react-router')) {
              return 'vendor-react';
            }
            // Do not group `lucide-react` here: a single chunk forces the full icon set into every load.
            // Tree-shaken icons stay in route chunks; `LucideIconSelectInner` async chunk holds the full set for admin only.
            if (id.includes('node_modules/motion') || id.includes('/motion/')) {
              return 'vendor-motion';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // GitHub CMS: `yarn dev:api` must be running (default port 3001) or proxy returns ECONNREFUSED.
      proxy: {
        "/api": {
          target: env.VITE_DEV_API_PROXY || "http://localhost:3001",
          changeOrigin: true,
        },
      },
    },
  };
});
