import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    // Ogni file importa con `@/`. Finora l'alias lo iniettava il plugin base44:
    // Vite non legge i `paths` di tsconfig.json, quindi va definito qui.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [react()],
});
