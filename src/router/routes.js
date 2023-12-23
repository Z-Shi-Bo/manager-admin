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
        name: 'Welcome',
        path: '/welcome',
        meta: {
          title: '欢迎页',
        },
        component: () => import('@/views/welcome/welcome.vue'),
      },
      {
        name: 'User',
        path: '/system/user',
        meta: {
          title: '用户管理',
        },
        component: () => import('@/views/system/user.vue'),
      },
      {
        name: 'Menu',
        path: '/system/menu',
        meta: {
          title: '菜单管理',
        },
        component: () => import('@/views/system/menu.vue'),
      },
      {
        name: 'Role',
        path: '/system/role',
        meta: {
          title: '角色管理',
        },
        component: () => import('@/views/system/role.vue'),
      },
      {
        name: 'Dept',
        path: '/system/dept',
        meta: {
          title: '部门管理',
        },
        component: () => import('@/views/system/dept.vue'),
      },
      {
        name: 'Leave',
        path: '/audit/leave',
        meta: {
          title: '休假申请',
        },
        component: () => import('@/views/audit/leave.vue'),
      },
      {
        name: 'Approve',
        path: '/audit/approve',
        meta: {
          title: '待我审批',
        },
        component: () => import('@/views/audit/approve.vue'),
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
