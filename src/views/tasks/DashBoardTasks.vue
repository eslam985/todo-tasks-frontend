<script setup>
import { computed, onMounted, watch } from 'vue'
import { useTasksStore } from '@/stores/tasksStore'
import { useRoute, useRouter } from 'vue-router'

import AppPagination from '@/components/layout/AppPagination.vue'

const tasksStore = useTasksStore()
const route = useRoute()
const router = useRouter()

const completeTasksCount = computed(() => {
    if (!Array.isArray(tasksStore.tasks) || tasksStore.tasks?.length < 1) return
    const result = tasksStore.tasks?.filter((task) => task.status !== 'pending')
    return result?.length ?? 0
})

const deleteTask = async (idParams) => {
    await tasksStore.deleteTask(idParams)
}

const removeAllTasks = async () => {
    await tasksStore.deleteAllTasks()
}

const changeStatus = async (task) => {
    if (!task) return
    const newStatus = task.status === 'pending' ? 'completed' : 'pending'
    await tasksStore.changesTaskStatus(task._id, newStatus)
}

const refreshData = async () => {
    tasksStore.searchResults = []

    if (Number(route.query.page) !== 1) {
        await router.replace({ name: 'TasksList', query: { page: 1, limit: 20 } })
    } else {
        await tasksStore.getAllTasks({ page: 1, limit: 20 }, true)
    }
}

const getCleanQuery = () => {
    return {
        page: route.query.page ?? 1,
        limit: route.query.limit ?? 20,
    }
}

const loadData = async (force = false) => {
    await tasksStore.getAllTasks(getCleanQuery(), force)
}

const handlePageChange = async (newPage) => {
    await router.push({
        query: {
            ...route.query,
            page: newPage,
        },
    })

    loadData()
}

onMounted(async () => {
    if (!route.query.page || !route.query.limit) {
        await router.replace({
            path: route.path,
            query: { page: 1, limit: 20 },
        })
    }

    loadData()
})

watch(
    () => route.query,
    async () => {
        loadData(true)
    },
    { deep: true },
)
</script>

<template>
    <main class="bg-background text-title flex items-center justify-center select-none">
        <div
            class="w-full max-w-7xl my-3 bg-card-bg border border-custom-border rounded-2xl shadow-xl overflow-hidden flex flex-col"
        >
            <div
                class="flex flex-wrap bg-accent/10 flex-row justify-between gap-2 p-3 md:p-5 border-b border-custom-border"
            >
                <div class="flex justify-between gap-2 md:gap-6">
                    <router-link
                        :to="{ name: 'addTask' }"
                        :disabled="tasksStore.isLoading || tasksStore.isCooldown"
                        class="btn-primary flex items-center text-xs"
                    >
                        Add Task
                    </router-link>

                    <button
                        @click="refreshData"
                        type="button"
                        class="btn-secondary flex items-center"
                    >
                        <span class="text-xs">Refresh Data</span>
                    </button>

                    <button
                        v-if="tasksStore.tasks?.length > 1"
                        @click="removeAllTasks"
                        :disabled="tasksStore.isLoading || tasksStore.isCooldown"
                        class="text-xs md:text-xl font-bold tracking-tight bg-red-500 text-white p-2 px-3 rounded-md cursor-pointer hover:bg-sidebar-hover"
                    >
                        Delete All Tasks
                    </button>
                </div>

                <div class="flex justify-between gap-2 md:gap-4 text-xs font-semibold">
                    <div
                        class="text-xs md:text-xl text-center self-center bg-background px-2 md:px-4 py-2 rounded-xl border border-custom-border"
                    >
                        Total Tasks:
                        <span class="text-accent font-bold">
                            {{ tasksStore.pagination.totalTasks ?? tasksStore.tasks.length }}
                        </span>
                    </div>
                    <div
                        class="text-xs md:text-xl text-center self-center bg-background px-2 md:px-4 py-2 rounded-xl border border-custom-border"
                    >
                        Completed:
                        <span class="text-green-500 font-bold">{{ completeTasksCount ?? 0 }}</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-3 p-3 md:p-6 space-y-4 flex-1">
                <div
                    v-if="tasksStore.tasks ? tasksStore.tasks.length === 0 : []"
                    class="text-center py-12 text-sub/60 text-xs"
                >
                    <p class="mb-4">
                        No tasks available. Add some tasks to get started! / لا يوجد مهام حالياً
                    </p>
                    <router-link
                        :to="{ name: 'addTask' }"
                        class="text-xl text-center font-bold tracking-tight bg-accent text-white p-2 px-3 rounded-md cursor-pointer hover:bg-sidebar-hover"
                    >
                        Add Task
                    </router-link>
                </div>

                <div
                    v-for="task in tasksStore.searchResults?.length > 0
                        ? tasksStore.searchResults
                        : tasksStore.tasks"
                    :key="task.id"
                    class="flex flex-col justify-between gap-4 bg-background border border-custom-border hover:border-accent/40 rounded-xl p-3 md:p-5 shadow-sm transition-all"
                >
                    <div class="flex flex-col gap-3">
                        <div class="flex gap-3">
                            <input
                                type="checkbox"
                                @change="changeStatus(task)"
                                :checked="task.status === 'completed'"
                                class="w-5 h-5 self-center shrink-0 accent-accent cursor-pointer"
                            />

                            <h3
                                class="font-bold text-base sm:text-lg text-title"
                                :class="task.status === 'completed' ? ' line-through' : ''"
                            >
                                {{ task.title ?? 'unknown' }}
                            </h3>
                        </div>

                        <p
                            class="text-sm md:text-left text-neutral-600"
                            :class="task.status === 'completed' ? ' line-through' : ''"
                        >
                            {{ task.description ?? 'No description provided / لا يوجد وصف' }}
                        </p>
                    </div>

                    <div class="flex items-center gap-4 justify-end">
                        <span
                            v-if="task.status === 'pending' || task.status === 'completed'"
                            :class="[
                                task.status === 'pending'
                                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                    : 'bg-green-500/10 text-green-500 border-green-500/20',
                                'px-3 py-1 rounded-full text-xs font-bold border capitalize tracking-wide',
                            ]"
                        >
                            {{ task.status }}
                        </span>
                        <span v-else class="font-bold text-base sm:text-lg text-title"
                            >unknown</span
                        >
                        <router-link
                            :to="{ name: 'EditTask', params: { id: task?._id ?? 0 } }"
                            class="text-sm md:text-lg text-center content-center font-bold tracking-tight bg-accent text-white py-1 px-4 rounded-md cursor-pointer hover:bg-sidebar-hover"
                        >
                            Edit
                        </router-link>

                        <button
                            @click="deleteTask(task?._id ?? 0)"
                            :disabled="tasksStore.isLoading || tasksStore.isCooldown"
                            class="text-sm md:text-lg font-bold tracking-tight bg-red-500/10 text-red-500 border border-red-500/20 p-1.5 px-3 rounded-xl cursor-pointer hover:bg-red-500 hover:text-white transition-all"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <AppPagination
                :pagination="tasksStore.pagination"
                :is-loading="tasksStore.isLoading"
                @change-page="handlePageChange"
            />
        </div>
    </main>
</template>
