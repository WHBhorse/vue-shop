import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)
// 导入并注册vue-table-with-tree-grid组件
import ZkTable from 'vue-table-with-tree-grid'
Vue.use(ZkTable)

// 全局过滤器
Vue.filter('timeHandler', (time) => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth()+1
  const day = date.getDay()+1
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
