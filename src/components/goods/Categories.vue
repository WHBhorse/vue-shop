<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 添加分类 -->
      <!-- <el-button type="primary">添加分类</el-button> -->
      <add-cate @addGetCateList="getCateList"></add-cate>
      <!-- 表格 -->
      <zk-table
        index-text="#"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border>
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-error" style="color: red" v-if="scope.row.cat_deleted"></i>
          <i class="el-icon-success" style="color: lightgreen" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <!-- 修改 -->
          <edit-cate :cateObj="scope.row" @editGetCateList="getCateList"></edit-cate>
          <!-- 删除 -->
          <el-button icon="el-icon-delete" type="danger" size="mini" @click="removeCate(scope.row.cat_id)">删除</el-button>
        </template>
      </zk-table>
      <!-- 分页区域 -->
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
const AddCate = () => import('./subComponents/AddCate')
const EditCate = ()=> import('./subComponents/EditCate')

export default {
  name: 'Categories',
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: [1,2,3],
        pagenum: 1,
        pagesize: 5
      },
      treeProps: {
        children: 'children',
        hasChildren: 'hasChildren'
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          // 当前列定义为模板列
          type: 'template',
          // 表示这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      total: 0
    }
  },
  methods: {
    getCateList() {
      request({
        url: 'categories',
        method: 'get',
        params: this.queryInfo
      }).then(res => {
        if(res.meta.status != 200){
          return this.$message.error('请求商品分类数据失败')
        }
        this.total = res.data.total
        this.cateList = res.data.result
      }).catch(error => {
        console.log(error)
      })
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 根据分类id删除分类
    removeCate(cateId) {
      request({
        url: `categories/${cateId}`,
        method: 'delete'
      }).then(res => {
        if(res.meta.status != 200){
          return this.$message.error('删除失败')
        }
        this.getCateList()
        return this.$message.success('删除成功')
      })
    }
  },
  created() {
    this.getCateList()
  },
  components: {
    EditCate,
    AddCate
  }
}
</script>

<style lang="less" scope>
.el-breadcrumb,
.zk-table{
  margin-bottom: 15px;
}

</style>