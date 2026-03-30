import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: () => import('@/views/Login.vue')
        },
        {
            path: '/',
            component: () => import('@/layouts/AppLayout.vue'),
            children: [
                {
                    path: 'home',
                    component: () => import('@/views/Home.vue')
                },
                {
                    path: 'settings',
                    component: () => import('@/views/Settings.vue')
                },
                {
                    path: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: 'news',
                    component: () => import('@/views/NewsList.vue'),
                },
                {
                    path: 'news/:id',
                    component: () => import('@/views/NewsDetail.vue'),
                },
            ]

        },
        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/views/NotFound.vue')
        }
    ]
})
router.beforeEach((to) => {
    const auth = useAuthStore()
    if (!auth.isLoggedIn && to.path !== '/login') return '/login'
    if (auth.isLoggedIn && to.path === '/login') return '/home'
})


export default router