<template>
    <div v-if="detail" style="margin-top: 16px; padding: 16px; border: 1px solid #ddd; border-radius: 4px;">
        <h2>{{ detail.title }}</h2>
        <p style="color: #999;">{{ detail.date }}</p>
        <p>{{ detail.content }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'

interface NewsDetail {
    id: number
    title: string
    content: string
    date: string
}

const route = useRoute()
const detail = ref<NewsDetail | null>(null)

watch(
    () => route.params.id,
    async (id) => {
        if (!id) return
        const res = await request.get<ApiResponse<NewsDetail>>('/news/detail', { params: { id } })
        detail.value = res.data.data
    },
    { immediate: true }
)
</script>
