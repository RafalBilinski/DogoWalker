import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import svgr from "vite-plugin-svgr";
import { ngrok } from 'vite-plugin-ngrok'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    ngrok( '2xoCw3arTR7DNjvA2YCRSAhF6w4_74Zbtw4a3TWcGwHBpdZcg' ),
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
