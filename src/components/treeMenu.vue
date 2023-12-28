<template>
  <template v-for="item in list" :key="item.path">
    <el-sub-menu :index="item.path" v-if="item.children && item.children.length && item.children[0].menuType === 1">
      <template #title>
        <el-icon v-if="item.icon"><component :is="item.icon"></component></el-icon>
        <span>{{ item.menuName }}</span>
      </template>
      <tree-menu :list="item.children"></tree-menu>
    </el-sub-menu>
    <template v-else-if="item.menuType === 1">
      <el-menu-item :index="item.path">
        <el-icon v-if="item.icon"><component :is="item.icon"></component></el-icon>
        <template #title>{{ item.menuName }}</template>
      </el-menu-item>
    </template>
  </template>
</template>
<script setup>
import treeMenu from '@/components/treeMenu.vue';
defineOptions({
  name: 'TreeMenu',
});
defineProps({
  list: {
    type: Array,
    default: [],
  },
});
</script>
