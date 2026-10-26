<script setup>
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'

import { useTasksStore } from '@/stores/tasksStore'

const tasksStore = useTasksStore()
const router = useRouter()
const route = useRoute()

const taskId = route.params.id

const isEdit = route.name === 'EditTask'
const isAdd = route.name === 'addTask'

const isLoading = tasksStore?.isLoadingState

const formDate = ref({
    title: '',
    description: '',
    status: 'pending',
})

const handleAddTask = async () => {
    if (!isAdd) return

    if (!formDate.value.title.trim()) {
        tasksStore.triggerNotification('Error: Task Title is required!')
        return
    }

    const isSuccess = await tasksStore.addNewTask({
        title: formDate.value.title.trim(),
        description: formDate.value.description.trim(),
    })

    if (!isSuccess) {
        tasksStore.triggerNotification(tasksStore.message || `Error: Task Not Added`)
        return
    }

    tasksStore.triggerNotification(`Success: Task "${formDate.value.title}" Added ✅`)

    await router.replace({ name: 'TasksList', query: { page: 1, limit: 20 } })
}

const handleEditTask = async () => {
    if (!isEdit) return

    const isSuccess = await tasksStore.editTask(taskId, formDate.value)

    if (!isSuccess) {
        tasksStore.triggerNotification(tasksStore.message || `Error: Task Not Editing`)
        return
    }

    tasksStore.triggerNotification(`Success: Task "${formDate.value.title}" Editing ✅`)

    await router.replace({ name: 'TasksList', query: { page: 1, limit: 20 } })
}

const targetSubmet = () => {
    isEdit ? handleEditTask() : null

    isAdd ? handleAddTask() : null
}

const FilledDataFields = () => {
    if (!taskId && !isEdit) return

    tasksStore.getTaskById(taskId)
    const targetTask = tasksStore.currentTask

    if (!targetTask || Object.keys(targetTask).length < 1) return

    formDate.value.title = targetTask.title
    formDate.value.description = targetTask.description
}

onMounted(() => {
    FilledDataFields()
})

watch(
    () => tasksStore.tasks,
    () => {
        if (isAdd || !taskId) return

        FilledDataFields()
    },
    { deep: true },
)
</script>

<template>
    <section>
        <div v-if="isEdit && Object.keys(tasksStore.currentTask).length < 1" class="splash-screen">
            <div class="spinner"></div>
            <p>loading...</p>
        </div>

        <div v-else class="bg-background flex items-center justify-center select-none p-3">
            <div
                class="w-full max-w-xl bg-card rounded-2xl border border-custom-border shadow-xl p-2 md:p-6 space-y-6"
            >
                <div class="text-center space-y-2">
                    <h2 class="text-2xl font-bold text-title tracking-tight">
                        {{
                            isAdd
                                ? 'Create New Task'
                                : `Edit Task ${tasksStore.currentTask?.title ?? ''}`
                        }}
                    </h2>
                    <p class="text-sub text-sm">
                        Organize your day by adding a new assignment / أضف مهمة جديدة
                    </p>
                </div>

                <form @submit.prevent="targetSubmet" class="space-y-5">
                    <div class="flex flex-col gap-1.5">
                        <label for="title" class="form-label font-semibold text-title text-sm"
                            >Task Name / اسم المهمة</label
                        >
                        <div class="relative">
                            <font-awesome-icon
                                icon="fa-solid fa-pen-to-square"
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-sub/50 text-sm"
                            />
                            <input
                                id="title"
                                type="text"
                                placeholder="e.g. Finish the API connection"
                                v-model="formDate.title"
                                class="form-input pl-11 w-full bg-background border border-custom-border rounded-xl px-4 py-3 text-title placeholder-sub/40 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label for="description" class="form-label font-semibold text-title text-sm"
                            >description / وصف المهمة</label
                        >
                        <div class="relative">
                            <textarea
                                id="description"
                                placeholder="Write some details about this task..."
                                v-model="formDate.description"
                                rows="4"
                                class="form-input pl-6 w-full bg-background border border-custom-border rounded-xl px-4 py-3 text-title placeholder-sub/40 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div class="flex gap-3 pt-2">
                        <button type="button" @click="router.push('/tasks')" class="btn-secondary">
                            Cancel / إلغاء
                        </button>

                        <button
                            type="submit"
                            class="btn-primary flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium py-3 rounded-xl shadow-lg shadow-accent/20 transition-all disabled:opacity-50"
                            :disabled="isLoading || !formDate.title"
                        >
                            <font-awesome-icon
                                v-if="isLoading"
                                icon="fa-solid fa-spinner"
                                class="animate-spin text-sm"
                            />

                            <span v-if="isAdd">
                                {{
                                    isLoading && isAdd
                                        ? 'Adding Task...'
                                        : 'Add Task / إضافة المهمة'
                                }}
                            </span>

                            <span v-else-if="isEdit">
                                {{
                                    isLoading && isEdit
                                        ? 'Editing Task...'
                                        : 'Edit Task / تعديل المهمة'
                                }}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
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
