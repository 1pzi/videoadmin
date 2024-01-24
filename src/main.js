import Vue from 'vue';

import $ from 'jquery'; // 将$(jquery)挂在到vue.prototype身上，让所有的Vue共享这个方法
import App from './App.vue';
import router from '@/router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './utlis/request'
import 'bootstrap/dist/css/bootstrap.min.css'; // 引用bootstrap的样式
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/font/iconfont.css'

// 导入jquery
Vue.prototype.$ = $; // 引用bootstrap的js
Vue.use(ElementUI)

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render(h) { return h(App); },
  created() {
    console.log(this.$store);
    this.$store.commit('initializeStore');
  },
}).$mount('#app');
