import request from '@/utils/request'
import type { ApiResponse, LoginRequest, LoginResponse } from '@/types/api'

export const loginApi = (data: LoginRequest) =>
    request.post<any, ApiResponse<LoginResponse>>('/auth/login', data)
