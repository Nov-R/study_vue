<template>
    <li>
        <router-link :to="`/news/${item.id}`">{{ item.title }}</router-link>
        <span style="margin-left: 8px; color: #999;">{{ item.date }}</span>
    </li>
</template>

<script setup lang="ts">
// 单个新闻条目：演示「可复用 UI 组件」的写法
// 通过 defineProps 接收父组件传来的 item 对象
defineProps({
    item: { type: Object, required: true },
})
</script>
