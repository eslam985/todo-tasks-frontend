import { defineStore } from 'pinia'
import { computed } from 'vue'

import {
    getAllTasks as fetchAllTasksFromApi,
    addNewTask as setNewTask,
    editTask as renameTask,
    deleteTask as removeTask,
    changesTaskStatus as taskStatus,
    deleteAllTasks as removeAllTasks,
} from '@/api/tasks'

export const useTasksStore = defineStore('tasks', {
    state: () => ({
        tasks: [],
        searchResults: [],
        currentTask: {},
        totalTasks: 0,
        currentPage: 1,
        totalPages: 1,
        message: '',
        isLoading: false,
        isCooldown: false,
        isShowSideBar: false,
        notification: {
            show: false,
            message: '',
        },
    }),
    getters: {
        isLoadingState: () => computed(() => this?.isCooldown === true || this?.isLoading === true),
    },
    actions: {
        async getAllTasks(page = 1) {
            try {
                if (this.isCooldown || this.isLoading) return

                this.isLoading = true
                const data = await fetchAllTasksFromApi(page)
                if (!data) return

                this.tasks = data.tasks
                this.totalTasks = data.total
                this.currentPage = data.page
                this.totalPages = data.totalPage

                return true
            } catch (error) {
                const statusError = error?.response?.status
                if (statusError === 401 || statusError === 403) {
                    return false
                }

                console.error('حدث خطأ أثناء جلب المهام:', error)
                throw error
            } finally {
                this.isLoading = false

                this.isCooldown = true
                setTimeout(() => {
                    this.isCooldown = false
                }, 500)
            }
        },
        search(searchVal) {
            const val = searchVal?.trim().toLowerCase()

            if (!val || val.length < 2) {
                this.searchResults = []
                return
            }

            this.searchResults = this.tasks.filter((task) => task.title.toLowerCase().includes(val))
        },
        async getTaskById(taskId) {
            if (!taskId) return
            if (this.tasks.length < 1) {
                console.error('البينات لسه مجتش!', this.tasks)
                return
            }

            let targetTask = this.tasks.find((task) => task._id === taskId)

            if (!targetTask) return

            this.currentTask = targetTask
            return targetTask
        },
        async addNewTask(taskData) {
            try {
                const newTask = await setNewTask(taskData)
                if (!newTask) return

                this.tasks.unshift(newTask)

                this.totalTasks++

                return true
            } catch (error) {
                const statusError = error?.response?.status
                if (statusError === 400) {
                    this.message = error.response.data.message || 'عنوان المهمة مطلوب'
                    return false
                }
                if (statusError === 401 || statusError === 403) {
                    return false
                }

                console.error('حدث خطأ أثناء إضافة التاسك:', error)
                throw error
            } finally {
                this.isLoading = false

                this.isCooldown = true
                setTimeout(() => {
                    this.isCooldown = false
                }, 500)
            }
        },
        async editTask(idParams, taskData) {
            if (!idParams || !taskData) return

            if (this.isCooldown || this.isLoading) return

            this.isLoading = true
            try {
                const updatedTask = await renameTask(idParams, taskData)

                if (!updatedTask) return

                const index = this.tasks.findIndex((task) => task._id === idParams)

                if (index !== -1) {
                    this.tasks[index] = updatedTask
                }

                return true
            } catch (error) {
                const statusError = error?.response?.status
                if (statusError === 401 || statusError === 403) {
                    return false
                }

                console.error('حدث خطأ أثناء تعديل المهمة:', error)
                throw error
            } finally {
                this.isLoading = false

                this.isCooldown = true
                setTimeout(() => {
                    this.isCooldown = false
                }, 500)
            }
        },
        async deleteTask(idParams) {
            if (!idParams) return false

            const index = this.tasks.findIndex((task) => task._id === idParams)
            if (index === -1) return false

            const oldTask = this.tasks[index]

            this.tasks.splice(index, 1)
            this.totalTasks--

            if (this.searchResults && this.searchResults.length > 0) {
                const searchIndex = this.searchResults.findIndex((task) => task._id === idParams)
                if (searchIndex !== -1) this.searchResults.splice(searchIndex, 1)
            }

            try {
                const response = await removeTask(idParams)

                if (!response) {
                    this.tasks.splice(index, 0, oldTask)
                    this.totalTasks++
                    return false
                }

                return true
            } catch (error) {
                this.tasks.splice(index, 0, oldTask)
                this.totalTasks++

                const statusError = error?.response?.status
                if (statusError === 401 || statusError === 403) {
                    return false
                }

                console.error('حدث خطأ أثناء حذف المهمة:', error)
                throw error
            } finally {
                this.isLoading = false
                this.isCooldown = true
                setTimeout(() => {
                    this.isCooldown = false
                }, 500)
            }
        },

        async changesTaskStatus(idParams, statusData = null) {
            if (!idParams) return

            const index = this.tasks.findIndex((task) => task._id === idParams)
            if (index === -1) return

            const oldStatus = this.tasks[index].status

            this.tasks[index].status = statusData ?? 'pending'

            try {
                const updatedTask = await taskStatus(idParams, statusData)

                if (updatedTask) {
                    this.tasks[index] = updatedTask
                }
                return true
            } catch (error) {
                this.tasks[index].status = oldStatus

                const statusError = error?.response?.status
                if (statusError === 400) {
                    this.message = error.response.data.message
                }
                console.error('حدث خطأ في تغيير حالة التاسك:', error)
                return false
            }
        },

        async deleteAllTasks() {
            try {
                if (this.isCooldown || this.isLoading) return

                this.isLoading = true
                const response = await removeAllTasks()
                if (!response) return

                if (response.status === 204 || response.status === 200) {
                    this.tasks = []
                    this.totalTasks = 0
                    return true
                }
            } catch (error) {
                const statusError = error?.response?.status
                if (statusError === 401 || statusError === 403) {
                    return false
                }

                console.error('حدث خطأ أثناء حذف جميع المهام:', error)
                throw error
            } finally {
                this.isLoading = false

                this.isCooldown = true
                setTimeout(() => {
                    this.isCooldown = false
                }, 500)
            }
        },

        triggerNotification(msg) {
            this.notification.show = true
            this.notification.message = msg

            setTimeout(() => {
                this.notification.show = false
                this.notification.message = ''
            }, 3000)
        },

        openSide() {
            this.isShowSideBar = !this.isShowSideBar
        },
    },
})
