import { defineStore } from 'pinia'

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
        pagination: {
            total: 0,
            page: 1,
            limit: 20,
            totalPage: 0,
        },
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
        isLoadingState: (state) => state.isCooldown === true || state.isLoading === true,
    },
    actions: {
        async getAllTasks(queryParams, force = false) {
            if (!force && this.tasks.length > 0) return

            try {
                this.isLoading = true
                console.log('queryParams: ', queryParams)
                const result = await fetchAllTasksFromApi(queryParams)
                if (!result.success || !result.data) return

                this.tasks = result.data ?? []
                this.pagination = result.pagination ?? {}

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
                this.isLoading = true
                const response = await setNewTask(taskData)

                if (!response || !response.success || !response.data) return false

                const taskCleanData = response.data

                this.tasks.unshift(taskCleanData)

                this.pagination.total++

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

            this.isLoading = true
            try {
                const response = await renameTask(idParams, taskData)

                if (!response || !response.success || !response.data) return false

                const taskCleanData = response.data

                const index = this.tasks?.findIndex((task) => task._id === idParams)

                if (index !== -1) {
                    this.tasks[index] = taskCleanData
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
            this.isLoading = true
            const index = this.tasks?.findIndex((task) => task._id === idParams)
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
            if (!idParams) return false
            const index = this.tasks ? this.tasks.findIndex((task) => task._id === idParams) : false

            if (index === -1) return false

            const oldStatus = this.tasks[index].status

            this.tasks[index].status = statusData ?? 'pending'

            try {
                const result = await taskStatus(idParams, statusData)

                if (!result.data || !result.success) return false

                this.tasks[index] = result.data

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
