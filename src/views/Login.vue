<template>
    <form @submit.prevent="handleLogin">
        <input type="text" placeholder="用户名" v-model="username" :disabled="loading">
        <input type="password" placeholder="密码" v-model="password" :disabled="loading">
        <p v-if="error" style="color:red">{{ error }}</p>
        <button type="submit" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
        </button>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()
const error = ref('')
const username = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
    if (loading.value) return       // 防重复点击
    error.value = ''                 // 清掉上一次的错误信息，避免闪烁
    loading.value = true
    try {
        const success = await auth.login(username.value, password.value)
        if (success) {
            router.push({ name: 'home' })
        } else {
            error.value = '用户名或密码错误'
        }
    } finally {
        loading.value = false
    }
}
</script>
