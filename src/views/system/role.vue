<template>
  <div class="role common-card">
    <div class="query-form">
      <el-form :model="searchForm" label-width="80px" inline>
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">查询</el-button>
          <el-button @click="resetSearchForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd('add', '创建角色')">创建</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" height="100%">
          <el-table-column v-for="(col, index) in tableHeader" :key="index" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width" align="center"> </el-table-column>
          <el-table-column label="权限列表" prop="permissionList">
            <template #default="{ row }">
              <span v-for="(item, index) in row.permissionList.halfCheckedKeys" :key="index">
                <el-tag v-if="menuMap[item]" class="mr-2" style="margin-bottom: 4px;">{{ menuMap[item] }}</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" align="center">
            <template #default="{ row }">
              <div>
                <el-button size="small" @click="handleEdit('edit', '编辑菜单', row)">编辑</el-button>
                <el-button type="primary" size="small" @click="handleSetPermission(row)">设置权限</el-button>
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
      <div class="page-box">
        <el-pagination
          :current-page="searchForm.pageNum"
          :page-size="searchForm.pageSize"
          :page-sizes="[20, 30, 40]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="40%">
      <el-form :model="dialogForm" ref="dialogFormRef" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="dialogForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="4" v-model="dialogForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 设置权限弹框 -->
    <el-dialog title="权限配置" v-model="permissionDialogVisible" destroy-on-close width="40%">
      <el-form label-width="100px">
        <el-form-item label="角色名称">
          <p class="font-bold">{{ currentRoleName }}</p>
        </el-form-item>
        <el-form-item label="配置权限">
          <el-tree :data="permissionList" ref="permissionTreeRef" default-expand-all show-checkbox node-key="_id" :props="defaultProps" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="handleCancelPermission">取消</el-button>
          <el-button type="primary" @click="handleSubmitPermission">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { getRoleListApi, deleteRoleApi, addRoleApi, updateRoleApi, setPermissionApi } from '@/api/roles';
import { getMenuListApi } from '@/api/menus';
import { parseDate, useMessage } from '@/utils/useTools';
import { useGetTableData } from '@/utils/useTableAndFormLogic';
defineOptions({
  name: 'Role',
});

const tableHeader = ref([
  { prop: 'roleName', label: '角色名称', width: '' },
  { prop: 'remark', label: '备注', width: '' },
  {
    prop: 'createTime',
    label: '创建时间',
    width: '',
    formatter: (row, column, value) => {
      return parseDate(new Date(value));
    },
  },
]);
const {
  searchForm,
  dialogForm,
  tableData,
  totalNum,
  dialogVisible,
  dialogFormRef,
  dialogTitle,
  resetSearchForm,
  handleCancel,
  handleAdd,
  handleEdit,
  handleSizeChange,
  handleCurrentChange,
  handleSubmit,
  getData,
} = useGetTableData({
  searchForm: {
    roleName: '',
    pageNum: 1,
    pageSize: 10,
  },
  dialogForm: {
    _id: '',
    roleName: '',
    remark: '',
    permissionList: {
      checkedKeys: [],
      halfCheckedKeys: [],
    },
  },
  getList: getRoleListApi,
  onAddApi: addRoleApi,
  onUpdateApi: updateRoleApi,
});
// 删除操作
const handleDelete = async (row) => {
  try {
    await deleteRoleApi({ _id: row._id });
    useMessage('删除成功');
    getData();
  } catch (error) {
    useMessage(error.message, 'error');
  }
};

// 配置权限
const permissionDialogVisible = ref(false);
const currentRoleName = ref('');
const currentRoleId = ref('');
const defaultProps = {
  children: 'children',
  label: 'menuName',
};
// 权限列表
const permissionList = ref([]);
const permissionTreeRef = ref(null);
// 菜单映射表
const menuMap = ref({});
// 处理菜单映射表逻辑
const menuMapHandler = (list) => {
  list.forEach((item) => {
    if (item.children && item.action) {
      menuMap.value[item._id] = item.menuName;
    }
    if (!item.children && item.menuType === 1 && !item.action) {
      menuMap.value[item._id] = item.menuName;
    }
    if (item.children && !item.action) {
      menuMapHandler(item.children);
    }
  });
};
// 获取菜单列表
const getMenuList = async () => {
  const res = await getMenuListApi();
  permissionList.value = res?.list || [];
  menuMapHandler(res?.list || []);
  console.log(menuMap);
};
const handleSetPermission = (row) => {
  currentRoleName.value = row.roleName;
  currentRoleId.value = row._id;
  const { checkedKeys } = row.permissionList;
  permissionDialogVisible.value = true;
  nextTick(() => {
    permissionTreeRef.value.setCheckedKeys(checkedKeys);
  });
};
// 配置权限确定
const handleSubmitPermission = async () => {
  try {
    const nodes = permissionTreeRef.value.getCheckedNodes();
    const halfNodes = permissionTreeRef.value.getHalfCheckedNodes();
    const checkedKeys = [];
    const halfCheckedKeys = [];
    nodes.map((item) => {
      if (!item.children) {
        checkedKeys.push(item._id);
      } else {
        halfCheckedKeys.push(item._id);
      }
    });
    if (halfNodes.length) {
      halfNodes.map((item) => {
        halfCheckedKeys.push(item._id);
      });
    }
    await setPermissionApi({ _id: currentRoleId.value, permissionList: { checkedKeys, halfCheckedKeys } });
    useMessage('配置成功');
    getData();
    handleCancelPermission();
  } catch (error) {
    useMessage('配置失败', 'error');
  }
};
// 配置权限取消
const handleCancelPermission = () => {
  permissionDialogVisible.value = false;
  currentRoleId.value = '';
  currentRoleName.value = '';
};
onMounted(() => {
  getData();
  getMenuList();
});
</script>
