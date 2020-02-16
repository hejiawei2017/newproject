import Vue from "vue";
import lottery from "./lottery.vue";

import "lib-flexible/flexible.js";

new Vue({
  render: h => h(lottery)
}).$mount("#app");
