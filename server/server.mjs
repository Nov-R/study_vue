import jsonServer from 'json-server'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// 自定义登录接口（json-server 不原生支持登录验证）
server.post('/auth/login', (req, res) => {
    const { username, password } = req.body || {}
    if (username === 'admin' && password === '12345') {
        res.json({ token: 'fake-token-nov-rain' })
    } else {
        res.status(401).json({message: '用户名或密码错啦～'})
    }
})

server.use(router)

const PORT = 3001
server.listen(PORT, () => {
    console.log(`JSON Server 运行在 http://localhost:${PORT}`)
})
