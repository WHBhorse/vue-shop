<template>
  <div class="box_del">
    <el-tooltip  effect="dark" content="删除" placement="top" :enterable="false">
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="dialogVisible = true"></el-button>
    </el-tooltip>
    <!-- 删除提醒弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="userDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'UserDel',
  props:['id'],
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    async userDel() {
      const res = await request({
        url: `users/${this.id}`,
        method: 'delete'
      }).then(res => {
        return res
      }).catch(error =>{
        console.log(error)
        return false
      })
      // 隐藏对话框
      this.dialogVisible = false
      if(res && res.meta.status != 200){
        return this.$message.error('删除失败')
      } else {
        // 更新页面
        this.$emit('updateDel')
        return this.$message.success('删除成功')
      }
    }
  },
}
</script>

<style lang="less" scope>
.box_del{
  margin: 0 10px;
}
</style>