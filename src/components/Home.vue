<template>
  <div class="home">
    Home组件
    <el-button type="info" @click="logout" round>退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout() {
      //1.清除sessionStorage中的token
      window.sessionStorage.removeItem('token')
      //跳转到登入页面
      this.$router.push('/login')
    }
  },
}
</script>

<style scoped>

</style>