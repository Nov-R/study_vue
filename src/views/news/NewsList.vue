<template>
    <h1>新闻列表</h1>
    <p v-if="loading">加载中...</p>
    <p v-else-if="error" style="color: red">加载失败：{{ error.message ?? error }}</p>
    <ul v-else>
        <NewsItem v-for="item in newsList" :key="item.id" :item="item" />
    </ul>
    <router-view></router-view>
</template>

<script setup lang="ts">
// @ts-nocheck — 阶段性跳过类型检查，框架学透后再补类型
import { onMounted } from 'vue'
import { getNewsListApi } from '@/api/news'
import { useFetch } from '@/composables/useFetch'
import NewsItem from '@/components/NewsItem.vue'

// 把请求逻辑交给 useFetch composable
const { data: newsList, loading, error, execute } = useFetch(getNewsListApi, [])
onMounted(execute)
</script>
