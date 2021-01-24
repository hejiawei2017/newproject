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
    path: "/redirectTest",
    name: "redirectTest",
    component: () =>
      import(/* webpackChunkName: "redirectTest" */ "../components/redirectTest.vue"),
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
  {
    path: '/encryptedLogin',
    name: "encryptedLogin",
    component: () =>
      import(/* webpackChunkName: "uploadsplit" */ "../views/encryptedLogin.vue"),
  },
  {
    path: '/seleleDemo',
    name: "seleleDemo",
    component: () =>
      import(/* webpackChunkName: "seleleDemo" */ "../components/page/seleleDemo.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
