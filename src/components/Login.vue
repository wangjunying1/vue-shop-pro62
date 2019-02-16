<template>
  <div id="login-container">
    <div id="login-box">
      <div id="logo-box">
        <img src="../assets/css/img/logo.png" alt>
      </div>
      <el-form :model="loginForms" ref="loginFormRef" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginForms.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForms.password">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>
        <el-col :offset="15">
          <el-button type="primary" @click="login">login</el-button>
          <el-button type="info" @click="resetForm">reset</el-button>
        </el-col>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForms: {
        username: 'admin',
        password: '123456'
      },
      // 给哥哥表单域定义校验规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名称', triggle: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // login systerm
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid === true) {
          // 用户真实性验证
          // axios带着数据到后端数据库验证
          const { data: res } = await this.$http.post('/login', this.loginForms)
          // console.log(res)
          // console.log(this.loginForms)
          // 判断用户名或者密码真实性校验失败
          if (res.meta.status !== 200) {
            return this.$message.error('用户名或者密码不存在')
          }
          // 通过浏览器的session storage记录服务器返回的token信息
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    },
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
#login-container {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  #login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    // background-color: #fff;
    #logo-box {
      width: 130px;
      height: 130px;
      position: absolute;
      background-color: #fff;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      img {
        width: 100%;
        height: 100%;
        background-color: #eee;
        border-radius: 50%;
      }
    }
    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
