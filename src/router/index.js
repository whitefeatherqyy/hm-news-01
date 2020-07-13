import Vue from 'vue'
import VueRouter from 'vue-router'
import { Toast } from 'vant'
// 路由懒加载 异步组件 按模块打包
const Login = () => import(/* webpackChunkName:'login' */ '../views/Login.vue')
const Register = () =>
  import(/* webpackChunkName:'login' */ '../views/Register.vue')
const User = () => import(/* webpackChunkName:'users' */ '../views/User.vue')
const Myfollow = () =>
  import(/* webpackChunkName:'users' */ '../views/Myfollow.vue')
const UserEdit = () =>
  import(/* webpackChunkName:'users' */ '../views/UserEdit.vue')
const Mycomment = () =>
  import(/* webpackChunkName:'users' */ '../views/Mycomment.vue')
const Mystar = () =>
  import(/* webpackChunkName:'users' */ '../views/MyStar.vue')
const Home = () => import(/* webpackChunkName:'home' */ '../views/Home.vue')
const PostDetail = () =>
  import(/* webpackChunkName:'home' */ '../views/PostDetail.vue')
const Manage = () => import(/* webpackChunkName:'home' */ '../views/Manage.vue')
const Search = () => import(/* webpackChunkName:'home' */ '../views/Search.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register },
    { path: '/user', component: User, name: 'user' },
    { path: '/user_edit', component: UserEdit, name: 'user_edit' },
    { path: '/myfollow', component: Myfollow, name: 'myfollow' },
    { path: '/mycomment', component: Mycomment },
    { path: '/mystar', component: Mystar },
    { path: '/', component: Home },
    { path: '/detail/:id', component: PostDetail, name: 'detail' },
    { path: '/manage', component: Manage },
    { path: '/search', component: Search }
  ]
})
const pathname = ['/user', '/user_edit']
// 使用导航守卫，拦截访问
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (pathname.includes(to.path)) {
    if (token) {
      next()
    } else {
      Toast('未登陆')
      router.push('/login')
    }
  } else {
    next()
  }
})
// 解决路由重复跳转同一页面的报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
