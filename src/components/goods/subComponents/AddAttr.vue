<template>
  <div>
    <el-button type="primary" size="mini" v-if="isMany" :disabled="disabledBtn" @click="dialogFormVisible = true">添加参数</el-button>
    <el-button type="primary" size="mini" v-else :disabled="disabledBtn" @click="dialogFormVisible = true">添加属性</el-button>
      <!-- 添加参数弹窗 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form 
        :model="addForm"
        :rules="addFormRules" 
        ref="addFormRef"
        label-width="100px">
        <el-form-item :label="labelText" prop="attr_name">
          <el-input v-model="addForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttr">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'AddAttr',
  props: ['attrType','goodId','disabledBtn'],
  data() {
    return {
      dialogFormVisible: false,
      addForm: {
        attr_name: '',
        attr_sel: this.attrType
      },
      dialogTitle: '添加参数',
      labelText: '动态参数',
      addFormRules: {
        attr_name: [
          { required: true, message: `请输入${this.labelText}`, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 添加sttr方法
    addAttr() {
      this.$refs.addFormRef.validate((valid) => {
        if(!valid) return false
        request({
          url: `categories/${this.goodId}/attributes`,
          method: 'post',
          data: this.addForm
        }).then(res => {
          if(res.meta.status != 201){
            return this.$message.error('创建失败')
          }
          this.dialogFormVisible = false
          this.$emit('addGetCateList')
          return this.$message.success(res.meta.msg)
        })
      })
    }
  },
  computed: {
    isMany() {
      if(this.attrType === 'many'){
        return true
      }
      this.labelText = "静态属性"
      this.dialogTitle = "添加属性"
      return false
    }
  }
}
</script>

<style lang="less" scoped>

</style>