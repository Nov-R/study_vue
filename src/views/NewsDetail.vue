<template>
    <p v-if="loading">加载中...</p>
    <p v-else-if="error" style="color: red">加载失败：{{ error.message ?? error }}</p>
    <div v-else-if="detail" style="margin-top: 16px; padding: 16px; border: 1px solid #ddd; border-radius: 4px;">
        <h2>{{ detail.title }}</h2>
        <p style="color: #999;">{{ detail.date }}</p>
        <p>{{ detail.content }}</p>
    </div>
    <router-link :to="{ name: 'news-list' }">返回新闻列表</router-link>
</template>

<script setup lang="ts">
// @ts-nocheck — 阶段性跳过类型检查，框架学透后再补类型
import { watch } from 'vue'
import { getNewsDetailApi } from '@/api/news'
import { useFetch } from '@/composables/useFetch'

// 通过 props 接收路由参数（路由配置了 props: true）
// 组件不再依赖 useRoute()，可以独立测试
const props = defineProps({ id: { type: String, required: true } })

const { data: detail, loading, error, execute } = useFetch(getNewsDetailApi)

// id 变化时重新拉数据；首次进入也立刻执行一次
watch(
    () => props.id,
    (id) => { if (id) execute(id) },
    { immediate: true },
)
</script>
