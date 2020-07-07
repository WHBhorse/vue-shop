<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import { request } from '@/network/request'

export default {
  name: 'Reports',
  data() {
    return {
      // 图表的配置项和数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {
  },
  // 此时，页面上的元素，已经渲染完毕
  mounted() {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    this.getOptionData(myChart)
  },
  methods: {
    // 获取报表所需数据
    getOptionData(myChart) {
      request({
        url: 'reports/type/1',
        method: 'get'
      }).then(res => {
        if(res.meta.status != 200){
          this.$message.error('获取折线图数据请求失败')
        }
        this.options = this.merge(this.options, res.data)
        // 4.使用刚指定的配置项和数据显示图表。
        myChart.setOption(this.options)
      })
    },
    // 深度合并对象
    merge(FirstOBJ, SecondOBJ) { 
      for (var key in SecondOBJ) {
        FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === "[object Object]" ?
          this.merge(FirstOBJ[key], SecondOBJ[key]) : FirstOBJ[key] = SecondOBJ[key];
      }
      return FirstOBJ;
    }
  }
}
</script>

<style lang="less" scope>
.el-breadcrumb{
  margin-bottom: 15px;
}
#main{
  width: 800px;
  height: 400px;
}
</style>