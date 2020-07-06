<template>
  <div>
    <el-tooltip  effect="dark" content="角色分配" placement="top" :enterable="false">
      <el-button type="warning" icon="el-icon-setting" size="mini" @click="getRolesList"></el-button>
    </el-tooltip>
    
    <!-- 分配角色弹窗 -->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="当前用户" :label-width="formLabelWidth">
          <el-input v-model="form.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前角色" :label-width="formLabelWidth">
          <el-input v-model="form.role_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="分配新角色" :label-width="formLabelWidth">
          <el-select v-model="form.new_role_id" placeholder="请选择新的角色">
            <el-option v-for="role in rolesList" :label="role.roleName" :value="role.id" :key="role.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatedUserName">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'UserName',
  props:{
    user: Object
  },
  data() {
    return {
      form: {
        username: this.user.username,
        role_name: this.user.role_name,
        id: this.user.id,
        new_role_id: ''
      },
      dialogFormVisible: false,
      formLabelWidth: '90px',
      // 角色列表数据
      rolesList: [],
      // 角色id和name的map
      roleMap: new Map()
    }
  },
  methods: {
    // 获取角色列表数据
    async getRolesList() {
      const res = await request({
        url: 'roles',
        method: 'get'
      }).then(res => {
        return res
      }).catch(error => {
        console.log(error)
        return false
      })
      if(res && res.meta.status != 200){
        return this.$message.error('获取角色列表失败')
      } else {
        this.rolesList = res.data
        this.rolesList.forEach(role => {
          this.roleMap.set(role.id, role.roleName)
        });
        // 显示弹窗
        this.dialogFormVisible = true
      }
    },
    // 更新用户的角色
    async updatedUserName() {
      const res = await request({
        url: `users/${this.form.id}/role`,
        method: 'put',
        data: {
          rid: this.form.new_role_id
        }
      }).then(res => {
        return res
      }).catch(error => {
        console.log(error)
        return false
      })
      if(res && res.meta.status != 200){
        return this.$message.error(res.meta.msg)
      } else {
        this.$emit('updateName')
        // 隐藏弹窗
        this.dialogFormVisible = false
        // 更新form中的角色名称
        this.form.role_name = this.roleMap.get(this.form.new_role_id)
        return this.$message.success(res.meta.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>