import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import animated from 'animate.css'
import titleMixin from './util/title-mixin'
import xss from "xss";
import moment from 'moment';
import echarts from 'echarts'

import util from './util/index.js'
Vue.use(util)

moment.locale('zh-cn');

import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
const hls = require('videojs-contrib-hls')
Vue.use(hls)


// const isServer = process.env.WEBPACK_TARGET === 'node'
//不是服务端渲染的时候可以根据url上面的参数区分五个中心
// import util from "./util.js"
// if (!isServer) {
//   util.setSysTemTypeByParam()
// }


// if (!isServer) {
//   require('fullpage.js/vendors/scrolloverflow') // Optional. When using scrollOverflow:true
//   const { default: VueFullPage } = require('vue-fullpage.js')
//   Vue.use(VueFullPage);
// }

Vue.config.productionTip = false;

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// 全局引入 vue-awesome-swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

import './style.scss'
import '@/assets/iconfont/iconfont.css'
import { Button, Cascader} from 'element-ui'
Vue.use(Button)
Vue.use(Cascader)
Vue.prototype.$moment = moment;
Vue.prototype.$echarts = echarts
Vue.prototype.xss = xss;
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(animated)

Vue.mixin(titleMixin)
Vue.use(VideoPlayer)
export function createApp() {
  const app = new Vue({
    router,
    store,
    render: (h) => h(App),
  })
  return { app, router, store }
}

