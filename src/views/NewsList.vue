<template>
    <h1>新闻列表</h1>
    <ul>
        <li v-for="item in newsList" :key="item.id">
            <router-link :to="`/news/${item.id}`">{{ item.title }}</router-link>
            <span style="margin-left: 8px; color: #999;">{{ item.date }}</span>
        </li>
    </ul>
    <router-view />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'

interface NewsItem {
    id: number
    title: string
    date: string
}

const newsList = ref<NewsItem[]>([])

onMounted(async () => {
    const res = await request.get<ApiResponse<NewsItem[]>>('/news/list')
    newsList.value = res.data.data
})
</script>
