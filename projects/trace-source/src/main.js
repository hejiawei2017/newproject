import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/iconfont/iconfont.css'; // iconfont
import './assets/css/icon.css';

import './components/common/directives';
import 'babel-polyfill';
import store from './store';
import interceptor from './interceptor';

Vue.config.productionTip = false;
Vue.use(ElementUI, {
  size: 'small'
});

Vue.prototype.$axios = axios;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    //如果配置了需要登录授权，则需要验证
    const isLogin = localStorage.getItem('isLogin');
    //但是前端本来就没有绝对安全的策略，只能通过后端减少token的生效时间来预防
    if (isLogin) {
      next();
    } else {
      next({
        Path: '/login',
        Query: { redirect: to.path }
      });
    }
  } else {
    next();
  }
});

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

interceptor(app);
