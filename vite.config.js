import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'src/manifest.json', dest: '.' }, // Copy manifest.json to root of dist
        { src: 'src/popup.html', dest: '.' },   // Copy popup.html to root of dist
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup.html'), // File only
        background: resolve(__dirname, 'src/background.js'), // File only
      },
      output: {
        entryFileNames: '[name].js', // Place files in root
        assetFileNames: '[name].[ext]', // Flatten asset files
      },
    },
  },
});
