<template>
  <div class="menu common-card">
    <div class="query-form">
      <el-form :model="searchForm" label-width="80px" inline>
        <el-form-item label="菜单名称">
          <el-input v-model="searchForm.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态">
          <el-select v-model="searchForm.menuState" placeholder="请选择菜单状态">
            <el-option label="正常" :value="1"> </el-option>
            <el-option label="禁用" :value="2"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">查询</el-button>
          <el-button @click="resetSearchForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd('add', '创建菜单')">创建</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" row-key="_id" height="100%">
          <el-table-column v-for="(col, index) in tableHeader" :key="index" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width" align="center"> </el-table-column>
          <el-table-column label="操作" width="240" align="center">
            <template #default="{ row }">
              <div>
                <el-button type="primary" size="small" @click="handleEdit('edit', '编辑菜单', row, 'menu')">编辑</el-button>
                <el-popconfirm width="220" confirm-button-text="确定" cancel-button-text="取消" icon="InfoFilled" title="确定删除么？" @confirm="handleDelete(row)">
                  <template #reference>
                    <el-button type="danger" size="small">删除</el-button>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="40%">
      <el-form :model="dialogForm" ref="dialogFormRef" :rules="dialogRules" label-width="100px">
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader v-model="dialogForm.parentId" :options="tableData" :props="{ checkStrictly: true, label: 'menuName', value: '_id' }" class="w-full" /><small style="color: #999"
            >不选，直接创建一级菜单</small
          >
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="dialogForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="dialogForm.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" v-show="dialogForm.menuType === 1">
          <icon-select v-model="dialogForm.icon" />
        </el-form-item>
        <el-form-item label="路由地址" v-show="dialogForm.menuType === 1">
          <el-input v-model="dialogForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="组件路径" v-show="dialogForm.menuType === 1">
          <el-input v-model="dialogForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode" v-show="dialogForm.menuType === 2">
          <el-input v-model="dialogForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="菜单状态" v-show="dialogForm.menuType === 1">
          <el-radio-group v-model="dialogForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMenuListApi, deleteMenuApi, addMenuApi, updateMenuApi } from '@/api/menus';
import { parseDate, useMessage } from '@/utils/useTools';
import { useGetTableData } from '@/utils/useTableAndFormLogic';
import iconSelect from '@/components/iconSelect.vue';
defineOptions({
  name: 'Menu',
});

const tableHeader = ref([
  { prop: 'menuName', label: '菜单名称', width: '' },
  { prop: 'icon', label: '图标', width: '' },
  {
    prop: 'menuType',
    label: '菜单类型',
    width: '',
    formatter: (row, column, value) => {
      return value - 0 === 1 ? '菜单' : '按钮';
    },
  },
  { prop: 'menuCode', label: '权限标识', width: '' },
  { prop: 'path', label: '路由地址', width: '' },
  { prop: 'component', label: '组件路径', width: '' },
  {
    prop: 'menuState',
    label: '菜单状态',
    width: '',
    formatter: (row, column, value) => {
      return value - 0 === 1 ? '正常' : '禁用';
    },
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: '180',
    formatter: (row, column, value) => {
      return parseDate(new Date(value));
    },
  },
]);
const { searchForm, dialogForm, tableData, dialogVisible, dialogFormRef, dialogRules, dialogTitle, resetSearchForm, handleCancel, handleAdd, handleEdit, handleSubmit, getData } = useGetTableData({
  searchForm: {
    menuName: '',
    menuState: 1,
  },
  dialogForm: {
    menuType: 1, //菜单类型 1:菜单 2:按钮
    menuName: '', //菜单名称
    menuCode: '', //菜单标识符，只有按钮类型才有，用于确定按钮权限
    path: '', //菜单路由
    icon: '', //菜单图标
    component: '', //组件地址
    parentId: [null], //父菜单ID
    menuState: 1, //菜单状态 1:正常 2:禁用
    _id: null, // 菜单Id
  },
  getList: getMenuListApi,
  onAddApi: addMenuApi,
  onUpdateApi: updateMenuApi,
});
// 删除操作
const handleDelete = async (row) => {
  try {
    await deleteMenuApi({ _id: row._id });
    useMessage('删除成功');
    getData();
  } catch (error) {
    useMessage(error.message, 'error');
  }
};
onMounted(() => {
  getData();
});
</script>
<style lang="scss" scoped>
.menu {
  > .base-table {
    > .table-box {
      height: calc(100% - 80px);
      padding: 0 20px;
    }
  }
}
</style>
