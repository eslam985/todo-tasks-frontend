import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('tasks', {
    state: () => ({
        isShowSideBar: false,
        notification: {
            show: false,
            message: '',
        },
    }),

    actions: {
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
