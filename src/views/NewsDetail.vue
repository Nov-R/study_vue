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
import { getNewsDetailApi, type NewsDetailItem } from '@/api/news'

const route = useRoute()
const detail = ref<NewsDetailItem | null>(null)

watch(
    () => route.params.id,
    async (id) => {
        if (!id) return
        const { data } = await getNewsDetailApi(id)
        detail.value = data
    },
    { immediate: true }
)
</script>
