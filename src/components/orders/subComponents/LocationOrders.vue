<template>
  <div class="btn_inline">
    <el-button type="success" icon="el-icon-location" size="mini" @click="showDialog"></el-button>
    <!-- 物流信息对话框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="dialogVisible"
      width="50%">
      <!-- 物流时间线 -->
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(item, index) in progressInfo"
          :key="index"
          :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'LocationOrders',
  props: ['orderId'],
  data() {
    return {
      dialogVisible: false,
      progressInfo: []
    }
  },
  methods: {
    showDialog() {
      request({
        url: 'kuaidi/1106975712662',
        method: 'get'
      }).then(res => {
        if(res.meta.status != 200){
          return this.$message.error('请求失败')
        }
        this.progressInfo = res.data
      })
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>

</style>