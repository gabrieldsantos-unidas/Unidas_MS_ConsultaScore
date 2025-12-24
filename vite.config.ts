import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Unidas_MS_ConsultaScore/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
