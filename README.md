#### 登录业务流程

##### 登录页面的布局

通过Element-UI组件实现布局

- el-form
- el-form-item
- el-input
- el-button
- 字体图标

##### 创建git分支

```
// 创建并切换登录分支
git checkout -b login

// login分支合并到主分支
// 1.切换到master分支
git checkout master
// 2.合并分支到master
git merge login

// 将本地login子分支推送到github
git push -u origin login
```

##### 路由导航守卫控制访问权限

> 如果用户没有登录,但是直接通过URL访问特定页面,需要重新导航到登录页面

```js
//为路由对象,添加beforeEach导航守卫
router.beforeEach((to,from,next) => {
    //如果用户访问的登录页,直接放行
    if (to.path === '/login') return next()
    //从sessionStorage中获取到保存的token值
    const tokenStr = window.sessionStorage.getItem('token')
    //如果没有token,强制跳转到登录页
    if(!tokenStr) return next('/login')
    next()
})
```
