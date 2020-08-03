import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/view360",
    name: "view360",
    component: () =>
      import(/* webpackChunkName: "view360" */ "../views/view360.vue"),
  },
  {
    path: "/uploadSplit",
    name: "uploadSplit",
    component: () =>
      import(/* webpackChunkName: "uploadsplit" */ "../views/uploadsplit.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
