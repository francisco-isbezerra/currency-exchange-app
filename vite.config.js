import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: deve ser o nome exato do repositório no GitHub
  base: '/currency-exchange-app/',
})
