import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
    // 公开路由：无需登录，不挂主布局
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/Login.vue'),
        meta: { public: true },
    },

    // 受保护路由：需登录，统一挂 AppLayout 主布局
    {
        path: '/',
        component: () => import('@/layouts/AppLayout.vue'),
        meta: { requiresAuth: true },
        // 访问 / 时直接跳到 home，不再有"先跳 login 再被救回"的二次重定向
        redirect: { name: 'home' },
        children: [
            {
                path: 'home',
                name: 'home',
                component: () => import('@/views/home/Home.vue'),
            },
            {
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('@/views/dashboard/Dashboard.vue'),
            },
            {
                path: 'settings',
                name: 'settings',
                component: () => import('@/views/settings/Settings.vue'),
            },
            {
                path: 'news',
                name: 'news-list',
                component: () => import('@/views/news/NewsList.vue'),
                children:[
                    {   
                        path:':id',
                        name:'news-detail',
                        component: ()=>import('@/views/news/NewsDetail.vue'),
                        // props: true 把路由参数 :id 作为 prop 传给组件，
                        // 组件不再依赖 useRoute()，更易复用与测试
                        props: true,
                    },
                ],
                
            },
            
        ],
    },

    // 404 兜底：放最后，匹配所有未命中的路径
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/error/NotFound.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// 全局前置守卫：基于 meta 判断认证，而不是硬编码路径
router.beforeEach((to) => {
    const auth = useAuthStore()

    // 已登录用户访问登录页 → 直接去首页
    if (to.name === 'login' && auth.isLoggedIn) {
        return { name: 'home' }
    }

    // 未登录访问需要认证的路由 → 去登录页
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
        return { name: 'login' }
    }
})

export default router
