import { defineStore } from 'pinia'
import { refresh, logout, login } from '@/api/auth.js'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null,
        isLoading: false,
        isInitialized: false,
        successMessage: '',
        errorMessage: '',
    }),
    getters: {
        isAuthenticated: (state) => !!state.accessToken,
    },
    actions: {
        setAccessToken(token) {
            this.accessToken = token
        },
        clearAccessToken() {
            this.accessToken = null
        },

        async restoreSession() {
            this.isLoading = true

            try {
                const data = await refresh()

                this.setAccessToken(data.accessToken)
                return true
            } catch (error) {
                const status = error.response?.status
                const isStatusErr = status === 401 || status === 403
                if (isStatusErr) return false

                console.error(error)
                throw error
            } finally {
                this.isLoading = false
                this.isInitialized = true
            }
        },
        async loginUser(credentials) {
            try {
                this.errorMessage = ''
                console.log(credentials)
                const data = await login(credentials)
                console.log(data)

                this.accessToken = data.accessToken
                return true
            } catch (error) {
                this.errorMessage =
                    error?.response?.data?.message || 'حدث خطأ ما، يرجى المحاولة لاحقاً'
                return false
            }
        },

        async logoutUser() {
            this.isLoading = true
            try {
                await logout()
            } catch (error) {
                console.error('حدثت مشكلة في تسجيل الخروج اعد المحاولة لاحقا!', error)
            } finally {
                this.clearAccessToken()
                this.isLoading = false
            }
        },
    },
})
