// Vite 插件：将 mock 文件注册为 dev server 中间件
// 请求走真实 HTTP → Vite 拦截 → 返回 mock 数据 → axios 拦截器正常执行
import type { Plugin, Connect } from 'vite'
import { URL } from 'node:url'
import authMocks from './auth'
import newsMocks from './news'

export interface MockRoute {
    url: string
    method: string
    handler: (body: any, query: Record<string, string>, params: Record<string, string>) => any
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

// 将 '/api/news/:id' 转为正则，提取路径参数
function pathToRegex(pattern: string) {
    const paramNames: string[] = []
    const regexStr = pattern.replace(/:(\w+)/g, (_, name) => {
        paramNames.push(name)
        return '([^/]+)'
    })
    return { regex: new RegExp(`^${regexStr}$`), paramNames }
}

function matchRoute(pathname: string, method: string) {
    for (const route of mockRoutes) {
        if (route.method !== method) continue
        const { regex, paramNames } = pathToRegex(route.url)
        const match = pathname.match(regex)
        if (match) {
            const params: Record<string, string> = {}
            paramNames.forEach((name, i) => {
                params[name] = match[i + 1]
            })
            return { route, params }
        }
    }
    return null
}

export function createMockPlugin(): Plugin {
    return {
        name: 'mock-server',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const url = new URL(req.originalUrl ?? '', 'http://localhost')
                const matched = matchRoute(url.pathname, req.method?.toLowerCase() ?? '')
                if (!matched) return next()

                const body = await parseBody(req)
                const query = Object.fromEntries(url.searchParams)
                const result = matched.route.handler(body, query, matched.params)

                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(result))
            })
        },
    }
}
