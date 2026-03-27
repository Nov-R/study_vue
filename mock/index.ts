// Vite 插件：将 mock 文件注册为 dev server 中间件
// 请求走真实 HTTP → Vite 拦截 → 返回 mock 数据 → axios 拦截器正常执行
import type { Plugin, Connect } from 'vite'
import { URL } from 'node:url'
import authMocks from './auth'
import newsMocks from './news'

interface MockRoute {
    url: string
    method: string
    handler: (body: any, query?: Record<string, string>) => any
}

const mockRoutes: MockRoute[] = [...authMocks, ...newsMocks]

function parseBody(req: Connect.IncomingMessage): Promise<any> {
    return new Promise((resolve) => {
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', () => {
            try {
                resolve(JSON.parse(body))
            } catch {
                resolve({})
            }
        })
    })
}

function parseQuery(req: Connect.IncomingMessage): Record<string, string> {
    const url = new URL(req.originalUrl ?? '', 'http://localhost')
    return Object.fromEntries(url.searchParams)
}

export function createMockPlugin(): Plugin {
    return {
        name: 'mock-server',
        configureServer(server) {
            for (const route of mockRoutes) {
                server.middlewares.use(route.url, async (req, res, next) => {
                    if (req.method?.toLowerCase() !== route.method) {
                        return next()
                    }
                    const body = await parseBody(req)
                    const query = parseQuery(req)
                    const result = route.handler(body, query)

                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify(result))
                })
            }
        },
    }
}
