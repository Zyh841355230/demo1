import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
// 拦截器和守卫的区别 
// 导航守卫是为了防止非法登录，如果没有登录就直接访问后台首页是不可以（通过token判断有没有登录）
// axios拦截是为了复用代码，把每个ajax都要设置的头信息提取到拦截器当中（通过token拿数据  发服务器)
axios.interceptors.request.use(function(config){
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
},function(error){
  console.log(error);
  
})
Vue.prototype.$http=axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
