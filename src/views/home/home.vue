<template>
  <div class="basic-layout">
    <div class="nav-side">
      <menu-side></menu-side>
    </div>
    <div class="content-right">
      <div class="nav-top">
        <nav-header></nav-header>
      </div>
      <div class="wrapper">
        <div class="main-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import menuSide from '@/components/menu.vue';
import navHeader from '@/components/navHeader.vue';
defineOptions({
  name: 'home',
});
</script>
<style lang="scss" scoped>
.basic-layout {
  display: flex;
  > .nav-side {
    height: 100vh;
  }
  > .content-right {
    flex: 1;
    > .nav-top {
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ddd;
    }
    > .wrapper {
      height: calc(100vh - 50px);
      padding: 20px;
      overflow-y: auto;
      background-color: $bgColor;
      > .main-page {
        height: 100%;
      }
    }
  }
}
</style>
