import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 按需导入vant
import { Button, Field } from 'vant'
// 该库会自动给html设置font-size
import 'amfe-flexible'
Vue.config.productionTip = false

// 使用vant导入的组件
Vue.use(Button)
Vue.use(Field)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
