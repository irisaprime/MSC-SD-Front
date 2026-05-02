import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '5173-01k6st6sbydtjbwrmp2pv0qp13.cloudspaces.litng.ai'
    ]
  }
})