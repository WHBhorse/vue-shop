<template>
  <div class="welcome_container">
    <h2>欢迎大家访问我的个人博客</h2>
    <p><a href="http://www.whbhorse.cn/">http://www.whbhorse.cn</a></p>
  </div>
</template>

<script>
export default {
  name: 'Welcome'
}
</script>

<style lang="less" scoped>
/* 
  lang="less" 支持less格式
  scoped vue的指令，只在当前组件生效
*/
.welcome_container{
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
</style>