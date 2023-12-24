<template>
  <div class="common-card">
    <div class="query-form">
      <el-form :model="searchForm" label-width="80px" inline>
        <el-form-item label="用户ID">
          <el-input v-model="searchForm.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="searchForm.state" placeholder="请选择用户状态">
            <el-option label="所有" :value="0"> </el-option>
            <el-option label="在职" :value="1"> </el-option>
            <el-option label="离职" :value="2"> </el-option>
            <el-option label="试用期" :value="3"> </el-option>
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
        <el-button type="primary" @click="handleAdd('add', '新增')">新增</el-button>
        <el-popconfirm width="220" confirm-button-text="确定" cancel-button-text="取消" icon="InfoFilled" title="确定删除么？" @confirm="handleDelete(false)">
          <template #reference>
            <el-button type="danger">批量删除</el-button>
          </template>
        </el-popconfirm>
      </div>
      <div class="table-box">
        <el-table :data="tableData" ref="multipleTableRef" border stripe @selection-change="handleSelectionChange" height="100%">
          <el-table-column type="selection" width="55" />
          <el-table-column v-for="(col, index) in tableHeader" :key="index" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width" align="center"> </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template #default="{ row }">
              <div>
                <el-button type="primary" size="small" @click="handleEdit('edit', '编辑', row)">编辑</el-button>
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
      <el-form :model="dialogForm" ref="dialogFormRef" :rules="dialogRules" label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="dialogForm.userName" :disabled="dialogType === 'edit'"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="dialogForm.userEmail" :disabled="dialogType === 'edit'"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="dialogForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="岗位">
          <el-input v-model="dialogForm.job"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="dialogForm.state" placeholder="请选择用户状态">
            <el-option label="在职" :value="1"> </el-option>
            <el-option label="离职" :value="2"> </el-option>
            <el-option label="试用期" :value="3"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色">
          <el-select v-model="dialogForm.roleList" multiple placeholder="请选择系统角色" class="w-full">
            <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否管理员">
          <el-select v-model="dialogForm.role">
            <el-option label="是" :value="0" />
            <el-option label="否" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader v-model="dialogForm.deptId" :options="deptList" :props="{ checkStrictly: true }" class="w-full" />
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
defineOptions({
  name: 'User',
});

const stateList = ref(['在职', '离职', '试用期']);
const tableHeader = ref([
  { prop: 'userId', label: '用户ID', width: '' },
  { prop: 'userName', label: '用户名', width: '' },
  { prop: 'userEmail', label: '用户邮箱', width: '200' },
  { prop: 'role', label: '用户角色', width: '', formatter: (row, column, value) => (value === 0 ? '管理员' : '普通用户') },
  { prop: 'state', label: '用户状态', width: '', formatter: (row, column, value) => stateList.value[value - 1] },
  {
    prop: 'createTime',
    label: '注册时间',
    width: '180',
    formatter: (row, column, value) => {
      return parseDate(new Date(value));
    },
  },
  {
    prop: 'lastLoginTime',
    label: '最后登录时间',
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
  totalNum,
  multipleTableRef,
  dialogVisible,
  dialogFormRef,
  dialogRules,
  deptList,
  roleList,
  dialogTitle,
  dialogType,
  resetSearchForm,
  handleCancel,
  handleSelectionChange,
  handleAdd,
  handleEdit,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSubmit,
  getData,
} = useGetTableData({
  searchForm: {
    userId: '',
    userName: '',
    state: 0,
    pageNum: 1,
    pageSize: 10,
  },
  dialogForm: {
    userId: '',
    userName: '',
    userEmail: '',
    role: '',
    state: 1,
    job: '',
    mobile: '',
    roleList: [],
    deptId: [],
  },
  getList: getUserListApi,
  onAddApi: addUserApi,
  onUpdateApi: updateUserApi,
  onDeleteApi: deleteUserApi,
});

onMounted(() => {
  getData();
});
</script>
