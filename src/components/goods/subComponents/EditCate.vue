<template>
  <div class="edit-cate">
    <el-button icon="el-icon-edit" type="primary" size="mini" @click="dialogFormVisible = true">修改</el-button>
    <!-- 添加弹窗 -->
    <el-dialog title="修改分类" :visible.sync="dialogFormVisible">
      <el-form 
        :model="editForm" 
        ref="editFormRef" 
        :rules="editFormRuls">  
        <el-form-item label="活动名称" label-width="80px">
          <el-input v-model="editForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'EditCate',
  props: ['cateObj'],
  data() {
    return {
      editForm: {
        cat_name: this.cateObj.cat_name
      },
      editFormRuls: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false
    }
  },
  methods: {
    editCate(){
      this.$refs.editFormRef.validate(valid => {
        if(!valid) return false
          request({
          url: `categories/${this.cateObj.cat_id}`,
          method: 'put',
          data: this.editForm
        }).then(res => {
          if(res.meta.status != 200){
            return this.$message.error('修改失败')
          }
          this.dialogFormVisible = false
          this.$emit('editGetCateList')
          return this.$message.success(res.meta.msg)
        }).catch(error => {
          console.log(error)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.edit-cate{
  margin: 0 10px;
}
</style>