import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',

            includeAssets: [
                'favicon.ico',
                'icon-192.png',
                'icon-512.png'
            ],

            manifest: {
                name: 'SmartAdega',
                short_name: 'SmartAdega',
                description: 'Gerencie sua colecao de vinhos',
                theme_color: '#80002e',
                background_color: '#ffffff',

                display: 'standalone',
                orientation: 'portrait',

                start_url: '/SmartAdega/',
                scope: '/SmartAdega/',

                icons: [
                    {
                        src: 'icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'icon-512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],

    base: '/SmartAdega/',

    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        }
    }
})
