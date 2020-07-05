<template>
  <div class="btn_inline">
    <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogVisible = true"></el-button>
    <!-- 修改弹窗 -->
    <el-dialog
      title="商品修改"
      :visible.sync="dialogVisible">
      <!-- form表单 -->
      <el-form 
        :model="editForm" 
        :rules="editForRules" 
        ref="editFormRef"
        label-position="top">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editForm.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight" type="number"></el-input>
        </el-form-item>
        <!-- 商品参数 -->
        <el-form-item v-for="item in manyTagData" :key="item.attr_id" :label="item.attr_name">
          <el-checkbox-group v-model="item.attr_vals">
            <el-checkbox v-for="(val,i) in item.attr_vals" :key="i" :label="val" border></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- 商品属性 -->
        <el-form-item v-for="item in onlyTagData" :key="item.attr_id" :label="item.attr_name">
          <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
        <!-- 商品图片 -->
        <el-upload
          class="upload-demo"
          :action="uploadUrl"
          :headers="headersObj"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <span>上传图片</span>
        </el-upload>
        <!-- 商品内容 -->
        <!-- 富文本编辑器组件 -->
        <quill-editor v-model="editForm.goods_introduce"></quill-editor>
        <!-- 图片预览窗口 -->
        <el-dialog
          title="图片预览"
          :visible.sync="previewVisible">
          <img :src="previewPath" alt="">
        </el-dialog>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPut">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'GoodsEdit',
  props: {
    goodsId: Number
  },
  data() {
    return {
      dialogVisible: false,
      goodsInfo: {},
      // form表单数据
      editForm: {
        goods_name: '', 
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: []
      },
      // 验证规则对象
      editForRules: {
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
        ]
      },
      // 商品分类数据
      catelist: [],
      // 动态参数列表
      manyTagData: [],
      // 静态参数列表
      onlyTagData: [],
      catePtions:{
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      uploadUrl: 'http://www.whbhorse.cn:8888/api/private/v1/upload',
      headersObj: {
        Authorization: window.sessionStorage.getItem('token') 
      },
      previewPath: '',
      previewVisible: false
    }
  },
  created() {
    this.getGoodsInfo(this.goodsId)
    this.getManyAndOnly()
  },
  methods: {
    // 更具id查询商品
    getGoodsInfo(goodsID){
      request({
        rul: `goods/${goodsID}`,
        method: 'get'
      }).then(res => {
        if(res.meta.status != 201){
          return this.$message.error(res.meat.msg)
        }
        this.goodsInfo = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    // 获取动态参数和静态属性
    getManyAndOnly() {
      if(this.goodsInfo.attrs){
        this.goodsInfo.attrs.forEach(item => {
          if(item.attr_sel === 'many'){
            const newInfo = {
              attr_id: item.attr_id,
              attr_name: item.attr_name
            }
            this.manyTagData.push(newInfo)
          } else if(item.attr_sel === 'only'){
            const newInfo = {
              attr_id: item.attr_id,
              attr_name: item.attr_name,
              attr_vals: item.attr_vals
            }
            this.manyTagData.push(newInfo)
          }
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
    // 图片上传成功钩子函数
    handleSuccess(res, file, fileList) {
      // 1.拼接得到一个图片信息对象
      const picInfo = {
        pic: res.data.tmp_path
      }
      // 2.将图片信息对象，push到this.addForm.pics中
      this.addForm.pics.push(picInfo)
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
    },
    editPut() {
      request({
        rul: `goods/${this.goodsId}`,
        method: 'put',
        data: this.editForm
      }).then(res => {
        if(res.meta.status != 201){
          return this.$message.error(res.meta.msg)
        }
        this.dialogVisible = false
        return this.$message.success(res.meta.msg)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.btn_inline{
  margin: 0 10px;
}
.el-checkbox{
  margin: 0 5px !important;
}
</style>