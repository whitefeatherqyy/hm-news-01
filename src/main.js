import Vue from 'vue'
import App from './App.vue'
import router from './router'
import hmheader from './components/HmHeader.vue'
import hmlogo from './components/HmLogo.vue'
import hmnavbar from './components/HmNavBar.vue'
import hmpost from './components/HmPost.vue'
// 导入axios
import axios from 'axios'
// 按需导入vant
import {
  Button,
  Field,
  Form,
  Toast,
  Dialog,
  Cell,
  CellGroup,
  Radio,
  RadioGroup,
  Uploader,
  List,
  Tab,
  Tabs,
  PullRefresh
} from 'vant'
// 该库会自动给html设置font-size
import 'amfe-flexible'

// 导入css文件
import './style/common.less'
import './style/iconfont.less'
import moment from 'moment'

Vue.config.productionTip = false

// 使用vant导入的组件
Vue.use(Button)
Vue.use(Field)
Vue.use(Form)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Uploader)
Vue.use(List)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(PullRefresh)
// 定义全局组件
Vue.component('hm-header', hmheader)
Vue.component('hm-logo', hmlogo)
Vue.component('hm-navbar', hmnavbar)
Vue.component('hm-post', hmpost)
Vue.prototype.$url = function(url) {
  if (url.startsWith('http')) {
    return url
  } else {
    return axios.defaults.baseURL + url
  }
}
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

// 定义全局过滤器
Vue.filter('timer', input => {
  return moment(input).format('YYYY-MM-DD')
})
Vue.filter('timer2', input => {
  return moment(input).format('YYYY-MM-DD HH:MM')
})
Vue.filter('timer3', input => {
  const now = Date.now()
  input = new Date(input)
  const time = (now - input) / 1000
  const years = parseInt(time / 60 / 60 / 24 / 365)
  const months = parseInt(time / 60 / 60 / 24 / 30)
  const days = parseInt(time / 60 / 60 / 24)
  const hours = parseInt(time / 60 / 60)
  const minutes = parseInt(time / 60)

  if (years > 0) {
    return `${years}年前`
  } else if (months > 0) {
    return `${months}个月前`
  } else if (days > 0) {
    return `${days}天前`
  } else if (hours > 0) {
    return `${hours}小时前`
  } else if (minutes > 0) {
    return `${minutes}分前`
  } else {
    return `${time}秒前`
  }
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
