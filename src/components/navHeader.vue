<!-- 顶部导航栏 -->
<template>
  <div class="nav-header">
    <div class="nav-left">
      <div class="collapse" @click="toggleMenuStatus">
        <el-icon v-if="commonStore.isCollapse" :size="20"><Fold /></el-icon>
        <el-icon v-else :size="20"><Expand /></el-icon>
      </div>
      <div class="nav-bar">导航栏</div>
    </div>
    <div class="nav-right">
      <el-badge is-dot>
        <el-icon size="20"><Bell /></el-icon>
      </el-badge>
      <el-dropdown @command="logout">
        <span style="color: #39f" class="text-blue-400">
          {{ userStore.user.username }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>邮箱</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCommonStore } from '@/store/useCommonStore';
import { useUserStore } from '@/store/useUserStore';

const commonStore = useCommonStore();
const toggleMenuStatus = () => {
  commonStore.toggleMenuStatus(!commonStore.isCollapse);
};
const userStore = useUserStore();

// 退出
const logout = (type) => {
  console.log(type);
}
</script>
<style lang="scss" scoped>
.nav-header {
  @apply h-full w-full flex justify-between items-center px-[20px];
  > .nav-left {
    @apply flex items-center cursor-pointer;
    > .collapse {
      @apply flex;
    }
    > .nav-bar {
      @apply pl-2;
    }
  }
  > .nav-right {
    @apply flex items-center;
    > .el-badge {
      @apply h-[20px] mr-2 cursor-pointer;
    }
  }
}
</style>
