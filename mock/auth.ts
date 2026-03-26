// 模拟后端 auth 相关接口
export default [
    {
        url: '/api/auth/login',
        method: 'post',
        handler(body: { username: string; password: string }) {
            if (body.username === 'admin' && body.password === '12345') {
                return { code: 0, message: 'ok', data: { token: 'fake-token-nov-rain' } }
            }
            return { code: 1, message: '用户名或密码错误', data: null }
        },
    },
]
