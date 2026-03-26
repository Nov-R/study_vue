import axios from 'axios'
import type { ApiResponse } from '@/types/api'

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

// 响应拦截器：解包数据 + 错误处理
request.interceptors.response.use(
    (response) => {
        const res = response.data as ApiResponse
        if (res.code !== 0) {
            return Promise.reject(res)
        }
        return res as any
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default request
