import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // headers: {
    //   'Content-Security-Policy':
    //     "default-src 'self'; script-src 'self'; style-src 'self' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data: https://movieposters45.blob.core.windows.net; connect-src 'self' http://localhost:5000; frame-src 'self';"
    // }
  }
});