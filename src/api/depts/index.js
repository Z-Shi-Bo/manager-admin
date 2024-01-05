// 导入axios实例
import service from '@/utils/useRequest';
import { objToGetParam } from '@/utils/useTools';

// 获取用户列表
export const getDeptListApi = (data) => {
  const str = objToGetParam(data);
  return service.get(`/depts/list?${str}`);
};

// 删除用户
export const deleteDeptApi = (ids) => service.post(`/depts/delete`, ids);

// 新增用户
export const addDeptApi = (data) => service.post(`/depts/add`, data);

// 修改用户
export const updateDeptApi = (data) => service.post(`/depts/update`, data);