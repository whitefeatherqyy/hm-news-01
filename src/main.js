import Vue from 'vue'
import App from './App.vue'
import router from './router'
import hmheader from './components/HmHeader.vue'
import hmlogo from './components/HmLogo.vue'

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

// 优化axios：将axios绑定到vue原型上
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://localhost:3000'
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
