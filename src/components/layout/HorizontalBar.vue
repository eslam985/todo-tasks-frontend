<template>
    <main class="flex justify-center mb-2">
        <nav class="flex px-2 py-2 md:mt-2 gap-2 md:gap-6 overflow-x-auto">
            <router-link
                exact-active-class="btn-primary text-accent! bg-background"
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-sub hover:bg-sidebar-hover hover:text-white transition-all duration-200 text-sm"
                :to="{ name: 'TasksList', query: { page: 1, limit: 20 } }"
            >
                <font-awesome-icon icon="fa-solid fa-users" class="text-base w-5" />
                <span>Tasks List</span>
            </router-link>
        </nav>
    </main>
</template>
