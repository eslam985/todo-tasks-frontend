import api from './client'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import { useNotificationStore } from '@/stores/notificationStore'

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore()

        const isAuthEndpoint =
            config.url?.includes('/auth/login') || config.url?.includes('/auth/refresh')

        if (authStore.isAuthenticated && !isAuthEndpoint) {
            config.headers.Authorization = `Bearer ${authStore.accessToken}`
        }

        return config
    },
    (err) => Promise.reject(err),
)

api.interceptors.response.use(
    (response) => response,
    async (err) => {
        const authStore = useAuthStore()
        const originalRequest = err.config
        const status = err.response?.status
        const notiStore = useNotificationStore()

        if (status === 429) {
            const h = err.response?.headers
            const raw = h
                ? h.get('Retry-After') || h.get('retry-after') || h.get('RateLimit-Reset')
                : null
            const retryAfter = parseInt(raw || '60', 10) || 60

            const mins = Math.ceil(retryAfter / 60)

            notiStore.triggerNotification(`Too many requests - Try again after ${mins}`)

            return Promise.reject(err)
        }

        if (status === 404) {
            notiStore.triggerNotification("We couldn't find what you're looking for.")
            return Promise.reject(err)
        }

        if (status === 413) {
            const errorMessage = err.response?.data?.message || 'حجم الملف المرفوع كبير جداً!'

            notiStore.triggerNotification(errorMessage)

            return Promise.reject(err)
        }

        if (status === 504) {
            notiStore.triggerNotification(
                'انتهت مهلة الاتصال بالخادم (Gateway Timeout)، العملية استغرقت وقتاً طويلاً.',
            )
            return Promise.reject(err)
        }

        const isAuthEndpoint =
            originalRequest?.url?.includes('/auth/login') ||
            originalRequest?.url?.includes('/auth/refresh')

        const isErrorStatus = status === 401

        if (isErrorStatus && !isAuthEndpoint && originalRequest && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        if (originalRequest.headers?.set) {
                            originalRequest.headers.set('Authorization', `Bearer ${token || ''}`)
                        } else if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token || ''}`
                        }
                        return api(originalRequest)
                    })

                    .catch((err) => {
                        return Promise.reject(err)
                    })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const isRefreshed = await authStore.restoreSession()

                if (isRefreshed) {
                    const newToken = authStore.accessToken
                    processQueue(null, newToken)

                    if (originalRequest.headers?.set) {
                        originalRequest.headers.set('Authorization', `Bearer ${newToken || ''}`)
                    } else if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newToken || ''}`
                    }

                    return api(originalRequest)
                } else {
                    processQueue(new Error('Session expired'))
                    authStore.clearAccessToken()
                    router.push('/login')
                    return Promise.reject(err)
                }
            } catch (refreshErr) {
                processQueue(refreshErr)
                authStore.clearAccessToken()
                router.push('/login')
                return Promise.reject(refreshErr)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(err)
    },
)

export default api
