<template>
  <div class="add-cate">
    <el-button type="primary" @click="dialogVisible = true">添加分类</el-button>
    <!-- 添加弹窗 -->
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
      width="50%">
      <!-- form表单 -->
      <el-form 
      :model="addForm" 
      :rules="addFormRules" 
      ref="addFormRef"
      label-width="80px">
        <el-form-item label="活动名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <!-- 联级表单 -->
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cateProps"
            @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'AddCate',
  data() {
    return {
      parentCateList: [],
      dialogVisible: false,
      addForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 1
      },
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      cateProps: { 
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选择父级分类的id数组
      selectedKeys: []
    }
  },
  methods: {
    // 联级选择器选项发生变化时触发此事件
    handleChange() {
      // console.log(this.selectedKeys)
      const len = this.selectedKeys.length
      if(len > 0) {
        this.addForm.cat_level = 2
        this.addForm.cat_pid = this.selectedKeys[len - 1]
      } else {
        this.addForm.cat_level = 0
      }
    },
    // 获取分类数据
    getParentCateList() {
      request({
        url: 'categories',
        method: 'get',
        params: {
          type: 2
        }
      }).then(res => {
        if(res.meta.status != 200){
          return this.$message.error('获取父级分类数据失败')
        }
        this.parentCateList = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    addCate() {
      this.$refs.addFormRef.validate(valid => {
        if(!valid) return false
        request({
          url: 'categories',
          method: 'post',
          data: this.addForm
        }).then(res => {
          if(res.meta.status != 201){
            return this.$message.error('添加失败')
          }
          this.dialogVisible = false
          this.$emit('addGetCateList')
          return this.$message.success('添加成功')
        })
      })
    }
  },
  created() {
    this.getParentCateList()
  }
}
</script>

<style lang="less" scoped>
.add-cate{
  margin-bottom: 15px;
}
.el-cascader{
  width: 100%
}
</style>