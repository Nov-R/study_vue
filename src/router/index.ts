import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      children: [
        { path: 'home', component: () => import('@/views/Home.vue') },
        { path: 'dashboard', component: () => import('@/views/Dashboard.vue') },
        { path: 'settings', component: () => import('@/views/Settings.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.path !== '/login' && !auth.isLoggedIn) {
    return '/login'
  }

  if (to.path === '/login' && auth.isLoggedIn) {
    return '/home'
  }
})

export default router
