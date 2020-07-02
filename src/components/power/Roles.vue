<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 添加角色功能组件 -->
      <role-add @addGetRoleList="getRoleList"></role-add>
      <el-table
        :data="roleList"
        border
        style="width: 100%">
        <el-table-column type="expand">
          <template v-slot="props">
            <!-- 自定义角色权限UI -->
            <role-expand :roleList="props"></role-expand>
          </template>
        </el-table-column>
        <el-table-column
          label="#"
          type="index"
          label-width="50px">
        </el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName">
        </el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc">
        </el-table-column>
        <el-table-column
          label="操作"
          v-slot="scope">
          <!-- 编辑 -->
          <modify-roles class="btn_inline" :role-prop="scope.row" @midifyGetRoleList="getRoleList"></modify-roles>
          <!-- 删除 -->
          <el-button class="btn_del" type="danger" icon="el-icon-delete" size="small" @click="removeRole(scope.row.id)">删除</el-button>
          <!-- 分配权限 -->
          <set-rights class="btn_inline" :role-row="scope.row" @getRoleList="getRoleList"></set-rights>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { request } from '@/network/request'
const RoleAdd = () => import('./subComponents/RoleAdd')
const RoleExpand = () => import('./subComponents/RoleExpand')
const SetRights = () => import('./subComponents/SetRights')
const ModifyRoles = () => import('./subComponents/ModifyRoles')

export default {
  name: 'Roles',
  data() {
    return {
      roleList: []
    }
  },
  methods: {
    async getRoleList() {
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
        return this.$message.error('请求角色权限数据失败')
      } else {
        this.roleList = res.data
      }
    },
    async removeRole(roleId){
      const res = await request({
        url: `roles/${roleId}`,
        method: 'delete'
      })
      .then(res => res)
      .catch(error => {
        console.log(error)
        return false
      })
      if(res && res.meta.status != 200){
        return this.$message.error('删除失败')
      }
      // 更新角色列表数据
      this.getRoleList()
      return this.$message.success(res.meta.msg)
    }
  },
  created() {
    this.getRoleList()
  },
  components: {
    RoleAdd,
    RoleExpand,
    SetRights,
    ModifyRoles
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb{
  margin-bottom: 15px;
}
.btn_del{
  margin: 0 10px;
}
</style>