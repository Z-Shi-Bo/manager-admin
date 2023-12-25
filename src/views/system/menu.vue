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
        <el-table :data="menuList" row-key="_id" height="100%">
          <el-table-column v-for="(col, index) in tableHeader" :key="index" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width" align="center"> </el-table-column>
          <el-table-column label="操作" width="240" align="center">
            <template #default="{ row }">
              <div>
                <el-button size="small">新增</el-button>
                <el-button type="primary" size="small" @click="handleEdit('edit', '编辑菜单', row)">编辑</el-button>
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
          <el-cascader v-model="dialogForm.parentId" :options="menuList" :props="{ checkStrictly: true }" class="w-full" /><small style="color: #999">不选，直接创建一级菜单</small>
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
        <el-form-item label="菜单图标">
          <icon-select v-model="dialogForm.icon" />
        </el-form-item>
        <el-form-item label="路由地址">
          <el-input v-model="dialogForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="组件路径">
          <el-input v-model="dialogForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode">
          <el-input v-model="dialogForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="菜单状态">
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
import { getUserListApi, deleteUserApi, addUserApi, updateUserApi } from '@/api/user';
import { parseDate } from '@/utils/useTools';
import { useGetTableData } from '@/utils/useTableAndFormLogic';
import iconSelect from '@/components/iconSelect.vue';
defineOptions({
  name: 'Menu',
});

const tableHeader = ref([
  { prop: 'menuName', label: '菜单名称', width: '' },
  { prop: 'icon', label: '图标', width: '' },
  { prop: 'menuType', label: '菜单类型', width: '' },
  { prop: 'menuCode', label: '权限标识', width: '' },
  { prop: 'path', label: '路由地址', width: '' },
  { prop: 'component', label: '组件路径', width: '' },
  {
    prop: 'menuState',
    label: '菜单状态',
    width: '',
    formatter: (row, column, value) => {
      return value === 1 ? '正常' : '禁用';
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
const {
  searchForm,
  dialogForm,
  tableData,
  dialogVisible,
  dialogFormRef,
  dialogRules,
  dialogTitle,
  resetSearchForm,
  handleCancel,
  handleAdd,
  handleEdit,
  handleDelete,
  handleSubmit,
  getData,
} = useGetTableData({
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
    parentId: [], //父菜单ID
    menuState: 1, //菜单状态 1:正常 2:禁用
  },
  getList: getUserListApi,
  onAddApi: addUserApi,
  onUpdateApi: updateUserApi,
  onDeleteApi: deleteUserApi,
});
const menuList = ref([
  {
    parentId: [null],
    updateTime: '2021-03-06T10:03:38.947Z',
    createTime: '2021-01-30T09:22:00.000Z',
    _id: '600d4075e218daaf4ec77e52',
    menuType: '1',
    menuName: '系统管理',
    menuCode: '',
    path: '/system',
    icon: 'setting',
    order: '0',
    component: '',
    children: [
      {
        parentId: ['600d4075e218daaf4ec77e52'],
        updateTime: '2021-02-04T07:12:21.077Z',
        createTime: '2021-01-30T08:10:00.000Z',
        _id: '600d525e602f452aaeeffcd9',
        menuType: '1',
        menuName: '用户管理',
        menuCode: '',
        path: '/system/user',
        icon: '',
        order: '1',
        component: '/system/user',
        menuState: '1',
        children: [
          {
            parentId: ['600d4075e218daaf4ec77e52', '600d525e602f452aaeeffcd9'],
            updateTime: '2021-02-21T09:54:44.242Z',
            createTime: '2021-02-20T06:46:50.711Z',
            _id: '6030ca8f93f0e159c8390f0c',
            menuType: '2',
            menuState: '1',
            menuName: '新增',
            menuCode: 'user-create',
            __v: 0,
          },
          {
            parentId: ['600d4075e218daaf4ec77e52', '600d525e602f452aaeeffcd9'],
            updateTime: '2021-02-21T09:54:50.464Z',
            createTime: '2021-02-21T08:50:47.217Z',
            _id: '603226d9257d15a8c54cf9f8',
            menuType: '2',
            menuState: '1',
            menuName: '批量删除',
            menuCode: 'user-delete',
            __v: 0,
          },
          {
            parentId: ['600d4075e218daaf4ec77e52', '600d525e602f452aaeeffcd9'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '603253e0a821c6bb59084541',
            menuType: '2',
            menuState: '1',
            menuName: '查看',
            menuCode: 'user-query',
            __v: 0,
          },
        ],
        action: [
          {
            parentId: ['600d4075e218daaf4ec77e52', '600d525e602f452aaeeffcd9'],
            updateTime: '2021-02-21T09:54:44.242Z',
            createTime: '2021-02-20T06:46:50.711Z',
            _id: '6030ca8f93f0e159c8390f0c',
            menuType: '2',
            menuState: '1',
            menuName: '新增',
            menuCode: 'user-create',
            __v: 0,
          },
          {
            parentId: ['600d4075e218daaf4ec77e52', '600d525e602f452aaeeffcd9'],
            updateTime: '2021-02-21T09:54:50.464Z',
            createTime: '2021-02-21T08:50:47.217Z',
            _id: '603226d9257d15a8c54cf9f8',
            menuType: '2',
            menuState: '1',
            menuName: '批量删除',
            menuCode: 'user-delete',
            __v: 0,
          },
          {
            parentId: ['600d4075e218daaf4ec77e52', '600d525e602f452aaeeffcd9'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '603253e0a821c6bb59084541',
            menuType: '2',
            menuState: '1',
            menuName: '查看',
            menuCode: 'user-query',
            __v: 0,
          },
        ],
      },
      {
        parentId: ['600d4075e218daaf4ec77e52'],
        updateTime: '2021-02-04T09:52:40.576Z',
        createTime: '2021-02-04T09:52:40.576Z',
        _id: '601bc4f8a794e23c2e42efa9',
        menuType: '1',
        menuState: '1',
        menuName: '菜单管理',
        path: '/system/menu',
        component: '/system/menu',
        __v: 0,
        children: [
          {
            parentId: ['600d4075e218daaf4ec77e52', '601bc4f8a794e23c2e42efa9'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '60325400a821c6bb59084543',
            menuType: '2',
            menuState: '1',
            menuName: '查看',
            menuCode: 'menu-query',
            __v: 0,
          },
          {
            parentId: ['600d4075e218daaf4ec77e52', '601bc4f8a794e23c2e42efa9'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '6032540fa821c6bb59084544',
            menuType: '2',
            menuState: '1',
            menuName: '创建',
            menuCode: 'menu-create',
            __v: 0,
          },
        ],
        action: [
          {
            parentId: ['600d4075e218daaf4ec77e52', '601bc4f8a794e23c2e42efa9'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '60325400a821c6bb59084543',
            menuType: '2',
            menuState: '1',
            menuName: '查看',
            menuCode: 'menu-query',
            __v: 0,
          },
          {
            parentId: ['600d4075e218daaf4ec77e52', '601bc4f8a794e23c2e42efa9'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '6032540fa821c6bb59084544',
            menuType: '2',
            menuState: '1',
            menuName: '创建',
            menuCode: 'menu-create',
            __v: 0,
          },
        ],
      },
      {
        parentId: ['600d4075e218daaf4ec77e52'],
        updateTime: '2021-02-04T09:52:40.576Z',
        createTime: '2021-02-04T09:52:40.576Z',
        _id: '601ca9a8a794e23c2e42efab',
        menuType: '1',
        menuState: '1',
        menuName: '角色管理',
        path: '/system/role',
        component: '/system/role',
        __v: 0,
        children: [
          {
            parentId: ['600d4075e218daaf4ec77e52', '601ca9a8a794e23c2e42efab'],
            updateTime: '2021-02-21T12:38:19.650Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '60325425a821c6bb59084545',
            menuType: '2',
            menuState: '1',
            menuName: '查看',
            menuCode: 'role-query',
            __v: 0,
          },
          {
            parentId: ['600d4075e218daaf4ec77e52', '601ca9a8a794e23c2e42efab'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '60325461a821c6bb59084546',
            menuType: '2',
            menuState: '1',
            menuName: '创建',
            menuCode: 'role-create',
            __v: 0,
          },
        ],
        action: [
          {
            parentId: ['600d4075e218daaf4ec77e52', '601ca9a8a794e23c2e42efab'],
            updateTime: '2021-02-21T12:38:19.650Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '60325425a821c6bb59084545',
            menuType: '2',
            menuState: '1',
            menuName: '查看',
            menuCode: 'role-query',
            __v: 0,
          },
          {
            parentId: ['600d4075e218daaf4ec77e52', '601ca9a8a794e23c2e42efab'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '60325461a821c6bb59084546',
            menuType: '2',
            menuState: '1',
            menuName: '创建',
            menuCode: 'role-create',
            __v: 0,
          },
        ],
      },
      {
        parentId: ['600d4075e218daaf4ec77e52'],
        updateTime: '2021-02-04T09:52:40.576Z',
        createTime: '2021-02-04T09:52:40.576Z',
        _id: '601cb172a794e23c2e42efac',
        menuType: '1',
        menuState: '1',
        menuName: '部门管理',
        path: '/system/dept',
        component: '/system/dept',
        __v: 0,
        children: [
          {
            parentId: ['600d4075e218daaf4ec77e52', '601cb172a794e23c2e42efac'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '60325470a821c6bb59084547',
            menuType: '2',
            menuState: '1',
            menuName: '查看',
            menuCode: 'dept-query',
            __v: 0,
          },
          {
            parentId: ['600d4075e218daaf4ec77e52', '601cb172a794e23c2e42efac'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '6032547da821c6bb59084548',
            menuType: '2',
            menuState: '1',
            menuName: '创建',
            menuCode: 'dept-create',
            __v: 0,
          },
        ],
        action: [
          {
            parentId: ['600d4075e218daaf4ec77e52', '601cb172a794e23c2e42efac'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '60325470a821c6bb59084547',
            menuType: '2',
            menuState: '1',
            menuName: '查看',
            menuCode: 'dept-query',
            __v: 0,
          },
          {
            parentId: ['600d4075e218daaf4ec77e52', '601cb172a794e23c2e42efac'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '6032547da821c6bb59084548',
            menuType: '2',
            menuState: '1',
            menuName: '创建',
            menuCode: 'dept-create',
            __v: 0,
          },
        ],
      },
    ],
  },
  {
    parentId: [null],
    updateTime: '2021-02-18T01:42:15.243Z',
    createTime: '2021-02-04T06:56:46.506Z',
    _id: '601b9eb25929c81a1f988bb0',
    menuType: '1',
    menuState: '1',
    menuName: '审批管理',
    path: '/audit',
    icon: 'promotion',
    __v: 0,
    children: [
      {
        parentId: ['601b9eb25929c81a1f988bb0'],
        updateTime: '2021-02-19T14:50:00.555Z',
        createTime: '2021-02-04T09:52:40.576Z',
        _id: '601bc763a794e23c2e42efaa',
        menuType: '1',
        menuState: '1',
        menuName: '休假申请',
        path: '/audit/leave',
        component: '/audit/leave',
        __v: 0,
        children: [
          {
            parentId: ['601b9eb25929c81a1f988bb0', '601bc763a794e23c2e42efaa'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '603254a8a821c6bb59084549',
            menuType: '2',
            menuState: '1',
            menuName: '查看',
            menuCode: 'leave-query',
            __v: 0,
          },
          {
            parentId: ['601b9eb25929c81a1f988bb0', '601bc763a794e23c2e42efaa'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '603254baa821c6bb5908454a',
            menuType: '2',
            menuState: '1',
            menuName: '申请休假',
            menuCode: 'leave-create',
            __v: 0,
          },
        ],
        action: [
          {
            parentId: ['601b9eb25929c81a1f988bb0', '601bc763a794e23c2e42efaa'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '603254a8a821c6bb59084549',
            menuType: '2',
            menuState: '1',
            menuName: '查看',
            menuCode: 'leave-query',
            __v: 0,
          },
          {
            parentId: ['601b9eb25929c81a1f988bb0', '601bc763a794e23c2e42efaa'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '603254baa821c6bb5908454a',
            menuType: '2',
            menuState: '1',
            menuName: '申请休假',
            menuCode: 'leave-create',
            __v: 0,
          },
        ],
      },
      {
        parentId: ['601b9eb25929c81a1f988bb0'],
        updateTime: '2021-02-19T14:53:04.590Z',
        createTime: '2021-02-04T09:52:40.576Z',
        _id: '602fd045bf465a015fef54dc',
        menuType: '1',
        menuState: '1',
        menuName: '待我审批',
        path: '/audit/approve',
        component: '/audit/approve',
        __v: 0,
        children: [
          {
            parentId: ['601b9eb25929c81a1f988bb0', '602fd045bf465a015fef54dc'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '60361f35a821c6bb5908454d',
            menuType: '2',
            menuState: '1',
            menuName: '查看',
            menuCode: 'approve-query',
            __v: 0,
          },
        ],
        action: [
          {
            parentId: ['601b9eb25929c81a1f988bb0', '602fd045bf465a015fef54dc'],
            updateTime: '2021-02-21T11:06:19.345Z',
            createTime: '2021-02-21T11:06:19.345Z',
            _id: '60361f35a821c6bb5908454d',
            menuType: '2',
            menuState: '1',
            menuName: '查看',
            menuCode: 'approve-query',
            __v: 0,
          },
        ],
      },
    ],
  },
]);
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
