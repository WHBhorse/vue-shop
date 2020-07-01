<template>
  <div>
    <!-- 添加用户按钮 -->
    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form 
        :model="addForm"
        ref="addFormRef"
        :rules="addFormRules"
        label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'UserAdd',
  props: {
    checkMethods: Object
  },
  data() {
    return {
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      dialogVisible: false,
      // 用户添加表单验证规则
      addFormRules:{
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: this.checkMethods.checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: this.checkMethods.checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    addUser() {
      // 校验表单
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return false
        const res = await request({
          url: 'users',
          method: 'post',
          data: this.addForm
        }).then(res => {
          return res
        }).catch(error => {
          console.log(error)
          return false
        })
        if(res && res.meta.status != 201){
          return this.$message.error('添加用户失败')
        } else {
          // 隐藏对话框
          this.dialogVisible = false
          // 重置表单
          this.$refs.addFormRef.resetFields()
          this.$message.success('添加用户成功')
        }
        // 自定义事件调用父组件的getUsersList方法刷新用户列表
        this.$emit('getUsersList')
      })
      
    }
  }
}
</script>

<style lang="less" scoped>

</style>