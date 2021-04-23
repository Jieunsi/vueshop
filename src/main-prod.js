import Vue from 'vue'
import App from './App.vue'
import router from './router'

//导入全局样式表
import  './assets/css/global.css'
//导入axios包
import axios from 'axios';
//导入树形控件
import TreeTable from 'vue-table-with-tree-grid';
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor';


//导入nprogress
import NProgress from 'nprogress'


//配置请求的根路径
axios.defaults.baseURL = 'http://121.89.239.85:8801/api/private/v1/'
//配置拦截器（request），并在request拦截器中展示进度条
axios.interceptors.request.use(config =>{
  //展示进度条
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token');
  //最后必须返回config
  return config
})
//在response拦截器中隐藏进度条
axios.interceptors.response.use(config =>{
  //展示进度条
  NProgress.done();
  return config
})
//把axios包挂载到vue的原型对象上，每个vue组件都可以通过this.http访问到axios发起请求
Vue.prototype.$http = axios
//定义一个全局过滤器
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  //padStart如果某个字符串不够指定长度，在头部补全指定字符，padEnd在尾部
  const m = (dt.getMonth() + 1 +'').padStart(2,'0');
  const d = (dt.getDate()+ '').padStart(2,'0');

  const hh = (dt.getHours()+ '').padStart(2,'0');
  const mm = (dt.getMinutes()+ '').padStart(2,'0');
  const ss = (dt.getSeconds()+ '').padStart(2,'0');
  
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)
//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
