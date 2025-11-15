// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // REMOVE the entire build block:
  // build: {
  //   rollupOptions: {
  //     external: ['react-dropzone'],
  //   },
  // },
});