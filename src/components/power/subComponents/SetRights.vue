<template>
  <div>
    <el-button 
      type="warning" 
      icon="el-icon-setting" 
      size="small"
      @click="showSetRightsDialog">角色分配</el-button>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="dialogVisible"
      width="30%">
      <!-- 树状控件 -->
      <el-tree
        :data="rigthsList"
        :props="treeProps"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'SetRights',
  props: {
    roleRow: Object
  },
  data() {
    return {
      dialogVisible: false,
      rigthsList: [],
      treeProps:{
        children: 'children',
        label: 'authName'
      },
      defkeys: [],
      role: this.roleRow
    }
  },
  methods: {
    async showSetRightsDialog() {
      //获取所有权限数据 
      const res = await request({
        url: `rights/tree`,
        method: 'get'
      }).then(res => {
        return res
      }).catch(error => {
        console.log(error)
        return false
      })
      if(res && res.meta.status != 200){
        return this.$message.error('获取权限数据失败')
      }
      this.rigthsList = res.data
      // 获取当前角色三级权限id
      this.getDefkeys(this.role, this.defkeys)
      this.dialogVisible = true
    },
    // 递归获取当前角色的所有三级权限id
    getDefkeys(node, arr){
      // 判断是否是第三级权限
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        return this.getDefkeys(item, arr)
      })
    },
    // 点击为角色分配权限
    async allotRights() {
      this.defkeys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 拼接成字符串
      const rids = this.defkeys.join(',')
      // 进行网络请求
      const res = await request({
        rul: `roles/${this.role.id}/rights`,
        method: 'post',
        data: {
          rids
        }
      }).then(res => {
        return res
      }).catch(error => {
        console.log(error)
        return false
      })
      // 清空defkeys
      this.defkeys = []
      if(res && res.meta.status != 200){
        return this.$message.error('更新失败')
      }
      this.$emit('getRoleList')
      return this.$message.success(res.meta.msg)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>