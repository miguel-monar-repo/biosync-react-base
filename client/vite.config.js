import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo, fetch('/api/...') se reenvía a la API de Express (carpeta api/)
    proxy: { '/api': 'http://localhost:4000' },
    // Permite importar las reglas compartidas de ../shared (fuera de client/)
    fs: { allow: ['..'] },
  },
})
