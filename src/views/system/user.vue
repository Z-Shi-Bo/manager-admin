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
          <el-select v-model="form.state" value-key="" placeholder="请选择用户状态">
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
        <el-button type="danger" @click="handleDelete(false)">批量删除</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" ref="multipleTableRef" border stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column v-for="(col, index) in tableHeader" :key="index" :prop="col.prop" :label="col.label" :formatter="col.formatter" :min-width="col.width || 80" align="center">
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template #default="{ row }">
              <div>
                <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
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
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="40%">
      <el-form :model="dialogForm" ref="dialogFormRef" :rules="dialogRules" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="dialogForm.userName" :disabled="dialogTitle === '编辑'"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="dialogForm.userEmail" :disabled="dialogTitle === '编辑'"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="dialogForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="岗位">
          <el-input v-model="dialogForm.job"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="dialogForm.state" value-key="" placeholder="请选择用户状态">
            <el-option label="所有" :value="0"> </el-option>
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
import { ref, reactive, onMounted } from 'vue';
import { getUserListApi, deleteUserApi } from '@/api/user';
import { parseDate, useMessage } from '@/utils/useTools';
defineOptions({
  name: 'User',
});
const form = reactive({
  userId: '',
  userName: '',
  state: 0,
});
const dialogVisible = ref(false);

// 关于表格的逻辑
const multipleTableRef = ref(null);
const multipleSelection = ref([]);
const tableData = ref([]);
const stateList = ref(['在职', '离职', '试用期']);
const tableHeader = ref([
  { prop: 'userId', label: '用户ID', width: '' },
  { prop: 'userName', label: '用户名', width: '' },
  { prop: 'userEmail', label: '用户邮箱', width: '' },
  { prop: 'role', label: '用户角色', width: '', formatter: (row, column, value) => (value === 0 ? '管理员' : '普通用户') },
  { prop: 'state', label: '用户状态', width: '', formatter: (row, column, value) => stateList.value[value] },
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
  for (const item of val) {
    multipleSelection.value.push(item.userId);
  }
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
// 侧边栏的动态标题
const dialogTitle = ref('新增');
const dialogForm = reactive({
  userId: '',
  userName: '',
  userEmail: '',
  role: '',
  state: '',
  job: '',
  mobile: '',
  roleList: [],
  deptId: [],
});
const dialogFormRef = ref(null);
const dialogRules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
  ],
  userEmail: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  deptId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
};

const deptList = ref([
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          {
            value: 'controllability',
            label: 'Controllability',
          },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'top nav',
            label: 'Top Navigation',
          },
        ],
      },
    ],
  },
  {
    value: 'component',
    label: 'Component',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'button',
            label: 'Button',
          },
        ],
      },
      {
        value: 'form',
        label: 'Form',
        children: [
          {
            value: 'form',
            label: 'Form',
          },
        ],
      },
      {
        value: 'data',
        label: 'Data',
        children: [
          {
            value: 'badge',
            label: 'Badge',
          },
        ],
      },
      {
        value: 'notice',
        label: 'Notice',
        children: [
          {
            value: 'notification',
            label: 'Notification',
          },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'steps',
            label: 'Steps',
          },
        ],
      },
      {
        value: 'others',
        label: 'Others',
        children: [
          {
            value: 'collapse',
            label: 'Collapse',
          },
        ],
      },
    ],
  },
  {
    value: 'resource',
    label: 'Resource',
    children: [
      {
        value: 'docs',
        label: 'Design Documentation',
      },
    ],
  },
]);
const roleList = ref([
  {
    value: '研发',
    label: '研发',
  },
  {
    value: '测试',
    label: '测试',
  },
  {
    value: '产品',
    label: '产品',
  },
]);
// 新增
const handleAdd = () => {
  dialogTitle.value = '新增';
  dialogVisible.value = true;
};
// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑';
  for (const key in dialogForm) {
    if (Object.hasOwnProperty.call(dialogForm, key)) {
      dialogForm[key] = row[key];
    }
  }
  dialogVisible.value = true;
};
// 确定提交
const handleSubmit = async () => {
  dialogFormRef.value.validate((valid) => {
    if (valid) {
      dialogVisible.value = false;
    }
  });
};
// 取消
const handleCancel = () => {
  dialogFormRef.value.clearValidate();
  dialogVisible.value = false;
};
// 批量删除
const handleDelete = async (row) => {
  try {
    let userIds = [];
    if (row) {
      userIds.push(row.userId);
    } else {
      userIds = multipleSelection.value;
    }
    await deleteUserApi({ userIds });
    getUserList();
  } catch (error) {
    console.log(error);
    useMessage(error.message, 'error');
  }
};

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
  try {
    const result = await getUserListApi({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      userId: form.userId,
      userName: form.userName,
      state: form.state,
    });
    tableData.value = result.list;
    totalNum.value = result.total;
  } catch (error) {
    useMessage(error.message, 'error');
  }
};
onMounted(() => {
  getUserList();
});
</script>
<style lang="scss" scoped>
.user {
  @apply h-full;
  // overflow: hidden;
  > .query-form {
    .el-form-item {
      margin-bottom: 0;
    }
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
