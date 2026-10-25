import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/tasks',
        },
        {
            path: '/',
            component: MainLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'tasks/',
                    name: 'TasksList',
                    component: () => import('@/views/tasks/DashBoardTasks.vue'),
                    meta: { requiresAuth: true },
                },
                {
                    path: 'new-task/',
                    name: 'addTask',
                    component: () => import('@/views/tasks/TaskModel.vue'),
                    meta: { requiresAuth: true },
                },
                {
                    path: 'edit-task/:id',
                    name: 'EditTask',
                    component: () => import('@/views/tasks/TaskModel.vue'),

                    meta: { requiresAuth: true },
                },
            ],
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/auth/RegisterView.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/auth/LoginView.vue'),
        },
        {
            path: '/serverError',
            name: 'serverError',
            component: () => import('@/views/errors/500View.vue'),
        },

        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/views/errors/404View.vue'),
        },
    ],
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    if (!authStore.isInitialized) {
        try {
            await authStore.restoreSession()
        } catch (err) {
            console.error('السيرفر متوقف أو لا يستجيب:', err)
            return next({ name: 'serverError' })
        }
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
    } else if (to.path === '/login' && authStore.isAuthenticated) {
        next({ name: 'TasksList' })
    } else {
        next()
    }
})

export default router
