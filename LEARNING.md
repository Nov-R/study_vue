# Vue 3 渐进式实战学习笔记

## 学习路线总览

同一个业务需求（登录 → 主页 → 子页面 → 404），逐步重构，从"能跑"到"企业级"。

| 阶段 | 主题 | 核心概念 |
|------|------|----------|
| 一 | 能跑就行 | router 基础、组件内逻辑 |
| 二 | 分离关注点 | Layout 布局、嵌套路由、目录规范 |
| 三 | 状态管理 + 路由守卫 | pinia、beforeEach、token 鉴权 |
| 四 | 请求层封装 + 类型约束 | api 层、拦截器、TS interface |
| 五 | 组合式函数 + 权限体系 | composables、自定义指令、动态路由 |

---

## 阶段一：能跑就行

### 这一步在解决什么问题

从零到一。先让完整流程跑通，建立对 Vue Router 的直觉。
此阶段**不考虑**架构、复用、状态管理，一切以"最少代码跑通功能"为目标。

### 目录结构

```
src/
  main.ts              ← 入口：挂载 app，注册 router
  App.vue              ← 根组件：只放一个 <router-view>
  router/index.ts      ← 路由表：所有路由平铺在一个文件
  views/
    Login.vue          ← 登录页
    Home.vue           ← 主页（带导航链接）
    Dashboard.vue      ← 仪表盘页
    Settings.vue       ← 设置页
    NotFound.vue       ← 404 页
```

### 核心知识点

#### 1. 路由注册

```ts
// main.ts
import router from '@/router'

const app = createApp(App)
app.use(router)     // ← 必须 use，Vue 才知道路由存在
app.mount('#app')
```

`app.use(router)` 做了两件事：
- 注册全局组件 `<router-view>` 和 `<router-link>`
- 注入路由实例，使 `useRouter()` / `useRoute()` 可用

#### 2. 路由表配置

```ts
// router/index.ts
const router = createRouter({
  history: createWebHistory(),   // HTML5 History 模式（URL 无 #）
  routes: [
    { path: '/', redirect: '/login' },            // 重定向
    { path: '/login', component: Login },          // 静态导入
    { path: '/home', component: Home },
    { path: '/dashboard', component: Dashboard },
    { path: '/settings', component: Settings },
    { path: '/:pathMatch(.*)*', component: NotFound },  // 兜底 404
  ],
})
```

关键点：
- `redirect` — 访问 `/` 自动跳转到 `/login`
- `/:pathMatch(.*)*` — 匹配所有未定义路径，**必须放最后**
- 此阶段用**静态导入**（`import Login from ...`），所有页面代码打包在一起

#### 3. 编程式导航

```ts
// Login.vue
const router = useRouter()

function handleLogin() {
  if (username.value === 'admin' && password.value === '123456') {
    router.push('/home')     // ← 编程式跳转
  } else {
    error.value = '用户名或密码错误'
  }
}
```

两种导航方式对比：
- **声明式**：`<router-link to="/home">` — 渲染为 `<a>` 标签
- **编程式**：`router.push('/home')` — 在 JS 逻辑中控制跳转（登录成功后常用）

#### 4. `<router-view>` 的作用

```vue
<!-- App.vue -->
<template>
  <router-view />   <!-- 当前路由匹配的组件在这里渲染 -->
</template>
```

可以理解为一个**占位符**：URL 变了 → 匹配到不同路由 → 渲染不同组件到这个位置。

### 运行方式

```bash
npm run dev
```
打开浏览器访问显示的地址，用 `admin` / `123456` 登录。

### ⚠️ 此阶段存在的问题

这些问题正是后续阶段要解决的：

| 问题 | 表现 | 哪个阶段解决 |
|------|------|-------------|
| 登录状态没有保存 | 刷新页面 → 状态丢失，需重新登录 | 阶段三 |
| 没有路由守卫 | 直接访问 `/home` 无需登录也能进 | 阶段三 |
| 没有共享布局 | 每个页面都要写自己的导航和"返回"链接 | **阶段二** |
| 路由全部静态导入 | 首屏加载全部页面代码，浪费带宽 | 阶段二 |
| 登录逻辑硬编码 | 用户名密码写死在组件里，没有 API 调用 | 阶段四 |

> **下一步预告（阶段二）**：引入 Layout 组件 + 嵌套路由，让导航栏只写一次，所有子页面共享。

---

## 阶段二：分离关注点

### 这一步在解决什么问题

阶段一的导航逻辑散落在每个页面（`Home.vue` 有 nav，`Dashboard.vue` 有"返回"链接）。
阶段二引入 **Layout 组件 + 嵌套路由**，让导航只写一次，子页面只关心自己的内容。
同时引入**懒加载**，首屏只加载登录页，其他页面按需加载。

### 目录结构

```
src/
  layouts/
    AppLayout.vue        ← 新增：导航栏 + <router-view>，登录后的页面共享此布局
  views/
    Login.vue            ← 不变
    Home.vue             ← 简化：去掉导航链接
    Dashboard.vue        ← 简化：去掉"返回首页"
    Settings.vue         ← 简化：去掉"返回首页"
    NotFound.vue         ← 不变
  router/index.ts        ← 路由改为嵌套结构 + 懒加载
```

### 核心知识点

#### 1. Layout 组件

```vue
<!-- layouts/AppLayout.vue -->
<template>
  <div>
    <nav>
      <router-link to="/home">首页</router-link> |
      <router-link to="/dashboard">仪表盘</router-link> |
      <router-link to="/settings">设置</router-link>
    </nav>
    <router-view />   <!-- 子路由组件渲染在这里 -->
  </div>
</template>
```

`AppLayout` 本身只负责"外壳"：导航栏 + 内容区占位符。
子页面完全不需要知道导航的存在。

#### 2. 嵌套路由

```ts
// router/index.ts
{
  path: '/',
  component: () => import('@/layouts/AppLayout.vue'),  // 父：Layout
  children: [
    { path: 'home',      component: () => import('@/views/Home.vue') },
    { path: 'dashboard', component: () => import('@/views/Dashboard.vue') },
    { path: 'settings',  component: () => import('@/views/Settings.vue') },
  ],
},
```

嵌套路由渲染规则：
- 访问 `/home` → `AppLayout` 渲染在 `App.vue` 的 `<router-view>`
- `Home` 渲染在 `AppLayout` 的 `<router-view>`
- 每层路由对应每层组件里的 `<router-view>`，**缺一层就断一层**

`Login` 和 `NotFound` 保持顶层路由，不受 Layout 包裹（登录页不需要导航栏）。

#### 3. 懒加载

```ts
// 阶段一：静态导入（打包时全部合并到一个 chunk）
import Dashboard from '@/views/Dashboard.vue'

// 阶段二：懒加载（打包时拆分，访问该路由时才加载）
component: () => import('@/views/Dashboard.vue')
```

好处：首屏只加载 `Login`，进入后台后才按需加载各页面，减少首屏体积。

### ⚠️ 此阶段存在的问题

| 问题 | 表现 | 哪个阶段解决 |
|------|------|-------------|
| 登录状态没有保存 | 刷新页面 → 状态丢失 | 阶段三 |
| 没有路由守卫 | 直接访问 `/home` 无需登录 | 阶段三 |
| 登录逻辑硬编码 | 用户名密码写死在组件里 | 阶段四 |

> **下一步预告（阶段三）**：引入 Pinia 保存登录状态，用 `beforeEach` 路由守卫拦截未登录访问。

---

## 阶段三：状态管理 + 路由守卫

### 这一步在解决什么问题

阶段二解决了布局复用，但还有两个致命问题：
1. **刷新丢状态** — 登录成功后刷新页面，啥都没了，因为登录状态只存在内存里
2. **没有守卫** — 直接在地址栏输入 `/home` 就能进，完全不需要登录

阶段三引入 **Pinia**（Vue 官方状态管理库）保存登录状态 + **`beforeEach` 路由守卫**拦截未登录访问。

### 目录结构

```
src/
  stores/
    auth.ts              ← 新增：认证 store（token + localStorage）
  layouts/
    AppLayout.vue        ← 改动：新增退出登录按钮
  views/
    Login.vue            ← 改动：登录逻辑改用 store
  router/index.ts        ← 改动：新增 beforeEach 守卫
  main.ts                ← 改动：注册 Pinia
```

### 核心知识点

#### 1. Pinia 基础

Pinia 是 Vue 3 的官方状态管理库，替代 Vuex。核心概念只有三个：

```
state（数据）+ getters（计算属性）+ actions（方法）
```

注册到 app：

```ts
// main.ts
import { createPinia } from 'pinia'

app.use(createPinia())   // ← 必须在 app.use(router) 之前或同级
app.use(router)
```

#### 2. 定义 Store（组合式风格）

```ts
// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // state — 用 ref
  const token = ref(localStorage.getItem('token') || '')

  // getter — 用 computed
  const isLoggedIn = computed(() => !!token.value)

  // action — 普通函数
  function login(username: string, password: string): boolean {
    if (username === 'admin' && password === '123456') {
      token.value = 'fake-token-123'
      localStorage.setItem('token', token.value)
      return true
    }
    return false
  }

  function logout() {
    token.value = ''
    localStorage.removeItem('token')
  }

  return { token, isLoggedIn, login, logout }
})
```

关键点：
- `defineStore('auth', () => { ... })` — 组合式写法，和 `<script setup>` 风格一致
- `localStorage` 做持久化 — 刷新页面后 token 还在，不会丢失登录状态
- store 里 `ref` = state，`computed` = getter，普通函数 = action

#### 3. 在组件中使用 Store

```ts
// Login.vue
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

function handleLogin() {
  if (auth.login(username.value, password.value)) {
    router.push('/home')        // 登录成功 → 跳转
  } else {
    error.value = '用户名或密码错误'
  }
}
```

登录逻辑从组件移到了 store，组件只负责调用和跳转。

#### 4. 路由守卫 `beforeEach`

```ts
// router/index.ts
import { useAuthStore } from '@/stores/auth'

router.beforeEach((to) => {
  const auth = useAuthStore()

  // 未登录 → 访问非登录页 → 拦截到登录页
  if (to.path !== '/login' && !auth.isLoggedIn) {
    return '/login'
  }

  // 已登录 → 访问登录页 → 跳转到首页
  if (to.path === '/login' && auth.isLoggedIn) {
    return '/home'
  }
})
```

`beforeEach` 在**每次导航前**执行：
- 返回一个路径字符串 = 重定向到该路径
- 不返回（`undefined`）= 放行
- 注意 `useAuthStore()` 必须在回调里调用，不能放外面（因为 Pinia 还没注册完）

#### 5. 退出登录

```vue
<!-- AppLayout.vue -->
<button @click="handleLogout">退出登录</button>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

function handleLogout() {
  auth.logout()          // 清除 token
  router.push('/login')  // 跳回登录页
}
</script>
```

### 验证方式

1. `npm run dev` 启动项目
2. 直接访问 `/home` → 被拦截到 `/login` ✅
3. 用 `admin` / `123456` 登录 → 进入首页 ✅
4. 刷新页面 → 状态保持，不用重新登录 ✅
5. 点击"退出登录" → 跳回登录页 ✅
6. 退出后再访问 `/home` → 被拦截 ✅

### ⚠️ 此阶段存在的问题

| 问题 | 表现 | 哪个阶段解决 |
|------|------|-------------|
| 登录逻辑硬编码 | 用户名密码写死在 store 里，没有 API 调用 | 阶段四 |
| 没有请求拦截器 | token 需要手动塞到每个请求里 | 阶段四 |
| 没有类型约束 | 请求/响应没有 TS 类型定义 | 阶段四 |

> **下一步预告（阶段四）**：封装 axios 请求层，用拦截器自动携带 token，用 TS interface 约束请求和响应。

---

<!-- 后续阶段将追加在此处 -->
