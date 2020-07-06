<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索框区域 -->
      <div class="box_select">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <!-- 订单列表数据展示区域 -->
      <el-table
        :data="ordersList"
        border
        stripe
        style="width: 100%">
        <el-table-column type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="450px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" v-slot="scope">
          <el-tag type="danger" v-if="scope.row.pay_status == 0">未付款</el-tag>
          <el-tag type="success" v-else>已付款</el-tag>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" v-slot="scope">
          {{scope.row.create_time | timeHandler}}
        </el-table-column>
        <el-table-column label="操作" v-slot="scope">
          <!-- 查看地址 -->
          <location-orders :orderId="scope.row.order_id"></location-orders>
        </el-table-column>
      </el-table>
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
const LocationOrders = () => import('./subComponents/LocationOrders')

export default {
  name: 'Orders',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      ordersList: [],
      total: 0
    }
  },
  methods: {
    getOrdersList() {
      request({
        url: 'orders',
        method: 'get',
        params: this.queryInfo
      }).then(res => {
        if(res.meta.status != 200){
          return this.$message.error(res.meta.msg)
        }
        this.ordersList = res.data.goods
        this.total = res.data.total
      }).catch(error => {
        console.log(error)
      })
    },
    // 当 pagesize 发生变化时触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    // 当 pagenum 发送变化时触发
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrdersList()
    }
  },
  created() {
    this.getOrdersList()
  },
  components: {
    LocationOrders
  }
}
</script>

<style lang="less" scope>
.el-breadcrumb,
.box_select,
.el-table{
  margin-bottom: 15px;
}
.box_select{
  width: 500px;
}
</style>