import Vue from "vue";
import WaitScore from "./wait-score.vue";

import "lib-flexible/flexible.js";

new Vue({
  render: h => h(WaitScore)
}).$mount("#app");
