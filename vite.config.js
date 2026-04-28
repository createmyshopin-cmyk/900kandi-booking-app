import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    tailwindcss(),
    ViteImageOptimizer({
      // You can add compression options here if needed, defaults are usually fine
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 80 },
    })
  ],
});
