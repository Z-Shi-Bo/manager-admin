import { ref, reactive } from 'vue';
import { useMessage } from '@/utils/useTools';

// 表格的逻辑  列表  分页  搜索  删除
export const useGetTableData = (opt = {}) => {
  let searchForm = null;
  let dialogForm = null;
  let resetSearchForm = null;
  let handleCancel = null;
  // 分页
  const totalNum = ref(0);
  // 弹窗
  const dialogVisible = ref(false);
  const multipleTableRef = ref(null);
  const multipleSelection = ref([]);
  const tableData = ref([]);
  // 侧边栏的动态标题
  const dialogTitle = ref('新增');
  const dialogType = ref('add');
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

  // 表单重置
  if (opt.searchForm) {
    searchForm = reactive({ ...opt.searchForm });
    resetSearchForm = () => {
      for (const key in opt.searchForm) {
        if (Object.hasOwnProperty.call(opt.searchForm, key)) {
          searchForm[key] = opt.searchForm[key];
        }
      }
      getData();
    };
  }
  // 弹框的表单重置和清除验证
  if (opt.dialogForm) {
    dialogForm = reactive({ ...opt.dialogForm });
    handleCancel = () => {
      for (const key in opt.dialogForm) {
        if (Object.hasOwnProperty.call(opt.dialogForm, key)) {
          dialogForm[key] = opt.dialogForm[key];
        }
      }
      dialogFormRef.value.clearValidate();
      dialogVisible.value = false;
    };
  }

  // 获取数据列表列表
  const getData = async () => {
    try {
      const result = await opt.getList({
        ...searchForm,
      });
      if (opt.onGetListSuccess && typeof opt.onGetListSuccess === 'function') {
        opt.onGetListSuccess(result);
      } else {
        tableData.value = result.list;
        totalNum.value = result.total;
      }
    } catch (error) {
      useMessage(error.message, 'error');
    }
  };
  // 关于表格的逻辑
  const handleSelectionChange = (val) => {
    multipleSelection.value.push(...val);
  };

  // 新增
  const handleAdd = (type, title) => {
    dialogType.value = type;
    dialogTitle.value = title;
    dialogVisible.value = true;
  };
  // 编辑
  const handleEdit = (type, title, row, editPage = '') => {
    dialogType.value = type;
    dialogTitle.value = title;
    for (const key in dialogForm) {
      if (Object.hasOwnProperty.call(dialogForm, key)) {
        dialogForm[key] = row[key];
      }
    }
    if (editPage === 'menu') {
      dialogForm.parentId = [...row.parentId, row._id].filter((item) => item);
    }
    dialogVisible.value = true;
  };
  // 确定提交
  const handleSubmit = () => {
    dialogFormRef.value.validate(async (valid) => {
      if (valid) {
        try {
          dialogType.value === 'add' ? await opt.onAddApi(dialogForm) : await opt.onUpdateApi(dialogForm);
          useMessage(dialogTitle.value + '成功');
          handleCancel();
          getData();
        } catch (error) {
          useMessage(error.message, 'error');
        }
      }
    });
  };
  // 批量删除
  const handleDelete = async (row) => {
    try {
      let userIds = [];
      if (row) {
        userIds.push(row.userId);
      } else {
        userIds = multipleSelection.value.map((item) => item.userId);
      }
      if (userIds.length === 0) {
        useMessage('请选择要删除的数据', 'error');
        return;
      }
      await opt.onDeleteApi({ userIds });
      getData();
    } catch (error) {
      useMessage(error.message, 'error');
    }
  };

  const handleSizeChange = (val) => {
    searchForm.pageSize = val;
    getData();
  };
  const handleCurrentChange = (val) => {
    searchForm.pageNum = val;
    getData();
  };

  return {
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
  };
};
