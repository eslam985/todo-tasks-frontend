<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useTasksStore } from '../../stores/tasksStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const tasksStore = useTasksStore()

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
    authStore.successMessage = ''
    authStore.isLoading = true

    const isSuccess = await authStore.loginUser({
        email: email.value,
        password: password.value,
    })

    authStore.isLoading = false

    if (isSuccess) {
        authStore.successMessage = 'Login successful'
        tasksStore.triggerNotification(authStore.successMessage)
        router.push('/tasks')
    } else {
        console.log('فشل تسجيل الدخول:', authStore.errorMessage)
        tasksStore.triggerNotification(authStore.errorMessage)
    }
}
</script>

<template>
    <div
        class="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 select-none relative"
    >
        <div
            class="w-full max-w-md bg-card rounded-2xl border border-custom-border shadow-xl p-8 space-y-6"
        >
            <div class="text-center space-y-2">
                <div
                    class="inline-flex w-12 h-12 bg-accent rounded-2xl items-center justify-center text-white font-black text-lg shadow-lg shadow-accent/20 mb-2"
                >
                    D
                </div>
                <h2 class="text-2xl font-bold text-title tracking-tight">Welcome Back</h2>
                <p class="text-sub text-sm">Please enter your details to sign in / سجل دخولك</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="flex flex-col gap-1.5">
                    <label for="username" class="form-label">Username / اسم المستخدم</label>
                    <div class="relative">
                        <font-awesome-icon
                            icon="fa-solid fa-user"
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-sub/50 text-sm"
                        />
                        <input
                            id="username"
                            type="text"
                            placeholder="e.g. Bret"
                            v-model="email"
                            :class="[
                                !isSuccess && authStore.errorMessage
                                    ? 'border-red-500 focus:ring-red-100'
                                    : '',
                                'form-input pl-11!',
                            ]"
                        />
                    </div>
                </div>

                <div class="flex flex-col gap-1.5">
                    <div class="flex justify-between items-center">
                        <label for="password" class="form-label mb-0">Password / كلمة المرور</label>
                        <a
                            href="#"
                            class="text-xs font-semibold text-accent hover:text-accent-dark transition-colors"
                            >Forgot password?</a
                        >
                    </div>
                    <div class="relative">
                        <font-awesome-icon
                            icon="fa-solid fa-lock"
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-sub/50 text-sm"
                        />
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            v-model="password"
                            :class="[
                                !isSuccess && authStore.errorMessage
                                    ? 'border-red-500 focus:ring-red-100'
                                    : '',
                                'form-input pl-11',
                            ]"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    class="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                    :disabled="authStore.isLoading"
                >
                    <font-awesome-icon
                        v-if="authStore.isLoading"
                        icon="fa-solid fa-spinner"
                        class="animate-spin text-sm"
                    />
                    <span>{{ authStore.isLoading ? 'Signing in...' : 'Sign In' }}</span>
                </button>
                <router-link to="/register" class="form-label">
                    Don't have an account? <span class="text-accent ml-1.5">register</span> Now
                </router-link>
            </form>
        </div>
    </div>
</template>
