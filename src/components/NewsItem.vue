<template>
    <li class="news-item">
        <router-link :to="{ name: 'news-detail', params: { id: item.id } }">
            {{ item.title }}
        </router-link>
        <span class="news-item__date">{{ item.date }}</span>
    </li>
</template>

<script setup lang="ts">
// 单个新闻条目：演示「可复用 UI 组件」的写法
// 通过 defineProps 接收父组件传来的 item 对象
defineProps({
    item: { type: Object, required: true },
})
</script>

<style scoped>
/* scoped 样式：只对当前组件生效，不会污染全局 */
.news-item__date {
    margin-left: 8px;
    color: #999;
}
</style>
