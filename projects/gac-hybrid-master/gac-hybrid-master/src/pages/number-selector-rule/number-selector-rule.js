import Vue from "vue";
import Three from "./number-selector-rule.vue";
import "lib-flexible/flexible.js";
new Vue({
  render: h => h(Three)
}).$mount("#app");
