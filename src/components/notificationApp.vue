<script setup>
import { useTasksStore } from '../stores/tasksStore.js'

const taskStore = useTasksStore()
</script>
<template>
    <main>
        <transition name="fade">
            <div
                v-if="taskStore.notification.show"
                class="fixed top-17.5 right-5 bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 min-w-62.5 border border-red-700"
            >
                <font-awesome-icon icon="fa-solid fa-eye" class="text-white animate-bounce" />
                <span class="font-bold">{{ taskStore.notification.message }}</span>
            </div>
        </transition>
    </main>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
