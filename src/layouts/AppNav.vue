<template>
    <nav>
        <router-link :to="{ name: 'home' }">Home</router-link> |
        <router-link :to="{ name: 'settings' }">Settings</router-link> |
        <router-link :to="{ name: 'dashboard' }">Dashboard</router-link> |
        <router-link :to="{ name: 'news-list' }">News</router-link> |
        <button @click="handleLogout">登出</button>
    </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
    auth.logout()
    router.push({ name: 'login' })
}
</script>
