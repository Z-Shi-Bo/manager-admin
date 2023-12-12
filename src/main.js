import { createApp } from 'vue';
// 导入element-plus和样式
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// 导入pinia
import { createPinia } from 'pinia';
// 导入路由
import router from './router';
// 导入全局样式
import '@/assets/style/common.scss';
import '@/assets/style/reset.scss';
// 导入windicss样式
import 'virtual:windi.css';
import App from './App.vue';

const pinia = createPinia();
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(ElementPlus);
app.use(pinia);
app.use(router);
app.mount('#app');
