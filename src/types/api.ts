// 通用 API 响应结构
export interface ApiResponse<T = unknown> {
    code: number
    message: string
    data: T
}

// 登录请求参数
export interface LoginRequest {
    username: string
    password: string
}

// 登录响应数据
export interface LoginResponse {
    token: string
}
