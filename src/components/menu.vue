// 侧边导航栏
<template>
  <div class="menu-container" :style="{ width: commonStore.isCollapse ? '64px' : '200px' }">
    <h1 class="title">
      <span :class="{ hide: commonStore.isCollapse }">Manager-Admin</span>
    </h1>
    <el-menu :default-active="activePath" unique-opened :collapse-transition="false" router :collapse="commonStore.isCollapse">
      <tree-menu :list="menuListData"></tree-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCommonStore } from '@/store/useCommonStore';
import { getMenuListApi } from '@/api/menus';
import treeMenu from '@/components/treeMenu.vue';
const commonStore = useCommonStore();
const menuListData = ref([]);
const activePath = ref(location.hash.slice(1));

// 获取侧边栏
const getMenuList = async () => {
  try {
    const result = await getMenuListApi();
    menuListData.value = result.list;
  } catch (error) {
    console.error(error);
  }
};

// 初始化
onMounted(() => {
  getMenuList();
});
</script>
<style lang="scss" scoped>
.menu-container {
  @apply h-full;
  transition: width 0.5s linear;
  > .title {
    @apply flex items-center justify-center h-[50px] border-b border-r;
    > span {
      white-space: nowrap;
      &.hide {
        opacity: 0;
      }
      transition: opacity 0.3s linear;
    }
  }
  > .el-menu {
    @apply w-full h-[calc(100%-50px)] overflow-y-auto border-none;
  }
}
</style>
