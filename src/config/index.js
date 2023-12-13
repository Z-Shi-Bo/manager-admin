/**
 * 环境变量配置
 */

const env = import.meta.env.MODE || 'prod';
const EnvConfig = {
  dev: {
    baseURL: '/api',
    mockURL: 'https://www.fastmock.site/mock/d346d656c55059079713e7d5dd8787b4/api',
  },
  test: {
    baseURL: 'http://127.0.0.1:3000',
    mockURL: 'https://www.fastmock.site/mock/d346d656c55059079713e7d5dd8787b4/api',
  },
  prod: {
    baseURL: 'http://127.0.0.1:3000',
    mockURL: 'https://www.fastmock.site/mock/d346d656c55059079713e7d5dd8787b4/api',
  },
};

export default {
  env,
  namespace: 'manager-admin',
  mock: false,
  ...EnvConfig[env],
};
