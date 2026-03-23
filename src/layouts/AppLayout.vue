<template>
  <div>
    <nav>
      <router-link to="/home">首页</router-link> |
      <router-link to="/dashboard">仪表盘</router-link> |
      <router-link to="/settings">设置</router-link>
    </nav>
    <router-view />
  </div>
</template>
