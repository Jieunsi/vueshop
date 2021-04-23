import Vue from "vue";
import VueRouter from "vue-router";
//路由懒加载
//import Login from "../components/Login.vue";
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
//import Home from "../components/Home.vue";
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
//import Welcome from "../components/Welcome.vue";
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')


//import Users from "../components/user/Users.vue";
const Users = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/user/Users.vue')
//import Rights from "../components/power/Rights.vue";
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/Rights.vue')
//import Roles from "../components/power/Roles.vue";
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/Roles.vue')


//import Cate from "../components/goods/Cate.vue";
const Cate = () => import(/* webpackChunkName: "goods" */ '../components/goods/Cate.vue')
//import Params from "../components/goods/Params.vue";
const Params = () => import(/* webpackChunkName: "goods" */ '../components/goods/Params.vue')
//import Goods from "../components/goods/Goods.vue";
const Goods = () => import(/* webpackChunkName: "goods" */ '../components/goods/Goods.vue')
//import Add from "../components/goods/Add.vue";
const Add = () => import(/* webpackChunkName: "goods" */ '../components/goods/Add.vue')


//import Orders from "../components/order/Orders.vue";
const Orders = () => import(/* webpackChunkName: "last" */ '../components/order/Orders.vue')
//import Report from "../components/report/Report.vue";
const Report = () => import(/* webpackChunkName: "last" */ '../components/report/Report.vue')


Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    //如果访问login地址，通过component属性来指定要显示的组件
    { path: "/login", component: Login },
    { path: "/", redirect: "/login" },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      children: [
        { path: "/welcome", component: Welcome },
        { path: "/users", component: Users },
        { path:"/rights", component: Rights},
        { path:"/roles", component: Roles},
        { path:"/categories", component: Cate},
        { path:"/params", component: Params},
        { path:"/goods", component: Goods},
        { path:"/orders", component: Orders},
        { path:"/goods/add", component: Add},
        { path:"/reports", component: Report},
      ],
    },
  ],
});
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to表示将要访问的路径
  //from表示从哪个路径跳转而来
  //next是一个函数，表示放行
  //  next() 放行  next('/login')强制跳转到对应页面
  if (to.path == "/login") return next();
  //获取token，调用方法
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  else return next();
});

export default router;
