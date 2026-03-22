<template>
  <div class="login">
    <h1>登录</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label>用户名</label>
        <input v-model="username" placeholder="请输入用户名" />
      </div>
      <div>
        <label>密码</label>
        <input v-model="password" type="password" placeholder="请输入密码" />
      </div>
      <p v-if="error" style="color: red">{{ error }}</p>
      <button type="submit">登录</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
  if (username.value === 'admin' && password.value === '123456') {
    router.push('/home')
  } else {
    error.value = '用户名或密码错误'
  }
}
</script>

<style scoped>
.login {
  max-width: 320px;
  margin: 100px auto;
}
.login div {
  margin-bottom: 12px;
}
.login label {
  display: block;
  margin-bottom: 4px;
}
.login input {
  width: 100%;
  padding: 6px 8px;
  box-sizing: border-box;
}
.login button {
  width: 100%;
  padding: 8px;
  cursor: pointer;
}
</style>
