import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import { Toast } from 'vant'
import UserEdit from '../views/UserEdit.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register },
    { path: '/user', component: User, name: 'user' },
    { path: '/user_edit', component: UserEdit, name: 'user_edit' }
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

export default router
