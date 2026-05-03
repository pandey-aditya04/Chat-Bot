import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      external: [
        'express', 
        'cors', 
        'fs', 
        'path', 
        'crypto', 
        'http', 
        'https', 
        'bcryptjs', 
        'jsonwebtoken', 
        'morgan', 
        'winston', 
        'helmet', 
        'dotenv'
      ]
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
