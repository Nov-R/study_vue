<template>
    <p v-if="loading">加载中...</p>
    <p v-else-if="error" style="color: red">加载失败</p>
    <div v-else-if="detail" style="margin-top: 16px; padding: 16px; border: 1px solid #ddd; border-radius: 4px;">
        <h2>{{ detail.title }}</h2>
        <p style="color: #999;">{{ detail.date }}</p>
        <p>{{ detail.content }}</p>
    </div>
    <router-link to="/news">返回新闻列表</router-link>
</template>

<script setup lang="ts">
// @ts-nocheck — 阶段性跳过类型检查，框架学透后再补类型
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { getNewsDetailApi } from '@/api/news'
import { useFetch } from '@/composables/useFetch'

const route = useRoute()
const { data: detail, loading, error, execute } = useFetch(getNewsDetailApi)

// 路由参数 id 变化时重新拉数据；首次进入也立刻执行一次
watch(
    () => route.params.id,
    (id) => { if (id) execute(id) },
    { immediate: true },
)
</script>
