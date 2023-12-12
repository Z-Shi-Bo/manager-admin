<template>
  <el-result sub-title="Sorry, page not found">
    <template #icon>
      <el-image src="https://img0.baidu.com/it/u=4283958596,3918347156&fm=253&fmt=auto&app=138&f=JPEG?w=1026&h=500" />
    </template>
    <template #extra>
      <router-link to="/"><el-button type="primary">返回首页</el-button></router-link>
    </template>
  </el-result>
</template>

<script setup>
import { ref } from 'vue';
defineOptions({
  name: '404',
});
</script>
