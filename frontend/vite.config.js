import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'SmartAdega';

export default defineConfig({
    plugins: [react()],

    // Necessário para GitHub Pages
    base: `/${repoName}/`,

    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            }
        }
    }
})