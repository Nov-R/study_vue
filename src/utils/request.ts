import axios from 'axios'

const request = axios.create({
    baseURL: '/api',
    timeout: 5000,
})

// 请求拦截器：自动携带 token
request.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 响应拦截器：直接解包到 data；401 统一清登录态并跳转
request.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        if (error.response?.status === 401) {
            // 动态 import 避免与 store/router 形成循环依赖
            const [{ useAuthStore }, { default: router }] = await Promise.all([
                import('@/stores/auth'),
                import('@/router'),
            ])
            useAuthStore().logout()
            router.push({ name: 'login' })
        }
        return Promise.reject(error)
    },
)

export default request
