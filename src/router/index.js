import Vue from 'vue';
import VueRouter from 'vue-router';
import Err from '@/views/err.vue'
import Login from '@/views/login.vue'
import Admin from '@/views/index.vue'
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/admin',
    redirect: '/'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '*',
    name: 'Err',
    component: Err
  }
];

const router = new VueRouter({
  routes,
});
// 添加路由守卫
router.beforeEach((to, from, next) => {
  const cookie = document.cookie.includes('cookie=');
  const user = localStorage.getItem('user');
  console.log(user);
  console.log('是否登录', user,cookie);
  // 用户未登陆只允许访问登录页和注册页
  if (!user && (to.name !== "Login"&&to.name !== "Admin")) {
    console.log('没有登录自动跳转到登录页面');
    // 未登录自动跳转至登录页
    next({ name: 'Login' });
  } else {
    console.log('释放');
    next();
  }
});


export default router;
