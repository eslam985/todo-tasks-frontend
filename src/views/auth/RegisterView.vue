<script setup>
import { ref } from 'vue'
import { register } from '../../api/auth'

const username = ref('')
const email = ref('')
const password = ref('')

const message = ref('')
const error = ref('')
const loading = ref(false)

const handleSubmit = async () => {
    message.value = ''
    error.value = ''
    loading.value = true

    try {
        const data = await register({
            username: username.value,
            email: email.value,
            password: password.value,
        })

        message.value = data.success
    } catch (err) {
        error.value = err.response?.data?.message || 'Something went wrong'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <main>
        <h1>Register</h1>

        <form @submit.prevent="handleSubmit">
            <div>
                <label for="username">Username</label>

                <input id="username" v-model="username" type="text" />
            </div>

            <div>
                <label for="email">Email</label>

                <input id="email" v-model="email" type="email" />
            </div>

            <div>
                <label for="password">Password</label>

                <input id="password" v-model="password" type="password" />
            </div>

            <button type="submit" :disabled="loading">
                {{ loading ? 'Registering...' : 'Register' }}
            </button>
        </form>

        <p v-if="message">
            {{ message }}
        </p>

        <p v-if="error">
            {{ error }}
        </p>
    </main>
</template>
