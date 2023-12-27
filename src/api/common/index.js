// 导入axios实例
import service from '@/utils/useRequest';

// 登录接口
export const login = (data) => service.post('/login', data);

// 消息通知
export const noticeCount = () => service.get('/users/leave/notice');