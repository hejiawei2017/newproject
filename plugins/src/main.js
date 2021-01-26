import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "lib-flexible/flexible.js";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css"; // 默认主题
Vue.config.productionTip = false;
Vue.use(ElementUI);


import suyuanui from "@/common/suyuanui.js"
Vue.use(suyuanui)


// import hui from 'h_ui';
// import 'h_ui/dist/h_ui.min.css'; // 使用 CSS\
// Vue.use(hui); // 路由配置 

import uploader from 'vue-simple-uploader'
Vue.use(uploader);




new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");



