import Vue from 'vue'
import App from './App.vue'
import router from './router'
import hmheader from './components/HmHeader.vue'
import hmlogo from './components/HmLogo.vue'
import hmnavbar from './components/HmNavBar.vue'
// 导入axios
import axios from 'axios'

// 按需导入vant
import { Button, Field, Form, Toast } from 'vant'
// 该库会自动给html设置font-size
import 'amfe-flexible'

// 导入css文件
import './style/common.less'
import './style/iconfont.less'

Vue.config.productionTip = false

// 使用vant导入的组件
Vue.use(Button)
Vue.use(Field)
Vue.use(Form)
Vue.use(Toast)

// 定义全局组件
Vue.component('hm-header', hmheader)
Vue.component('hm-logo', hmlogo)
Vue.component('hm-navbar', hmnavbar)
// 优化axios：将axios绑定到vue原型上
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://localhost:3000'
// 路由拦截
axios.interceptors.request.use(config => {
  // 在每次发送请求时在请求头上添加token
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})
axios.interceptors.response.use(res => {
  // 每次响应结果先判断一次
  const { statusCode, message } = res.data
  if (statusCode === 401 && message === '用户信息验证失败') {
    router.push('/login')
    Toast.fail(message)
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
  }
  return res
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
