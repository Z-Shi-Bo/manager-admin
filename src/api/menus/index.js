// 导入axios实例
import service from '@/utils/useRequest';
import { objToGetParam } from '@/utils/useTools';

// 获取菜单列表
export const getMenuListApi = (data) => {
  const str = objToGetParam(data);
  return service.get(`/menus/list?${str}`);
};

// 新增菜单
export const addMenuApi = (data) => service.post(`/menus/add`, data);

// 修改菜单
export const updateMenuApi = (data) => service.post(`/menus/update`, data);

// 删除菜单
export const deleteMenuApi = (ids) => service.post(`/menus/delete`, ids);
