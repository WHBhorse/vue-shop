import Vue from 'vue'
import Router from 'vue-router'
// 路由懒加载
const Login = () => import('./components/Login.vue')
const Home = () => import('./components/Home.vue')
const Welcome = () => import('./components/Welcome.vue')
const Users = () => import('./components/users/Users.vue')
const Roles = () => import('./components/power/Roles.vue')
const Rights = () => import('./components/power/Rights.vue')
const Goods = ()  => import('./components/goods/Goods.vue')
const Params = () => import('./components/goods/Params.vue')
const Categories = () => import('./components/goods/Categories.vue')
const GoodsAdd = () => import('./components/goods/subComponents/GoodsAdd.vue')
Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },{
      path: '/home',  
      component: Home,
      redirect: '/welcome',
      children:[
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights },
        { path: '/params', component: Params },
        { path: '/categories', component: Categories },
        { path: '/goods', component: Goods },
        { path: '/goods/add', component: GoodsAdd }
      ]
    }
  ],
  mode: 'history'
})
//为路由对象,添加beforeEach导航守卫
router.beforeEach((to, from, next) => {
  //如果用户访问的是登入页面直接放行
  if(to.path === '/login') return next()
  //从sessionStorage中获取到保存的token值
  const tokenStr = window.sessionStorage.getItem('token')
  //如果没有token强制跳转到登入页面
  if(!tokenStr) return next('/login')
  next()
})

export default router
