import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式表
import  './assets/css/global.css'
//导入axios包
import axios from 'axios';

//配置请求的根路径
axios.defaults.baseURL = 'http://121.89.239.85:8801/api/private/v1/'
//配置拦截器（request）
axios.interceptors.request.use(config =>{
  config.headers.Authorization = window.sessionStorage.getItem('token');
  //最后必须返回config
  return config
})
//把axios包挂载到vue的原型对象上，每个vue组件都可以通过this.http访问到axios发起请求
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
