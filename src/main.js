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
  const now = new Date()
  input = new Date(input)
  const time = parseInt((now - input) / 1000)
  const minutes = parseInt(time / 60)
  const hours = parseInt(minutes / 60)
  const days = parseInt(hours / 24)
  const months = parseInt(days / 30)
  const years = parseInt(days / 365)
  if (minutes < 1) {
    return time + '秒前'
  } else if (hours < 1) {
    return `${minutes}分钟前`
  } else if (days < 1) {
    return `${hours}小时前`
  } else if (months < 1) {
    return `${days}天前`
  } else if (years < 1) {
    return `${months}个月前`
  } else {
    return `${years}年前`
  }
})
// 新建一个bus解决非父子组件传参的问题
const bus = new Vue()
Vue.prototype.$bus = bus
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
