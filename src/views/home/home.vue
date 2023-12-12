<template>
  <div class="basic-layout">
    <div class="nav-side"></div>
    <div class="content-right">
      <div class="nav-top">
        <div class="bread"></div>
        <div class="user"></div>
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
defineOptions({
  name: 'home',
});
</script>
<style lang="scss" scoped>
.basic-layout {
  position: relative;
  > .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    overflow-y: auto;
    background-color: #001529;
  }
  > .content-right {
    margin-left: 200px;
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
      > .main-page {
        height: 100%;
        background-color: #fff;
      }
    }
  }
}
</style>
