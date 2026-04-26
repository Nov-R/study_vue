// @ts-nocheck — 阶段性跳过类型检查，框架学透后再补类型
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { loginApi } from '@/api/auth'

const TOKEN_KEY = 'token'

export const useAuthStore = defineStore('auth', () => {
    // 初始化时从 localStorage 恢复
    const token = ref(localStorage.getItem(TOKEN_KEY) || '')
    const isLoggedIn = computed(() => !!token.value)

    // 自动持久化：token 变化时同步到 localStorage
    // 好处是 login/logout 里只管修改 token.value，不用每次手动 setItem/removeItem
    watch(token, (val) => {
        if (val) localStorage.setItem(TOKEN_KEY, val)
        else localStorage.removeItem(TOKEN_KEY)
    })

    async function login(username, password) {
        try {
            const res = await loginApi({ username, password })
            token.value = res.token
            return true
        } catch {
            return false
        }
    }

    function logout() {
        token.value = ''
    }

    return { token, isLoggedIn, login, logout }
})
