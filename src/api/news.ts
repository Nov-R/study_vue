import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'

export interface NewsItem {
    id: number
    title: string
    date: string
}

export interface NewsDetailItem {
    id: number
    title: string
    content: string
    date: string
}

export const getNewsListApi = () =>
    request.get<any, ApiResponse<NewsItem[]>>('/news')

export const getNewsDetailApi = (id: string | string[]) =>
    request.get<any, ApiResponse<NewsDetailItem>>(`/news/${id}`)
