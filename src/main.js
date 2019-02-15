import Vue from 'vue'
import App from './App'
import router from './router'
//  导入全局样式
import './assets/css/global.css'

// 引入图标css样式
import './assets/fonts/iconfont.css'
// 引入element-ui组件库
import ElementUI from 'element-ui'
// 引入axios并作相关配置
import axios from 'axios'
// axios请求跟地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 给axios 配置Vue的$http成员
Vue.prototype.$http = axios
// 把element-ui注册给vue
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
