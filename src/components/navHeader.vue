<!-- 顶部导航栏 -->
<template>
  <div class="nav-header">
    <div class="nav-left">
      <div class="collapse" @click="toggleMenuStatus">
        <el-icon v-if="commonStore.isCollapse" :size="20"><Fold /></el-icon>
        <el-icon v-else :size="20"><Expand /></el-icon>
      </div>
      <div class="nav-bar">
        <bread-crumb></bread-crumb>
      </div>
    </div>
    <div class="nav-right">
      <el-badge :is-dot="isNotice">
        <el-icon size="20"><Bell /></el-icon>
      </el-badge>
      <el-dropdown @command="logout">
        <span style="color: #39f" class="text-blue-400">
          {{ userStore.user.username }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>邮箱：{{ userStore.user.email ?? '' }}</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import breadCrumb from './breadCrumb.vue';
import { useCommonStore } from '@/store/useCommonStore';
import { useUserStore } from '@/store/useUserStore';
import { noticeCount } from '@/api/common';
import { useRouter } from 'vue-router';
import { removeItem } from '@/utils/useStorage';

const commonStore = useCommonStore();
const toggleMenuStatus = () => {
  commonStore.toggleMenuStatus(!commonStore.isCollapse);
};
const userStore = useUserStore();
// 是否有信息通知
const isNotice = ref(false);

// 获取消息通知
const getNoticeCount = async () => {
  try {
    const result = await noticeCount();
    isNotice.value = !!result;
  } catch (error) {
    console.error(error);
  }
};

// 退出
const router = useRouter();
const logout = (type) => {
  removeItem('user');
  router.push('/login');
};

// 初始化
onMounted(() => {
  getNoticeCount();
});
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
