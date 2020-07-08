<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索框区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <div>
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <!-- 添加商品 -->
          <router-link to="/goods/add">
            <el-button type="primary">添加商品</el-button>
          </router-link>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="goodsList"
        style="width: 100%"
        border>
        <el-table-column type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" :width="label_width1"></el-table-column>
        <el-table-column prop="goods_weight" label="重量" :width="label_width1"></el-table-column>
        <el-table-column v-slot="scope" label="创建时间" :width="label_width2">{{scope.row.add_time | timeHandler}}</el-table-column>
        <el-table-column v-slot="scope" label="操作" :width="label_width2">
          <!-- 删除 -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGood(scope.row.goods_id)"></el-button>
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

export default {
  name: 'Goods',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 商品列表数据
      goodsList: [],
      total: 0,
      label_width1: '120px',
      label_width2: '150px'
    }
  },
  methods: {
    // 获取商品的数据
    async getGoodsList() {
      const res = await request({
        url: 'goods',
        method: 'get',
        params: this.queryInfo
      }).then(res => res)
      .catch(error => {
        console.log(error)
        return false
      })
      if(res && res.meta.status != 200){
        return this.$message.error('获取失败')
      }
      this.goodsList =  res.data.goods
      this.total = res.data.total
    },
    // 根据商品id删除商品
    removeGood(goodsId){
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await request({
          url: `goods/${goodsId}`,
          method: 'delete'
        }).then(res => res)
        .catch(error => {
          console.log(error)
          return false
        })
        if(res && res.meta.status != 200){
          return this.$message.error('删除失败')
        }
        this.getGoodsList()
        return this.$message.success(res.meta.msg)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })       
      })
    },
    //监听 pagesize 改变的事件
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize =newPageSize
      this.getGoodsList() 
    },
    // 监听 current 改变的事件
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodsList()
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scope>
.el-breadcrumb,
.el-table,
.el-row{
  margin-bottom: 15px;
}
</style>