import axios from 'axios'

const statusMessageMap = {
    400: '请求参数错误',
    401: '登录已过期，请重新登录',
    403: '没有权限访问',
    404: '请求资源不存在',
    500: '服务器错误，请稍后重试',
    502: '网关错误',
    503: '服务暂不可用',
    504: '网关超时',
}

const request = axios.create({
    baseURL: '/api',
    timeout: 5000,
})

// 请求拦截器：自动携带 token（动态 import 避免与 store 形成循环依赖）
request.interceptors.request.use(async (config) => {
    const { useAuthStore } = await import('@/stores/auth')
    const token = useAuthStore().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 响应拦截器：直接解包到 data；401 统一清登录态并跳转
request.interceptors.response.use(
    response => response.data,
    async error => {
        const fallback = '获取失败，请稍后重试！！'
        let message = fallback
        if (error.response) {
            // 优先后端 message → 状态码映射 → 通用兜底
            message = error.response.data?.message
                ?? statusMessageMap[error.response.status]
                ?? fallback
        } else if (error.code === 'ECONNABORTED') {
            message = '请求超时，请检查网络'
        }
        if (error.response?.status === 401) {
            // 动态 import 避免与 store/router 形成循环依赖
            const [{ useAuthStore }, { default: router }] = await Promise.all([
                import('@/stores/auth'),
                import('@/router'),
            ])
            useAuthStore().logout()
            const redirect = router.currentRoute.value.fullPath
            router.push({
                name: 'login',
                query: redirect && redirect !== '/login' ? { redirect } : undefined,
            })
        }
        // 抛出的是处理过的字符串，不是原始 error 对象       
        return Promise.reject(new Error(message))
    },
)

export default request
