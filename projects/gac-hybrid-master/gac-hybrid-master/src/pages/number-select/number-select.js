import Vue from "vue";
import numberSelect from "./number-select.vue";

import "lib-flexible/flexible.js";

new Vue({
  render: h => h(numberSelect)
}).$mount("#app");
