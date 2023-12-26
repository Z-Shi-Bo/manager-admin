<template>
  <div class="login">
    <div class="login-box">
      <div class="login-title">
        <h1>火星</h1>
      </div>
      <div class="login-form">
        <el-form :model="form" ref="formRef" :rules="rules">
          <el-form-item prop="userName">
            <el-input v-model="form.userName" placeholder="请输入账号">
              <template #prefix>
                <el-icon><user /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" @keyup.enter="onSubmit" placeholder="请输入密码" show-password>
              <template #prefix>
                <el-icon><lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="w-full" type="primary" @click="onSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { login } from '@/api/common';
import { useUserStore } from '@/store/useUserStore';
import { useRouter } from 'vue-router';
const router = useRouter();
const userStore = useUserStore();
const form = reactive({
  userName: '',
  password: '',
  mock: false,
});
const rules = {
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
// 表单实例
const formRef = ref(null);

// 提交事件
const onSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      login(form).then((res) => {
        userStore.saveUser(res);
        router.push('/');
      });
    }
  });
};
</script>
<style lang="scss" scoped>
.login {
  @apply h-full flex justify-center items-center;
  > .login-box {
    @apply w-[500px] h-[300px] p-[50px] bg-white rounded shadow shadow-gray-300;
    > .login-title {
      @apply text-4xl mb-8 text-center;
    }
  }
}
</style>
