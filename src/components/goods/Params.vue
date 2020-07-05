<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 警告 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <!-- 联级选择器 -->
      <span class="demonstration">选择商品分类：</span>
      <el-cascader
        v-model="goodsCat"
        :options="cataList"
        :props="cateProps"
        @change="handleChange"></el-cascader>
        <!-- 标签页 -->
        <el-tabs v-model="activeIndex">
          <el-tab-pane label="动态参数" name="many">
            <add-attr :good-id="goodID" attrType="many" :disabled-btn="disabledBtn" @addGetCateList="updateAttr('many')"></add-attr>
            <!-- 渲染动态参数表格 -->
            <el-table
              :data="manyListData"
              style="width: 100%"
              border>
              <el-table-column type="expand" v-slot="scope">
                <el-tag
                  :key="i"
                  v-for="(tag,i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(i, scope.row)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </el-table-column>
              <el-table-column
                type="index"
                label="#">
              </el-table-column>
              <el-table-column
                prop="attr_name"
                label="参数名称">
              </el-table-column>
              <el-table-column label="操作" v-slot="scope">
                <!-- 编辑 -->
                <edit-attr :goodId="goodID" attrType="many" :attrInfo="scope.row" @editGetCateList="updateAttr('many')"></edit-attr>
                <!-- 删除 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAttr(scope.row.attr_id, 'many')">删除</el-button>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <add-attr :good-id="goodID" attrType="only" :disabled-btn="disabledBtn" @addGetCateList="updateAttr('only')"></add-attr>
            <!-- 渲染静态属性表格 -->
            <el-table
              :data="onlyListData"
              style="width: 100%"
              border>
              <el-table-column type="expand" v-slot="scope">
                <el-tag
                  :key="i"
                  v-for="(tag,i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(i, scope.row)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </el-table-column>
              <el-table-column
                type="index"
                label="#">
              </el-table-column>
              <el-table-column
                prop="attr_name"
                label="参数名称">
              </el-table-column>
              <el-table-column label="操作" v-slot="scope">
                <!-- 编辑 -->
                <edit-attr :goodId="goodID" attrType="only" :attrInfo="scope.row"  @editGetCateList="updateAttr('only')"></edit-attr>
                <!-- 删除 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAttr(scope.row.attr_id, 'only')">删除</el-button>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { request } from '@/network/request'
const AddAttr = () => import('./subComponents/AddAttr')
const EditAttr = () => import('./subComponents/EditAttr')

export default {
  name: 'Params',
  data() {
    return {
      cataList: [],
      cateProps: {
        value: 'cat_id',
        children: 'children',
        label: 'cat_name',
        expandTrigger: 'hover' 
      },
      goodsCat: [],
      activeIndex: 'many',
      // 动态参数数据
      manyListData: [],
      // 静态属性数据
      onlyListData: [],
      // 按钮禁用状态
      disabledBtn: true,
      // 添加参数类型
      attrType: 'many',
    }
  },
  methods: {
    getCateList() {
      request({
        url: 'categories',
        method: 'get'
      }).then(res => {
        if(res.meta.status != 200){
          return this.$message.error(res.meta.msg)
        }
        this.cataList = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    // 更新manyListData和onlyListData的值
    updateAttr(type) {
      if(type === 'many'){
        this.getManyList()
      } 
      this.getOnlyList()
    },
    // 当联级选项发生变化时触发
    handleChange() {
      if(this.goodsCat.length !== 3){
        this.disabledBtn = true
        this.manyListData = []
        this.onlyListData = []
        return this.goodsCat = []
      }
      this.disabledBtn = false
      this.getManyList()
      this.getOnlyList()
    },
    // 获取当前分类id的动态参数列表
    getManyList(){
      request({
        url: `categories/${this.goodID}/attributes`,
        method: 'get',
        params: {
          sel: 'many'
        }
      }).then(res => {
        if(res && res.meta.status != 200){
          return this.$message.error('获取失败')
        }
        // 使用 split 拆分attr_vals字符串
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(',')
          item.inputVisible = false
          item.inputValue = ''
        })
        this.manyListData = res.data
        // console.log(this.manyListData)
      }).catch(error => {
        console.log(error)
      })
    },
    // 获取当前分类id的静态属性列表
    getOnlyList() {
      request({
        url: `categories/${this.goodID}/attributes`,
        method: 'get',
        params: {
          sel: 'only'
        }
      }).then(res => {
        if(res && res.meta.status != 200){
          return this.$message.error('获取失败')
        }
        // 使用 split 拆分attr_vals字符串
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(',')
          item.inputVisible = false
          item.inputValue = ''
        })
        this.onlyListData = res.data
        // console.log(this.onlyListData)
      }).catch(error => {
        console.log(error)
      })
    },
    /* 动态编辑标签有关方法 */
    // 点击按钮点击事件
    showInput(item) {
      item.inputVisible = true
      // 当页面的被重新渲染后，才回指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 添加标签事件
    handleInputConfirm(item) {
      let inputValue = item.inputValue
      if (inputValue) {
        item.attr_vals.push(inputValue)
      }
      item.inputVisible = false
      item.inputValue = ''
      // 发起请求保存这次操作
      this.editAttrVals(item)
    },
    // 删除标签钩子函数
    handleClose(i, item) {
      item.attr_vals.splice(i, 1)
      // 发起请求保存这次操作
      this.editAttrVals(item)
    },
    // 修改参数方法
    editAttrVals(attr){
      const attr_valsStr = attr.attr_vals.join(',')
      request({
        url: `categories/${this.goodID}/attributes/${attr.attr_id}`,
        method: 'put',
        data: {
          attr_name: attr.attr_name,
          attr_sel: attr.attr_sel,
          attr_vals: attr_valsStr
        }
      }).then(res => {
        if(res && res.meta.status != 200){
          return this.$message.error('更新参数失败')
        }
        return this.$message.success('修改参数成功')
      }).catch(error => {
        console.log(error)
      })
    },
    // 根据参数id删除参数
    removeAttr(attrId, type) {
      request({
        url: `categories/${this.goodID}/attributes/${attrId}`,
        method: 'delete'
      }).then(res => {
        if(res.meta.status != 200){
          return this.$message.error('删除失败')
        }
        this.updateAttr(type)
        return this.$message.success(res.meta.msg)
      })
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    goodID() {
      if(this.goodsCat.length === 3){
        return this.goodsCat[2]
      }
      return null
    }
  },
  components: {
    AddAttr,
    EditAttr
  }
}
</script>

<style lang="less" scope>
.el-alert,
.el-cascader,
.el-breadcrumb{
  margin-bottom: 15px;
}
.el-table{
  margin-top: 15px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>