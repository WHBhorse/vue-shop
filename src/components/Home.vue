<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="home_title">
        <img src="../assets/logo.png">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout" round>退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="togleCollapse">{{state}}</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse="isCollapse"
          :default-active="activePath"
          unique-opened
          :collapse-transition="false"
          router>
          <!-- :unique-opened="true"->只允许展开一个菜单 -->
          <!-- :collapse-transition="false" -> 关闭动画 -->
          <!-- router -> 导航开启路由模式 -->
          <!-- 一级菜单 -->
          <el-submenu :index="item.order+''" v-for="item in menuList" :key="item.id" >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subitem.path+''" v-for="subitem in item.children" :key="subitem.id" @click="saveNavState(''+subitem.path)">
              <i class="el-icon-menu"></i>
              <span>{{subitem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主要内容 -->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { request } from '../network/request'

export default {
  name: 'Home',
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 默认不折叠
      isCollapse: false,
      state: '展开',
      // 被激活导航地址
      activePath: ''
    }
  },
  methods: {
    logout() {
      //1.清除sessionStorage中的token
      window.sessionStorage.removeItem('token')
      //跳转到登入页面
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList() {
      const res = await request({
        url: 'menus',
        method: 'get'
      }).then(res => {
        // 将数据赋值给this.menuList
        this.menuList = res.data
        return res
      }).catch(error => {
        console.log(error)
        return false
      })
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
     
    },
    togleCollapse() {
      this.isCollapse = !this.isCollapse
      if(this.isCollapse){ 
        this.state = '收起'
      } else {
        this.state = '展开'
      }
    },
    // 保存连接的激活地址
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
}
</script>

<style scoped>
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
}
.el-aside{
  background-color: #333744;
  cursor: pointer;
}
.el-main{
  background-color: #eaedf1;
}
.home-container{
  height: 100%;
}
.home_title{
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
}
.home_title img{
  width: 60px;
  height: 60px;
}
.el-menu{
  border: 0px;
}
.toggle-button{
  text-align: center;
  color: #fff;
  font-size: 12px;
  line-height: 30px;
  background-color: #4a5064;
}
.el-submenu__title span{
  margin-left: 15px;
}
.el-button{
  margin: 0;
}
</style>