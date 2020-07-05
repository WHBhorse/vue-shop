<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- Alter提示 -->
      <el-alert title="添加商品信息" type="info" center :closable="false" show-icon>
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center="">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页区域 --> 
      <el-form 
        :model="addForm" 
        :rules="addForRules" 
        ref="addFormRef"
        label-position="top">
        <el-tabs 
          v-model="activeIndex" 
          tab-position="left" 
          :before-leave="beforeTagLeave"
          @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader 
                v-model="addForm.goods_cat" 
                :options="catelist" 
                :props="catePtions"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单Item项 -->
            <el-form-item v-for="item in manyTagData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(val,i) in item.attr_vals" :key="i" :label="val" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTagData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 上传图片到后台的API地址 -->
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :headers="headersObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoods" class="addBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览窗口 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible">
      <img :src="previewPath" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'GoodsAdd',
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        // 商品所属分类数组
        goods_cat: [],
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: []
      },
      addForRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品类型', trigger: 'blur' }
        ]
      },
      // 商品分类数据
      catelist: [],
      catePtions:{
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 动态参数列表
      manyTagData: [],
      // 静态参数列表
      onlyTagData: [],
      uploadUrl: 'http://www.whbhorse.cn:8888/api/private/v1/upload',
      headersObj: {
        Authorization: window.sessionStorage.getItem('token') 
      },
      previewPath: '',
      previewVisible: false
    }
  },
  methods: {
    // 获取商品分类数据列表
    async getCateList() {
      const res = await request({
        url: 'categories',
        method: 'get'
      }).then(res => res)
      .catch(error => {
        console.log(error)
        return false
      })
      if(res && res.meta.status != 200){
        return this.$message.error('请求商品分类数据失败')
      }
      this.catelist = res.data
    },
    // 联机选择器选项发送变化，将触发这个方法
    handleChange() {
      if(this.addForm.goods_cat.length !== 3){
        this.addForm.goods_cat = []
      }
    },
    beforeTagLeave(activeName, oldActiveName) {
      // activeName 将要跳转的tag的name属性值
      // oldActiveName 将要离开的tag的name属性值
      if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
        this.$message.error('请先选择商品分类')
        return false
      }
      return true
    },
    tabClicked() {
      // 动态参数面板
      if(this.activeIndex === '1'){
        request({
          url: `categories/${this.cateId}/attributes`,
          method: 'get',
          params:{
            sel: 'many'
          }
        }).then(res => {
          res.data.forEach(item => {
            item.attr_vals= item.attr_vals.length === 0 ? [] : 
            item.attr_vals = item.attr_vals.split(',')
          })
          this.manyTagData = res.data
        }).catch(error => {
          console.log(error)
        })
      } else if(this.activeIndex === '2'){
        request({
          url: `categories/${this.cateId}/attributes`,
          method: 'get',
          params:{
            sel: 'only'
          }
        }).then(res => {
          this.onlyTagData = res.data
        }).catch(error => {
          console.log(error)
        })
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = 'http://www.whbhorse.cn:8888/' + file.response.data.tmp_path
      this.previewVisible = true
    },
    // 处理图片移除的操作
    handleRemove(file) {
      // console.log(file)
      // 1.获取将要删除的图片临时路径
      const filePath = file.response.data.tmp_path
      // 2.从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3.调用数组的splice方法，移除对应图片信息
      this.addForm.pics.splice(i, 1)
    },
    handleSuccess(res, file, fileList) {
      // 1.拼接得到一个图片信息对象
      const picInfo = {
        pic: res.data.tmp_path
      }
      // 2.将图片信息对象，push到this.addForm.pics中
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    addGoods() {
      // 表单的预验证
      this.$refs.addFormRef.validate(vaild => {
        if(!vaild) {
          return this.$message.error('请填写必要的表单项')
        }
        // 执行添加的逻辑
        // lodash cloneDeep(obj)
        let form = this.cloneDeep(this.addForm)
        // 处理from表单中的goods_cat
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTagData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTagData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        request({
          url: 'goods',
          method: 'post',
          data: form
        }).then(res => {
          if(res.meta.status != 201){
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.$router.push('/goods')
        }).catch(error => {
          console.log(error)
        })
      })
    },
    // 对象的深度拷贝
    cloneDeep(obj) {
      const result = Array.isArray(obj) ? [] : {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object' && obj[key]!==null) {
            result[key] = this.cloneDeep(obj[key]);   //递归复制
          } else {
            result[key] = obj[key];
          }
        }
      }
      return result
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId() {
      if(this.addForm.goods_cat.length === 3){
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb,
.el-alert,
.el-steps{
  margin-bottom: 15px; 
}
.el-checkbox{
  margin: 0 5px !important;
}
.addBtn{
  margin-top: 15px;
}
</style>