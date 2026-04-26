import request from '@/utils/request'

export const getNewsListApi = () =>
    request.get('/news')

export const getNewsDetailApi = (id) =>
    request.get(`/news/${id}`)
