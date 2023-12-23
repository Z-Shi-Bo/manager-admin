<template>
  <div class="user">
    <div class="query-form">
      <el-form :model="form" label-width="80px" inline>
        <el-form-item label="用户ID">
          <el-input v-model="form.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="form.state" value-key="" placeholder="请选择用户状态" clearable>
            <el-option label="所有" :value="0"> </el-option>
            <el-option label="在职" :value="1"> </el-option>
            <el-option label="离职" :value="2"> </el-option>
            <el-option label="试用期" :value="3"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="danger" @click="handleDelete">批量删除</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" ref="multipleTableRef" border stripe @selection-change="handleSelectionChange">
          <el-table-column type="index" width="50" />
          <el-table-column v-for="(col, index) in tableHeader" :key="index" :prop="col.prop" :label="col.label" :formatter="col.formatter" :min-width="col.width || 80" align="center">
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template #default="{ row }">
              <div>
                <el-button type="primary" size="small" @click="">编辑</el-button>
                <el-button type="danger" size="small" @click="">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[20, 30, 40]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>
    <el-drawer title="新增用户" v-model="visibleDrawer" size="30%" :destroy-on-close="true" :show-close="true"> </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getUserListApi } from '@/api/user';
import { parseDate } from '@/utils/useTools';
defineOptions({
  name: 'User',
});
const form = reactive({
  userId: '',
  userName: '',
  state: '',
});
const visibleDrawer = ref(false);

// 关于表格的逻辑
const multipleTableRef = ref(null);
const multipleSelection = ref([]);
const tableData = ref([]);
const tableHeader = ref([
  { prop: 'userId', label: '用户ID', width: '' },
  { prop: 'userName', label: '用户名', width: '' },
  { prop: 'userEmail', label: '用户邮箱', width: '' },
  { prop: 'role', label: '用户角色', width: '' },
  { prop: 'state', label: '用户状态', width: '' },
  {
    prop: 'createTime',
    label: '注册时间',
    width: '',
    formatter: (row, column, value) => {
      return parseDate(new Date(value));
    },
  },
  {
    prop: 'lastLoginTime',
    label: '最后登录时间',
    width: '',
    formatter: (row, column, value) => {
      return parseDate(new Date(value));
    },
  },
]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
  console.log(multipleSelection.value);
};
// 查询
const handleSearch = () => {
  getUserList();
};
// 重置
const handleReset = () => {
  for (const key in form) {
    if (Object.hasOwnProperty.call(form, key)) {
      form[key] = '';
    }
  }
  pageSize.value = 20;
  currentPage.value = 1;
  getUserList();
};
// 新增
const handleAdd = () => {};
// 批量删除
const handleDelete = () => {};

// 分页
const currentPage = ref(1);
const pageSize = ref(20);
const totalNum = ref(0);
const handleSizeChange = (val) => {
  pageSize.value = val;
  getUserList();
};
const handleCurrentChange = (val) => {
  currentPage.value = val;
  getUserList();
};
// 获取用户列表
const getUserList = async () => {
  const result = await getUserListApi({
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    userId: form.userId,
    userName: form.userName,
    state: form.state,
  });
  tableData.value = result.list;
  totalNum.value = result.total;
};
onMounted(() => {
  getUserList();
});
</script>
<style lang="scss" scoped>
.user {
  @apply h-full;
  // overflow: hidden;
  .el-form-item {
    margin-bottom: 0;
  }
  > .query-form {
    @apply h-[60px] bg-white shadow-sm rounded flex items-center;
  }
  > .base-table {
    height: calc(100% - 80px);
    @apply mt-[20px] bg-white rounded;
    > .action {
      @apply flex items-center h-[80px] ml-6;
    }
    > .table-box {
      height: calc(100% - 140px);
      padding: 20px;
    }
    > .page-box {
      @apply flex justify-center items-center h-[60px];
    }
  }
}
</style>
