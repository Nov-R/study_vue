// @ts-nocheck — 阶段性跳过类型检查，框架学透后再补类型
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || '')
    const isLoggedIn = computed(() => !!token.value)

    async function login(username, password) {
        try {
            const res = await loginApi({ username, password })
            token.value = res.token
            localStorage.setItem('token', token.value)
            return true
        } catch {
            return false
        }
    }

    function logout() {
        token.value = ''
        localStorage.removeItem('token')
    }

    return { token, isLoggedIn, login, logout }
})
