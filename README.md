# study_vue

Vue 3 学习范本：从零搭建一个完整的前后端分离 SPA，覆盖路由、状态管理、API 请求、组合式函数、布局、权限拦截等真实项目核心要素。

详细的渐进式学习笔记见 [`LEARNING.md`](./LEARNING.md)。

## 技术栈

- **Vue 3.5** + Composition API + `<script setup>`
- **Vue Router 4** — 命名路由 + meta 守卫 + props 解耦
- **Pinia 3** — Composition API 风格的状态管理
- **Axios** — 请求拦截 + 响应拦截 + 401 统一处理
- **Vite 7** — 开发服务器 + 构建 + `/api` 代理
- **json-server** — 模拟后端，提供 RESTful 接口
- **TypeScript** — 阶段性使用 `// @ts-nocheck` 跳过类型检查，待框架学透后再渐进式补类型

## 快速开始

### 1. 安装依赖

```sh
npm install
```

### 2. 启动开发环境

```sh
npm run dev
```

会**同时启动两个服务**：

| 服务 | 端口 | 说明 |
|---|---|---|
| Vite dev server | http://localhost:5173 | 前端 SPA |
| json-server | http://localhost:3001 | 模拟后端 API |

前端通过 Vite 的 `server.proxy` 把 `/api/*` 转发到 json-server，无跨域问题。

### 3. 测试账号

```
用户名: admin
密码:   12345
```

其它账号会返回 HTTP 401，演示完整的鉴权失败流程。

### 4. 构建生产包

```sh
npm run build
```

会先跑 `vue-tsc` 类型检查，再用 Vite 打包到 `dist/` 目录。

## 项目结构

```
study_vue/
├── public/                 静态资源（不经构建处理，直接复制到 dist/）
│   └── favicon.ico
│
├── server/                 模拟后端（json-server）
│   ├── db.json             模拟数据
│   └── server.mjs          启动脚本 + 自定义 /auth/login 中间件
│
├── src/
│   ├── api/                接口封装层（axios 调用 + URL 集中）
│   │   ├── auth.ts
│   │   └── news.ts
│   ├── components/         可复用 UI 组件（无路由、可被任意 view 组合）
│   │   └── NewsItem.vue
│   ├── composables/        组合式函数（Vue 3 核心代码复用方式）
│   │   └── useFetch.ts     通用「loading / error / data」三件套
│   ├── layouts/            布局组件（包含主导航的外壳）
│   │   ├── AppLayout.vue
│   │   └── AppNav.vue
│   ├── router/             路由配置
│   │   └── index.ts        命名路由 + meta 守卫
│   ├── stores/             Pinia 状态
│   │   └── auth.ts         认证状态 + token 自动持久化
│   ├── utils/              工具
│   │   └── request.ts      axios 实例 + 拦截器
│   ├── views/              页面级组件（被路由直接渲染）
│   │   ├── Dashboard.vue
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── NewsDetail.vue
│   │   ├── NewsList.vue
│   │   ├── NotFound.vue
│   │   └── Settings.vue
│   ├── App.vue             根组件
│   └── main.ts             入口（注册 pinia、router）
│
├── env.d.ts                Vite + Vue 模块声明
├── index.html              HTML 入口
├── tsconfig.*.json         TypeScript 配置（分 app / node 两份）
├── vite.config.ts          Vite 配置（含 /api 代理）
└── package.json
```

## 关键架构决策

### 1. 请求层设计：标准 REST 风格

axios 响应拦截器直接返回 `response.data`，不做 `{ code, message, data }` 二次包装。前端调用：

```ts
const list = await getNewsListApi()       // list 直接是数组
```

接口失败用 HTTP 状态码（如 401），不靠业务 code。

### 2. 路由：命名路由 + meta 驱动

- 所有路由都有 `name`，`router.push` 和 `<router-link>` 都用 `{ name: 'xxx' }`
- 受保护的路由统一打 `meta: { requiresAuth: true }`，守卫只判 meta，不判路径
- `news/:id` 用 `props: true`，组件用 prop 接收 id，与 `useRoute()` 解耦

### 3. 401 统一拦截

axios 响应拦截器在 401 时：清 token + `router.push({ name: 'login' })`，**不用 `window.location.href` 硬刷新**。

### 4. 循环依赖处理

`request.ts` 需要 `router` 和 `useAuthStore`，但它们的依赖链会反过来指回 `request.ts`，所以用动态 `import()` 在拦截器内部按需加载。

### 5. token 自动持久化

`stores/auth.ts` 用 `watch` 监听 `token`，自动同步到 localStorage——`login`/`logout` 里只管修改 ref，不用每次手动 setItem/removeItem。

## 学习路线

按 [`LEARNING.md`](./LEARNING.md) 里的五个阶段循序渐进：

1. **能跑就行** — Vue Router 基础、组件内逻辑
2. **分离关注点** — Layout 布局、嵌套路由
3. **状态管理 + 权限** — Pinia、beforeEach、token 鉴权
4. **请求层封装** — api 层、axios 拦截器、TypeScript 渐进式接入
5. **组合式函数 + 进阶** — composables、动态路由、自定义指令

## 开发注意

- 项目里几个文件顶部有 `// @ts-nocheck` 注释，说明"阶段性跳过类型检查"。等学透框架结构后再删掉、按 composable 的签名补上泛型，体验"渐进式 TypeScript 接入"。
- `tsconfig.app.json` 和 `tsconfig.node.json` 都设置了 `noImplicitAny: false`，原因同上。
- 推荐 IDE：VS Code + [Vue (Official) 插件](https://marketplace.visualstudio.com/items?itemName=Vue.volar)。
