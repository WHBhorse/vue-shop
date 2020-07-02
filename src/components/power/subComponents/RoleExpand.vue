<template>
  <div>
    <el-row 
      :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'venter']" 
      v-for="(item, i1) in roleListPorp.row.children" 
      :key="item.id">
      <!-- 渲染一级权限 -->
      <el-col :span="5">
        <el-tag 
        closable
        @close="removeRightById(roleListPorp.row, item.id)">{{item.authName}}</el-tag>
        <i class="el-icon-caret-right"></i>
      </el-col>
      <!-- 渲染二级和三级权限 -->
      <el-col :span="19">
        <!-- 二级权限 -->
        <el-row :class="[i2 === 0 ? '' : 'bdtop', 'venter']" v-for="(subitem, i2) in item.children" :key="subitem.id">
          <el-col :span="6" class="venter">
            <el-tag 
            type="success" 
            closable
            @close="removeRightById(roleListPorp.row, subitem.id)">
              {{subitem.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
          </el-col>
          <!-- 三级权限 -->
          <el-col :span="18">
            <el-tag 
              v-for="(subitem2) in subitem.children" 
              :key="subitem2.id" 
              type="warning"
              closable
              @close="removeRightById(roleListPorp.row, subitem2.id)">
                {{subitem2.authName}}
              </el-tag>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'RoleExpand',
  props: {
    roleList: Object
  },
  data() {
    return {
      roleListPorp: this.roleList
    }
  },
  methods: {
    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      // 弹窗提示用户是否删除
      const congirmResult = await this.$confirm('此操作将删除改权限', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if(congirmResult !== 'confirm'){
        return this.$message.info('取消了删除')
      }
      // console.log('确认了删除')
      const res = await request({
        url: `roles/${role.id}/rights/${rightId}`,
        method: 'delete'
      }).then(res => {
        return res
      }).catch(error => {
        console.log(error)
        return false
      })
      if(res && res.meta.status != 200){
        return this.$message.error('取消权限失败')
      }
      this.updateRoles(role, res.data)
      return this.$message.success(res.meta.msg)
    },
    // 更新数据的方法
    updateRoles(role ,newdata){
      role.children = newdata
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.venter{
  display: flex;
  align-items: center;
}
</style>