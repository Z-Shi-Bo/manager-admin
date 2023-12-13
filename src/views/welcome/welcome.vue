<template>
  <div class="welcome">
    <div class="content">
      <h2 class="title">欢迎体验</h2>
      <h1 class="sub-title">慕课通用后台管理系统</h1>
      <small class="description"> - Vue3.0+Element-Plus+Node+Mongo打造通用后台管理系统</small>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
</script>
<style lang="scss" scoped>
.welcome {
  @apply h-full flex justify-around items-center;
  background: url('@/assets/images/bg.jpg') no-repeat center center/100% 100%;
  >.content {
    > .title {
      @apply text-yellow-400 text-3xl font-bold;
    }
    > .sub-title {
      @apply text-yellow-400 text-5xl py-4;
    }
    > .description {
      @apply text-yellow-400 text-xs float-right;
    }
  }
}
</style>