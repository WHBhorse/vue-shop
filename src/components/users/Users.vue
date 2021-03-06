<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索框区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <div>
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList">
              <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <user-add :checkMethods="checkMethods" @getUsersList="getUsersList"></user-add>
        </el-col>
      </el-row>
      <!-- 用户数据列表展示区域 -->
       <el-table
        :data="usersList"
        style="width: 100%"
        border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 修改 -->
            <user-update class="btn_inline" :checkMethods="checkMethods" :id="scope.row.id" @updateTwo="getUsersList"></user-update>
            <!-- 删除 -->
            <user-del class="btn_inline" :id="scope.row.id" @updateDel="getUsersList"></user-del>
            <!-- 角色分配 -->
            <user-name class="btn_inline" :user="scope.row" @updateName="getUsersList"></user-name>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页内容 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { request } from '@/network/request'
const UserAdd = () => import('./subComponents/UserAdd.vue')
const UserDel = () => import('./subComponents/UserDel')
const UserUpdate = () => import('./subComponents/UserUpdate')
const UserName = () => import('./subComponents/UserName')

export default {
  name: 'Users',
  data() {
    return {
      queryInfo: {
        query: '',
        // 当前页码
        pagenum: 1,
        // 当前页码显示数据条数
        pagesize: 5
      },
      usersList: [],
      // 列表总条数
      total: 0,
      checkMethods: {
        // 自定义邮箱规则
        checkEmail(rule, value, callback) {
          const regEmail = /^\w+@\w+(\.\w+)+$/
          if (regEmail.test(value)) {
            // 合法邮箱
            return callback()
          }
          callback(new Error('请输入合法邮箱'))
        },
        // 自定义手机号规则
        checkMobile(rule, value, callback) {
          const regMobile = /^1[34578]\d{9}$/
          if (regMobile.test(value)) {
            return callback()
          }
          // 返回一个错误提示
          callback(new Error('请输入合法的手机号码'))
        }
      }
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    // 获取用户列表数据
    async getUsersList() {
      // 进行网络请求
      const res = await request({
        url: 'users',
        method: 'get',
        params: this.queryInfo
      }).then(res => {
        this.usersList = res.data.users
        this.total = res.data.total
        return res
      }).catch(error => {
        console.log(error)
        return false
      })
      if(res && res.meta.status != 200) return this.$message.error('用户列表数据请求失败')
    },
    // 修改用户状态
    async userStateChanged(user) {
      const res = await request({
        url: `users/${user.id}/state/${user.mg_state}`,
        method: 'put'
      }).then(res => {
        return res
      }).catch(error => {
        console.log(error)
        return false
      })
      if(res && res.meta.status != 200) {
        user.mg_state = !user.mg_state
        return this.$message.error('用户列表数据请求失败')
      } else {
        return this.$message.success(res.meta.msg)
      }
    },
    //监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    // 监听 current 改变的事件
    handleCurrentChange(newCurrent) {
      this.queryInfo.pagenum = newCurrent
      this.getUsersList()
    }
  },
  components: {
    UserAdd,
    UserDel,
    UserUpdate,
    UserName
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb,
.el-table,
.el-row{
  margin-bottom: 15px;
}
</style>