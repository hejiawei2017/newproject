import Vue from "vue";
import livePlay from "./live-play.vue";

import "lib-flexible/flexible.js";
import videoPlayer from "vue-video-player";
import "video.js/dist/video-js.css";
import "videojs-contrib-hls";
import "videojs-flash";
Vue.use(videoPlayer);
Vue.use(livePlay);
new Vue({
  render: h => h(livePlay)
}).$mount("#app");
