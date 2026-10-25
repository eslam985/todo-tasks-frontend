<template>
    <main class="flex justify-center mb-2">
        <nav class="flex px-2 py-2 md:mt-2 gap-2 md:gap-6 overflow-x-auto">
            <router-link
                :to="{ name: 'TasksList' }"
                exact-active-class="gap-3 md:gap-3 px-3 py-2 bg-accent self-center text-white! font-semibold shadow-md shadow-accent/20"
                class="flex items-center p-2 gap-2 rounded-xl text-sub hover:bg-sidebar-hover hover:text-white transition-all duration-200 text-sm"
            >
                <font-awesome-icon icon="fa-solid fa-house" class="text-base w-5 self-center" />
                <span>TasksList</span>
            </router-link>
        </nav>
    </main>
</template>
