<template>
  <div class="btn_inline">
    <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible = true">编辑</el-button>
    <!-- 修改参数弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form 
        :model="editForm" 
        label-width="100px"
        ref="editFormRef"
        :rules="editFormRules">
        <el-form-item :label="labelText" prop="attr_name">
          <el-input v-model="editForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttr">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'EditAttr',
  props: ['goodId','attrInfo','attrType'],
  data() {
    return {
      editForm: {
        attr_name: this.attrInfo.attr_name,
        attr_sel: this.attrType
      },
      editFormRules: {
        attr_name: [
          { required: true, message: `请输入${this.labelText}`, trigger: 'blur' }
        ]
      },
      dialogFormVisible: false
    }
  },
  methods: {
    editAttr() {
      this.$refs.editFormRef.validate((valid) => {
        if(!valid) return false
        request({
          url: `categories/${this.goodId}/attributes/${this.attrInfo.attr_id}`,
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
  },
  computed: {
    labelText() {
      if(this.attrType === 'many'){
        return '参数名称'
      }
      return '属性名称'
    },
    dialogTitle() {
      if(this.attrType === 'many'){
        return '动态参数修改'
      }
      return '静态属性修改'
    }
  }
}
</script>

<style lang="less" scoped>
.btn_inline{
  margin: 0 10px;
}
</style>