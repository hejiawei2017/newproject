import Vue from "vue";
import VueRouter from "vue-router";
import centerMainRouter from "./modules/centerMainRouter";
import intellectualRouter from "./modules/intellectualRouter";
import InspectionRouter from "./modules/InspectionRouter";
import consumerRouter from "./modules/consumerRouter";
import industryRouter from "./modules/industryRouter";
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  console.log("--------------location", location);
  return originalPush.call(this, location).catch((err) => err);
};
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  console.log("--------------location2", location);
  return originalReplace.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const routerMap = {
  centerMain: centerMainRouter,
  intellectual: intellectualRouter,
  Inspection: InspectionRouter,
  consumer: consumerRouter,
  industry: industryRouter,
};

const routes = routerMap[process.env.SYSTEM_TYPE];

const router = new VueRouter({
  mode: "history",
  routes,
});
router.beforeEach((to, from, next) => {
  // 让页面回到顶部
  document.documentElement.scrollTop = 0
  // 调用 next()，一定要调用 next 方法，否则钩子就不会被销毁
 next()
})
export default router;
