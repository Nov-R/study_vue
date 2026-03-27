// 模拟后端新闻相关接口
const newsList = [
    {
        id: 1,
        title: 'Vue 3.5 正式发布，性能大幅提升',
        content: 'Vue 3.5 带来了响应式系统的重大优化，内存占用降低 56%，大型响应式数组的操作速度提升 10 倍。同时新增了 useTemplateRef、Deferred Teleport 等实用功能。',
        date: '2026-03-20',
    },
    {
        id: 2,
        title: 'Vite 7 发布：更快的冷启动与 HMR',
        content: 'Vite 7 引入了全新的模块图实现，冷启动速度提升 30%。HMR 热更新在大型项目中几乎无感，开发体验再次升级。',
        date: '2026-03-18',
    },
    {
        id: 3,
        title: 'Pinia 3.0：下一代 Vue 状态管理',
        content: 'Pinia 3.0 带来了更好的 TypeScript 推断、插件系统增强以及开箱即用的持久化支持，成为 Vue 生态中状态管理的首选方案。',
        date: '2026-03-15',
    },
]

export default [
    {
        url: '/api/news/list',
        method: 'get',
        handler() {
            return { code: 0, message: 'ok', data: newsList }
        },
    },
    {
        url: '/api/news/detail',
        method: 'get',
        handler(_body: any, query?: Record<string, string>) {
            const item = newsList.find((n) => n.id === Number(query?.id))
            if (item) {
                return { code: 0, message: 'ok', data: item }
            }
            return { code: 1, message: '新闻不存在', data: null }
        },
    },
]
