// 侧边导航栏
<template>
  <div class="menu-container" :style="{ width: commonStore.isCollapse ? '64px' : '200px' }">
    <h1 class="title">
      <span :class="{ hide: commonStore.isCollapse }">Manager-Admin</span>
    </h1>
    <el-menu default-active="1" :collapse-transition="false" :collapse="commonStore.isCollapse">
      <el-sub-menu index="1">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>系统管理</span>
        </template>
        <el-menu-item index="1-1">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
        <el-menu-item index="1-2">
          <el-icon><Menu /></el-icon>
          <template #title>菜单管理</template>
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>审批管理</span>
        </template>
        <el-menu-item index="2-1">
          <el-icon><Setting /></el-icon>
          <template #title>休假申请</template>
        </el-menu-item>
        <el-menu-item index="2-2">
          <el-icon><Setting /></el-icon>
          <template #title>待我审批</template>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCommonStore } from '@/store/useCommonStore';
const commonStore = useCommonStore();
console.log(commonStore.isCollapse);
</script>
<style lang="scss" scoped>
.menu-container {
  @apply h-full;
  transition: width 0.5s linear;
  > .title {
    @apply flex items-center justify-center h-[50px] border-b border-r;
    > span {
      &.hide {
        opacity: 0;
      }
      transition: opacity .3s linear;
    }
  }
  > .el-menu {
    @apply w-full h-[calc(100%-50px)] overflow-y-auto border-none;
  }
}
</style>
