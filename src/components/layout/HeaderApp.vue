<script setup>
import { ref } from 'vue'

import { useAuthStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'

import { useTasksStore } from '@/stores/tasksStore'

const tasksStore = useTasksStore()
const authStore = useAuthStore()
const router = useRouter()

const handleLogoutClick = async () => {
    await authStore.logoutUser()

    tasksStore.triggerNotification('تم تسجيل الخروج بأمان.')

    router.push('/login')
}

const searchInput = ref('')

const HandleSearch = () => {
    tasksStore.search(searchInput.value)

    if (tasksStore.searchResults?.length < 1)
        tasksStore.triggerNotification(`Not result Found for '${searchInput.value}'`)
    if (tasksStore.searchResults?.length > 0)
        tasksStore.triggerNotification(`Found '${tasksStore.searchResults.length}' result`)

    searchInput.value = ''
}
</script>
<template>
    <header
        class="h-16 bg-card border-b border-custom-border px-2 md:px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm"
    >
        <div class="flex items-center gap-2 md:gap-4">
            <button class="btn-primary p-2" @click="tasksStore.openSide">
                <font-awesome-icon icon="fa-solid  fa-bars" class="text-base w-5" />
            </button>
            <router-link to="/" class="flex items-center gap-2">
                <h1 class="text-title font-bold text-lg tracking-wider">Tasks</h1>
            </router-link>
        </div>

        <div class="relative w-full max-w-md hidden sm:block">
            <font-awesome-icon
                @click="HandleSearch"
                icon="fa-solid fa-magnifying-glass"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-sub text-sm"
            />
            <input
                @keyup.enter="HandleSearch"
                v-model="searchInput"
                type="search"
                class="form-input pl-10 py-2"
                placeholder="Quick search..."
            />
        </div>

        <div class="flex items-center gap-2 md:gap-5">
            <div class="flex items-center gap-2 select-none">
                <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span class="text-sm font-semibold text-foreground">Admin</span>
            </div>

            <button
                @click="handleLogoutClick"
                :disabled="authStore.isLoading"
                class="text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
                <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
                <span>{{ authStore.isLoading ? 'جاري الخروج...' : 'تسجيل الخروج' }}</span>
            </button>
        </div>
    </header>
</template>
