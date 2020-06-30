<template>
  <div class="welcome_container">
    Welcome
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