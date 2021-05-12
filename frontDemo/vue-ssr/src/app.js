import Vue from "vue"
import App from "./App.vue"

import createRouter from "./router/create-router.js"
import createStore from "./store/create-store.js"

export default () => {
  const router = createRouter()
  const store = createStore()
  // 为了保证实例的唯一性所以导出一个创建实例的函数
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router, store }
}
