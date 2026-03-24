<template>
    <div>
        <nav>
            <router-link to="/home">首页</router-link> |
            <router-link to="/dashboard">仪表盘</router-link> |
            <router-link to="/settings">设置</router-link> |
            <button @click="handleLogout">退出登录</button>
        </nav>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/stores/auth'

    const router = useRouter()
    const auth = useAuthStore()

    function handleLogout() {
    auth.logout()
    router.push('/login')
    }
</script>

<style scoped>
</style>