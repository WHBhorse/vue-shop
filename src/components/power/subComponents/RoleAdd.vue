<template>
  <div>
    <el-button type="primary" @click="dialogFormVisible = true">添加角色</el-button>
    <!-- 添加角色弹窗 -->
    <el-dialog 
      title="添加角色" 
      :visible.sync="dialogFormVisible">
      <el-form :model="roleForm" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'RoleAdd',
  data() {
    return {
      dialogFormVisible: false,
      roleForm: {
        roleName: '',
        roleDesc: ''
      }
    }
  },
  methods: {
    async addRole() {
      const res = await request({
        url: 'roles',
        method: 'post',
        data: this.roleForm
      }).then(res => {
        return res
      }).catch(error => {
        console.log(error)
        return false
      })
      if(res && res.meta.status != 201){
        return this.$message.error('创建角色失败')
      }
      this.$emit('addGetRoleList')
      this.dialogFormVisible = false
      return this.$message.success(res.meta.msg)
    }
  },
}
</script>

<style lang="less" scoped>
.el-button{
  margin-bottom: 15px;
}
</style>