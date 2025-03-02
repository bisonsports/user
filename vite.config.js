import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/user/",
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: []
  }
});
