<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="login_logo">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登入表单区 -->
      <el-form :rules="loginRules" :model="loginForm" ref="loginFormRef" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            placeholder="用户名"
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginLoginForm">登入</el-button>
          <el-button type="info" @click="restLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { request } from '../network/request.js'

export default {
  name: 'Login',
  data() {
    return {
      //登入表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //表单验证规则对象
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //点击重置按钮，重置表单
    restLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    //点击登入按钮，提交表单
    loginLoginForm() {
      //表单数据预验证
      this.$refs.loginFormRef.validate(async vaild => {
        if(!vaild) return false
        //预验证成功，使用axios封装的模块request进行网络请求
        const res = await request({
          url: 'login',
          method: 'post',
          data: this.loginForm
        })
        .then(res => {
          return res
        }).catch(error => {
          console.log(error)
          return false
        })
        // console.log(res)
        if(res){
          if(res.meta.status != 200){
            return this.$message.error('登入失败')
          }
          this.$message.success('登入成功')
          // 1、将登陆成功之后的token, 保存到客户端的sessionStorage中; localStorage中是持久化的保存
          //   1.1 项目中出现了登录之外的其他API接口，必须在登陆之后才能访问
          //   1.2 token 只应在当前网站打开期间生效，所以将token保存在sessionStorage中
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
}
.login_logo{
  width: 130px;
  height: 130px;
  margin: -65px auto;
  border-radius: 50%;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
  padding: 10px;
}
.login_logo img{
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: center;
}
</style>