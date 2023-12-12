export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页',
    },
    redirect: '/welcome',
    component: () => import('@/views/home/home.vue'),
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        meta: {
          title: '欢迎页',
        },
        component: () => import('@/views/welcome/welcome.vue'),
      },
    ],
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录',
    },
    component: () => import('@/views/login/login.vue'),
  },
  // 匹配404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'Not Found',
    meta: {
      title: '404',
    },
    component: () => import('@/views/error/404.vue'),
  },
];
