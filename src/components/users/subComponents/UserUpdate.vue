<template>
  <div>
    <el-tooltip  effect="dark" content="修改" placement="top" :enterable="false">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="getUserByid"></el-button>
    </el-tooltip>
    <!-- 更新用户弹窗 -->
    <el-dialog
      title="修改用户"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form 
        :model="updateForm"
        ref="updateFormRef"
        :rules="updateFormRules"
        label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updateForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="updateForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'UserUpdate',
  props: {
    id: Number,
    checkMethods: Object
  },
  data() {
    return {
      dialogVisible: false,
      updateForm: {
        username: '',
        email: '',
        mobile: ''
      },
      updateFormRules: {
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
    // 更新用户
    updateUser() {
      this.$refs.updateFormRef.validate(async valid => {
        if(!valid) return false
        const res = await request({
          url: `users/${this.id}`,
          method: 'put',
          data: {
            email: this.updateForm.email,
            mobile: this.updateForm.mobile
          }
        }).then(res => {
          return res
        }).catch(error => {
          console.log(error)
          return false
        })
        if(res && res.meta.status != 200){
          return this.$message.error('修改失败')
        } else {
          // 刷新用户信息
          this.$emit('updateTwo')
          // 显示弹窗
          this.dialogVisible = false
          return this.$message.success('修改成功')
        }
        
      })
    },
    async getUserByid(){
      const res = await request({
        url: `users/${this.id}`,
        method: 'get'
      }).then(res => {
        return res
      }).catch(error => {
        console.log(error)
        return false
      })
      if(res && res.meta.status != 200){
        return this.$message.error(`请求${this.id}用户数据失败`)
      } else {
        // 显示弹窗
        this.dialogVisible = true
        this.updateForm = res.data
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>