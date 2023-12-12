import { createRouter, createWebHashHistory } from 'vue-router';

// 导入路由信息
import routes from './routes';

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 路由拦截器
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title;
  next();
});

// 暴露路由实例
export default router;
