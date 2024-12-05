import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'src/manifest.json', dest: '.' }, // Copy manifest.json
        { src: 'src/popup.html', dest: '.' },   // Copy popup.html
        { src: 'src/style.css', dest: '.' },    // Copy style.css
        { src: 'src/utils/categoryInfo.js', dest: '.' } // Copy contentScript.js
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup.html'),
        background: resolve(__dirname, 'src/background.js'),
        contentScript: resolve(__dirname, 'src/utils/categoryInfo.js'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});