import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import Myfollow from '../views/Myfollow.vue'
import { Toast } from 'vant'
import UserEdit from '../views/UserEdit.vue'
import Mycomment from '../views/Mycomment.vue'
import Mystar from '../views/MyStar.vue'
import Home from '../views/Home.vue'
import PostDetail from '../views/PostDetail.vue'
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
    { path: '/detail/:id', component: PostDetail, name: 'detail' }
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
