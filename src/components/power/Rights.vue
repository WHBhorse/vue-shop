<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-table
        :data="rightList"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称">
        </el-table-column>
        <el-table-column
          prop="path"
          label="权限路径">
        </el-table-column>
        <el-table-column
          v-slot="scope"
          label="权限等级">
          <el-tag :type="tagTypeObj[scope.row.level]">{{tagNameObj[scope.row.level]}}</el-tag>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'Rights',
  data() {
    return {
      // 权限列表数据
      rightList: [],
      tagTypeObj: {
        0: '',
        1: 'success',
        2: 'warning'
      },
      tagNameObj: {
        0: '一级',
        1: '二级',
        2: '三级'
      }
    }
  },
  methods: {
    async getRigthList() {
      const res = await request({
        url: `rights/list`,
        method: 'get'
      }).then(res => {
        return res
      }).catch(error => {
        console.log(error)
        return false
      })
      if(res && res.meta.status != 200){
        return this.$message.error('获取权限列表数据失败')
      } else {
        this.rightList = res.data
      }
    }
  },
  created() {
    this.getRigthList()
  },
}
</script>

<style lang="less" scoped>
.el-breadcrumb{
  margin-bottom: 15px;
}
</style>