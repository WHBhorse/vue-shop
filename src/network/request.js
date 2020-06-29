// 封装axios网络模块
import axios from 'axios'
// 导入NProgress, 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const instace  = axios.create({
  baseURL: 'http://www.whbhorse.cn:8888/api/private/v1/',
  timeout: 5000
})
// request 拦截器
instace.interceptors.request.use(config => {
  NProgress.start()
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// response 拦截器
instace.interceptors.response.use(res => {
  NProgress.done()
  return res.data
})

export function request(config){
  //instace(config)返回的就是一个Promise对象
  return instace(config)
}

