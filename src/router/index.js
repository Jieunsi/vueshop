import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import Users from "../components/user/Users.vue";
import Rights from "../components/power/Rights.vue";
import Roles from "../components/power/Roles.vue";

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
