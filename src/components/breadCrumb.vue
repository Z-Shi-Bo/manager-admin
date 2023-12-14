<!-- 面包屑组件 -->
<template>
  <div class="breadCrumb">
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item v-for="(item, index) in breadCrumbList">
        <router-link to="/welcome" v-if="index === 0">{{ item.meta.title }}</router-link>
        <span v-else>{{ item.meta.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
defineOptions({
  name: 'BreadCrumb',
});

const route = useRoute();
const breadCrumbList =  computed(() => route.matched);
</script>
