import react from '@vitejs/plugin-react'
import { loadEnv, defineConfig } from 'vite'
import path from 'path'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    plugins: [react()],
    build: {
      outDir: 'build',
      sourcemap: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          disconnected: path.resolve(__dirname, 'disconnected/index.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/disconnected': path.resolve(__dirname, './disconnected'),
      },
    },

    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.VITE_SERVER_TARGET || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: env.VITE_SERVER_TARGET || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  })
}
