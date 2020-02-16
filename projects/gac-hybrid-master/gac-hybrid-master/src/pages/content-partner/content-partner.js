import Vue from "vue";
import contentPartner from "./content-partner.vue";

import "lib-flexible/flexible.js";

import VueAwesomeSwiper from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
Vue.use(VueAwesomeSwiper);
new Vue({
  render: h => h(contentPartner)
}).$mount("#app");
