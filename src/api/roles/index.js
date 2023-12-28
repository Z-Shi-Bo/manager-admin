// 导入axios实例
import service from '@/utils/useRequest';
import { objToGetParam } from '@/utils/useTools';

// 获取角色列表
export const getRoleListApi = (data) => {
  const str = objToGetParam(data);
  return service.get(`/roles/list?${str}`);
};

// 新增角色
export const addRoleApi = (data) => service.post(`/roles/add`, data);

// 修改角色
export const updateRoleApi = (data) => service.post(`/roles/update`, data);

// 删除角色
export const deleteRoleApi = (ids) => service.post(`/roles/delete`, ids);
