<template>
    <nav>
        <router-link to="/home">Home</router-link> |
        <router-link to="/settings">Settings</router-link> |
        <router-link to="/dashboard">Dashboard</router-link> |
        <button @click="handleLogout">登出</button>
    </nav>
</template>

<script setup lang="ts">
import {useAuthStore} from '@/stores/auth'
import {useRouter} from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
    auth.logout()
    router.push('/login')
}
</script>
