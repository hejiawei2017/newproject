/* Automatically generated by './build/bin/build-entry.js' */

import Demo from "./packages/Demo/index.js";
import Table from "./packages/Table/index.js";

const components = [Demo, Table];
const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};
/* istanbul ignore if */
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
export default {
  version: "2.13.2",
  Demo,
  Table,
  install
};
