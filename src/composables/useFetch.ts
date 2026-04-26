// @ts-nocheck — 阶段性跳过类型检查，框架学透后再补类型
// 通用数据请求组合式函数：把"loading / error / data"三件套抽出来复用
// 用法：
//   const { data, loading, error, execute } = useFetch(getNewsListApi, [])
//   onMounted(execute)
import { ref } from 'vue'

export function useFetch(fetcher, initialData = null) {
    const data = ref(initialData)
    const loading = ref(false)
    const error = ref(null)

    async function execute(...args) {
        loading.value = true
        error.value = null
        try {
            data.value = await fetcher(...args)
        } catch (e) {
            error.value = e
        } finally {
            loading.value = false
        }
    }

    return { data, loading, error, execute }
}
