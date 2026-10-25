import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite' // 1. استيراد الإضافة
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: true, // بيخلي السيرفر يستقبل اتصالات من الشبكة الخارجية (LAN)
    },
    plugins: [
        tailwindcss(),
        vue(),
        vueDevTools(),
        visualizer({
            open: true,
            filename: 'bundle-analysis.html', // اسم الملف الناتج
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})
