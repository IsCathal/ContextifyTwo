import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { execSync } from 'child_process'; // For running shell commands

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'src/manifest.json', dest: '.' }, // Copy manifest.json
        { src: 'src/popup.html', dest: '.' },   // Copy popup.html
        { src: 'src/style.css', dest: '.' },    // Copy style.css
        { src: 'src/utils/categoryInfo.js', dest: 'utils' },
        { src: 'src/utils/categoryUtils.js', dest: 'utils' },
        { src: 'src/utils/highlightUtils.js', dest: 'utils' },
        { src: 'src/utils/apiUtils.js', dest: 'utils' }


      ],
    }),
    {
      name: 'run-tests-on-build', // Custom plugin name
      buildStart() {
        try {
          // Run the test command
          console.log('Running tests...');
          execSync('npm test', { stdio: 'inherit' });
          console.log('All tests passed!');
        } catch (error) {
          console.error('Tests failed.');
          process.exit(1); // Exit the build process if tests fail
        }
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup.html'),
        background: resolve(__dirname, 'src/background.js'),
        contentScript: resolve(__dirname, 'src/utils/highlightUtils.js'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
