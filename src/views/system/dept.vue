<template>
  <div class="dept common-card">
    <div class="query-form">
      <el-form :model="searchForm" label-width="80px" inline>
        <el-form-item label="部门名称">
          <el-input v-model="searchForm.roleName" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">查询</el-button>
          <el-button @click="resetSearchForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd('add', '创建部门')">创建</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" height="100%">
          <el-table-column v-for="(col, index) in tableHeader" :key="index" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width" align="center"> </el-table-column>
          <el-table-column label="操作" width="240" align="center">
            <template #default="{ row }">
              <div>
                <el-button size="small" @click="handleEdit('edit', '编辑部门', row)">编辑</el-button>
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
        <el-form-item label="上级部门">
          <el-select v-model="dialogForm.parentId" placeholder="请选择上级部门">
            <el-option v-for="item in deptList" :key="item" :label="item" :value="item"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input v-model="dialogForm.deptName" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-select v-model="dialogForm.userName" placeholder="请选择负责人" @change="handleChange">
            <el-option v-for="item in userList" :key="item.userName" :label="item.userName" :value="`${item.userName}/${item.userId}/${item.userEmail}`"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱">
          <el-input v-model="dialogForm.userEmail" disabled placeholder="请输入负责人邮箱"></el-input>
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
import { getRoleListApi, deleteRoleApi, addRoleApi, updateRoleApi, setPermissionApi } from '@/api/roles';
import { getDeptListApi } from '@/api/depts';
import { getUserListApi } from '@/api/user';
import { parseDate, useMessage } from '@/utils/useTools';
import { useGetTableData } from '@/utils/useTableAndFormLogic';
defineOptions({
  name: 'Dept',
});

const tableHeader = ref([
  { prop: 'deptName', label: '部门名称', width: '' },
  { prop: 'userName', label: '负责人', width: '' },
  {
    prop: 'updateTime',
    label: '更新时间',
    width: '',
    formatter: (row, column, value) => {
      return parseDate(new Date(value));
    },
  },
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
    deptName: '',
    pageNum: 1,
    pageSize: 10,
  },
  dialogForm: {
    _id: '',
    deptName: '',
    parentId: '',
    userName: '',
    userEmail: '',
    updateTime: Date.now(),
  },
  getList: getDeptListApi,
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

// 用户列表
const userList = ref([]);
// 部门列表
const deptList = ref([]);
// 获取用户列表
const getUserList = async () => {
  try {
    const res = await getUserListApi({ pageNum: 1, pageSize: 1000 });
    userList.value = res.list;
  } catch (error) {
    useMessage(error.message, 'error');
  }
};
// 负责人切换
const handleChange = (val) => {
  dialogForm.userEmail = val.split('/')[2];
};
// 获取部门列表
onMounted(() => {
  getData();
  getUserList();
});
</script>
