// 导入axios实例
import service from '@/utils/useRequest';
import { objToGetParam } from '@/utils/useTools';

// 获取用户列表
export const getUserListApi = (data) => {
  const str = objToGetParam(data);
  return service.get(`/users/list?${str}`);
};

// 删除用户
export const deleteUserApi = (ids) => service.post(`/users/delete`, ids);