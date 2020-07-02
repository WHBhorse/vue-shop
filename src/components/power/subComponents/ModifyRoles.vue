<template>
  <div>
    <el-button type="primary" icon="el-icon-edit" size="small" @click="dialogFormVisible = true">修改</el-button>
    <!-- 修改角色弹窗 -->
    <el-dialog 
      title="添加角色" 
      :visible.sync="dialogFormVisible">
      <el-form :model="modifyForm" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="modifyForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="modifyForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'ModifyRoles',
  props:{
    roleProp: Object
  },
  data() {
    return {
      dialogFormVisible: false,
      modifyForm: {
        roleName: this.roleProp.roleName,
        roleDesc: this.roleProp.roleDesc
      }
    }
  },
  methods: {
    async modifyRole(){
      const res = await request({
        url: `roles/${this.roleProp.id}`,
        method: 'put',
        data: this.modifyForm
      }).then(res => res)
      .catch(error => {
        console.log(error)
        return false
      })
      if(res && res.meta.status != 200){
        return this.$message.error('修改角色失败')
      }
      this.dialogFormVisible = false
      this.$emit('midifyGetRoleList')
      return this.$message.success('修改成功')
    }
  },
}
</script>

<style lang="less" scoped>

</style>