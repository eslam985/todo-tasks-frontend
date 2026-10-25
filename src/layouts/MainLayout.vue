<template>
    <div class="flex h-screen overflow-hidden bg-background">
        <Sidebar />

        <div class="flex-1 flex flex-col min-w-0 h-full">
            <Header />
            <HorizontalBar />

            <main class="flex-1 overflow-y-auto flex flex-col gap-4 p-3">
                <router-view />
            </main>

            <Footer />
        </div>

        <notificationApp />
    </div>
</template>

<script setup>
import Header from '@/components/layout/HeaderApp.vue'
import Footer from '@/components/layout/FooterApp.vue'
import Sidebar from '@/components/layout/SidebarApp.vue'
import HorizontalBar from '@/components/layout/HorizontalBar.vue'

import notificationApp from '@/components/notificationApp.vue'
</script>
