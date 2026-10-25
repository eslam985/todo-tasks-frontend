<script setup>
import { useAuthStore } from './stores/auth'

import notificationApp from '@/components/notificationApp.vue'
const authStore = useAuthStore()
</script>

<template>
    <div v-if="!authStore.isInitialized" class="splash-screen">
        <div class="spinner"></div>
        <p>جاري تهيئة النظام وأمان الجلسة...</p>
    </div>

    <div v-else>
        <RouterView />

        <notificationApp />
    </div>
</template>

<style scoped>
.splash-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f8f9fa;
    font-family: sans-serif;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #e9ecef;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
