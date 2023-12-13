// 导入axios实例
import service from '@/utils/useRequest';

export const login = (data) => service.post('/users/login', data);