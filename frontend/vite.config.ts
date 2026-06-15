import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 3000,
    proxy: {
      // Spring Boot API 프록시 — CORS 없이 로컬 개발
      '/auth': 'http://localhost:8080',
      '/records': 'http://localhost:8080',
      '/albums': 'http://localhost:8080',
      '/profile': 'http://localhost:8080',
      '/feed': 'http://localhost:8080',
      '/search': 'http://localhost:8080',
      '/users': 'http://localhost:8080',
      '/api': 'http://localhost:8080',
    },
  },
})
