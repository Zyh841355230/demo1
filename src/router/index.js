import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/users/User.vue'
Vue.use(VueRouter)


const router = new VueRouter({
  routes:[
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {path:'/home',redirect:'/welcome',component:Home,children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:User}
    ]}
  ]
})

router.beforeEach(function(to,from,next){
  console.log(to)
  console.log(from)
  if(to.path==='/login') return next()
  var tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

//本质就是改写了element内部的push方法
//对错误进行了捕获
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
