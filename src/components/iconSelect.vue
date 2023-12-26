<template>
  <div class="flex items-center">
    <el-icon v-if="modelValue" :size="20" class="mr-2"><component :is="modelValue"></component></el-icon>
    <el-select :modelValue="modelValue" filterable @change="handleChange">
      <el-option v-for="item in icons" :key="item" :label="item" :value="item">
        <span style="float: left">
          <el-icon :size="16">
            <component :is="item"></component>
          </el-icon>
        </span>
        <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">{{ item }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import * as iconList from '@element-plus/icons-vue';
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});
const icons = ref(Object.keys(iconList));
const emit = defineEmits(['update:modelValue']);
const handleChange = (val) => {
  emit('update:modelValue', val);
};
</script>
