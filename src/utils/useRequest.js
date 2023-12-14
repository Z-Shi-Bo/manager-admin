/**
 * axios实例和配置
 */
import axios from 'axios';
import { ElMessage } from 'element-plus';
import config from '@/config';
import router from '@/router';
import { getItem } from './useStorage';

// 错误的提示信息
const ERRMESSAGE = {
  400: '请求错误',
  401: '未授权，请登录',
  403: '拒绝访问',
  404: '请求地址出错',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持',
  default: '未知错误',
};

// 创建服务实例
const service = axios.create({
  baseURL: config.mock ? config.mockURL : config.baseURL,
  timeout: 10000,
});

// 确定生产一定不会出错
if (config.env === 'prod') {
  service.defaults.baseURL = config.baseURL;
}

// 请求拦截器
service.interceptors.request.use(
  (req) => {
    const { token } = getItem('user');
    if (token && !req.headers.Authorization) req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    const { code, data, msg } = res.data;
    if (code === 200) {
      return data;
    } else if (code === 401) {
      ElMessage.error(ERRMESSAGE[code]);
      setTimeout(() => {
        router.push('/login');
      }, 1000);
      return Promise.reject(ERRMESSAGE[code]);
    } else {
      ElMessage.error(msg || ERRMESSAGE[code]);
      return Promise.reject(msg || ERRMESSAGE[code]);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default service;
