<script setup>
import { useTasksStore } from '@/stores/tasksStore'

const store = useTasksStore()
</script>

<template>
    <main>
        <aside
            class="w-60 h-full bg-sidebar p-2 md:p-5 border-r border-custom-border flex-col gap-2 select-none"
            :class="{ hidden: !store.isShowSideBar }"
        >
            <div class="px-4 py-3 mb-2">
                <span class="text-[10px] font-bold tracking-widest text-sub/50 uppercase block"
                    >Navigation</span
                >
            </div>

            <router-link
                exact-active-class="btn-primary text-accent! bg-background"
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-sub hover:bg-sidebar-hover hover:text-white transition-all duration-200 text-sm"
                :to="{ name: 'TasksList', query: { page: 1, limit: 20 } }"
            >
                <font-awesome-icon icon="fa-solid fa-users" class="text-base w-5" />
                <span>Tasks List</span>
            </router-link>
        </aside>
    </main>
</template>
