<template>
    <h1>新闻列表</h1>
    <ul>
        <li v-for="item in newsList" :key="item.id">
            <router-link :to="`/news/${item.id}`">{{ item.title }}</router-link>
            <span style="margin-left: 8px; color: #999;">{{ item.date }}</span>
        </li>
    </ul>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getNewsListApi, type NewsItem } from '@/api/news'

const newsList = ref<NewsItem[]>([])

onMounted(async () => {
    const { data } = await getNewsListApi()
    newsList.value = data
})
</script>
