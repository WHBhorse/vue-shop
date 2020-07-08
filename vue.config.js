const path = require('path')
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  // 配置路径别名
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'))
    config.set('externals', {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      axios: 'axios',
      echarts: 'echarts',
      nporgress: 'NProgress',
      'vue-quill-editor': 'VueQuillEditor'
    })
  }
}