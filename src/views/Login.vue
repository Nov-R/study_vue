<template>
    <form @submit.prevent="handleLogin">
        <input type="text" placeholder="用户名" v-model="username">
        <input type="password" placeholder="密码" v-model="password">
        <p v-if="error" style="color:red">{{ error }}</p>
        <button type="submit">登录</button>
    </form>

</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useAuthStore } from '@/stores/auth'
    import {useRouter} from 'vue-router'

    const router = useRouter()
    const auth = useAuthStore()
    const error = ref('')
    const username = ref('')
    const password = ref('')
    function handleLogin() {
        if(auth.login(username.value, password.value)){
            router.push('/home')
        } else {
            error.value = '用户名或密码错误'
        }
    }
</script>
