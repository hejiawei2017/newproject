<template>
  <div class="live-play-container">
    <div class="live-top">
      <video-player
        v-if="showVideo"
        class="vjs-custom-skin"
        ref="videoPlayer"
        :options="playerOptions"
        @play="play"
      ></video-player>

      <img :src="coverPath" v-if="showCoverImg" class="cover-image" />
    </div>

    <div class="live-botttom">
      <div class="live-title">{{ title }}</div>
      <div class="live-time">
        <div>{{ timeScale }}</div>

        <div class="lives-status">
          <img
            class="live-status-icon"
            v-if="liveStatus == 1"
            src="https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191209141210606-find_icon_wks_zb%403x.png"
          />
          <img
            class="live-status-icon"
            v-if="liveStatus == 2"
            src="https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191209141347924-find_icon_zbz_zb%403x.png"
          />
          <img
            class="live-status-icon"
            v-if="liveStatus == 3"
            src="https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191209141409232-find_icon_yjs_zb%403x.png"
          />
        </div>

        <div v-if="qRCodeImg" class="share-btn" @click="shareBtnClick">
          <img
            src="https://azure-shop.obs.cn-south-1.myhuaweicloud.com/shop-detail-icon-goback.png"
          />
          分享
        </div>
      </div>

      <div class="lice-content" v-html="content"></div>
    </div>
    <div class="guide" v-show="!isXiaoChenxu" @click="goToGuide">
      <img
        src="https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191031103505529-newuserbanner.png"
      />
    </div>
    <show-tips ref="showTips"></show-tips>

    <div class="share-img-model" v-if="showShareImg">
      <div class="share-img-con">
        <img class="share-img" :src="qRCodeImg" />
        <img
          @click="showShareImg = false"
          class="share-img-close"
          src="https://azure-shop.obs.cn-south-1.myhuaweicloud.com/shop-detail-icon-close-white.png"
        />
      </div>
    </div>
  </div>
</template>

<script>
import "videojs-contrib-hls";
import showTips from "@/components/showTips/showTips.vue";
import axios from "@/libs/axios.js";
import util from "@/common/util.js";
export default {
  components: {
    showTips: showTips
  },
  name: "hls-live",
  props: {
    src: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showShareImg: false,
      showVideo: false,
      liveStatus: 0,
      showCoverImg: false,
      playerOptions: {
        height: "320",
        width: "100%",
        sources: [
          {
            withCredentials: false,
            type: "application/x-mpegURL",
            src: ""
          }
        ],
        controlBar: {
          timeDivider: false,
          durationDisplay: false
        },

        flash: { hls: { withCredentials: false } },
        html5: { hls: { withCredentials: false } },
        autoplay: false, // 自动播放
        controls: true, // 控制条
        fluid: true, // 按比例缩放适应容器
        preload: "auto", // 预加载
        aspectRatio: "16:9",
        poster: "" //首屏图片
      },
      startTime: "",
      endTime: "",
      streamAddr: "",
      returnViemAddr: "",
      timeScale: "",
      content: "",
      coverPath: "",
      title: "",
      qRCodeImg: "",
      isNewUser: "",
      isXiaoChenxu: ""
    };
  },
  created() {
    this.token = util.jsUrlHelper.getUrlParam(window.location.href, "token");
    if (!this.token) {
      this.token = "null";
    }
    this.id = util.jsUrlHelper.getUrlParam(window.location.href, "id");
    this.wxCode = util.jsUrlHelper.getUrlParam(window.location.href, "wxCode");
    this.isNewUser = util.jsUrlHelper.getUrlParam(
      window.location.href,
      "isNewUser"
    );

    this.isXiaoChenxu = util.jsUrlHelper.getUrlParam(
      window.location.href,
      "isXiaoChenxu"
    );

    //测试
    //this.id = 1347;
    //this.wxCode = "033oeDa90s9xvz1gmHc909Uda90oeDaO";
    //this.token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtc2ciOiJzdWNjZXNzIiwibGljZW5zZSI6Im1hZGUgYnkgZ2FjLW5pbyIsImNvZGUiOjAsImRhdGEiOm51bGwsInVzZXJfbmFtZSI6IjE1OTE1NzkxMTEyMTU1OTAzMzEwMDYxMiIsInNjb3BlIjpbInNlcnZlciJdLCJleHAiOjE1NzcxOTkwMzIsInVzZXJJZCI6MzM0LCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiLCJhcHBfc3Bfcm9sZSJdLCJqdGkiOiJkNTY0NWIwZC1iZGFlLTRlNWEtOGE1Ny1mMmZkY2M3ODRjZjMiLCJjbGllbnRfaWQiOiJ3ZWl4aW4tY2xpZW50In0.4RhViFgYqOOLhFmSfMRSOLegMXwthk1ekvkvaGbl2ss`;
    //this.token = "null";
    //this.isNewUser = 1;
  },
  mounted() {
    let vm = this;
    this.$refs.showTips.hideTips();
    this.loaddData().then(
      res => {
        if (res.data.code == 0) {
          let result = res.data.data;
          vm.startTime = result.startTime || "";
          vm.endTime = result.endTime || "";
          vm.streamAddr = result.streamAddr || "";
          vm.returnViemAddr = result.returnViemAddr || "";
          vm.liveStatus = result.liveStatus || 1;
          vm.timeScale = result.timeScale || "";
          vm.content = result.content || "";
          vm.coverPath = result.coverPath || "";
          vm.title = result.title;
          vm.qRCodeImg = result.qRCodeImg;

          //测试
          //vm.liveStatus = 2;
          //vm.streamAddr =
          // "https://183-6-204-132.xiu123.cn/v47096979-169074455/playlist.m3u8?val=1576561509075";
          //  vm.returnViemAddr = "";

          vm.playerOptions.poster = vm.coverPath;
          if (vm.liveStatus == 3) {
            vm.playerOptions.sources[0].src = vm.returnViemAddr;
          }
        } else {
          vm.$refs.showTips.showTips(res.msg || "抱歉请稍后再试");
        }

        if (vm.liveStatus == 3) {
          //结束
          if (vm.returnViemAddr) {
            if (vm.returnViemAddr.indexOf("m3u8") == -1) {
              vm.playerOptions.sources[0].type = "video/mp4";
            }
            vm.playerOptions.sources[0].src = vm.returnViemAddr;
          } else {
            vm.showCoverImg = true;
          }
        } else if (vm.liveStatus == 2) {
          //直播中
          vm.playerOptions.sources[0].src = vm.streamAddr;
          vm.playerOptions.sources[0].type = "application/x-mpegURL";
        } else {
          //未开始
          vm.showCoverImg = true;
        }
        vm.showVideo = true;
      },
      () => {
        vm.$refs.showTips.showTips("抱歉请稍后再试");
      }
    );
  },
  methods: {
    goToGuide() {
      window.wx.miniProgram.reLaunch({
        url: "/pages/index/index"
      });
    },
    shareBtnClick() {
      this.showShareImg = true;
      setTimeout(() => {
        this.$refs.showTips.showTips("长按图片可进行分享");
      }, 1000);
    },
    play() {
      if (!this.isClick) {
        this.liveClick();
        this.isClick = true;
      }
    },
    liveClick() {
      return axios({
        method: "get",
        url: `/community/pgcLiveBroadcast/noAuth/front/v3.1.4/click`,
        params: { id: this.id },
        headers: {
          Authorization: this.token ? this.token : "null"
        }
      });
    },
    loaddData() {
      if (!this.id) {
        this.$refs.showTips.showTips("缺少参数，请稍后再试");
        return;
      }
      return axios({
        method: "get",
        url: `/community/pgcLiveBroadcast/noAuth/front/v3.1.4/getById`,
        params: { id: this.id },
        headers: {
          Authorization: this.token ? this.token : "null"
        }
      });
    }
  }
};
</script>
<style>
.share-btn {
  display: inline-block;
  flex: 1;
  text-align: right;
}
.share-btn img {
  width: 40px;
  height: 40px;
  vertical-align: middle;
}
.share-img-model {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 999999;
  background-color: rgba(0, 0, 0, 0.2);
}
.share-img-con {
  position: absolute;
  width: 70%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
.share-img {
  width: 100%;
}
.share-img-close {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  margin-top: 40px;
  display: block;
}

.cover-image {
  object-fit: cover;
  width: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  height: 100%;
  z-index: 9999;
}
body,
p {
  padding: 0px;
  margin: 0px;
}
.live-play-container {
  background-color: white;
}

.live-top {
  width: 100%;
  height: 429px;
  position: relative;
}
.live-botttom {
  padding: 0px 30px;
}
.live-time {
  font-size: 28px;
  font-weight: 400;
  color: rgba(116, 122, 134, 1);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  line-height: 40px;
}
.live-title {
  font-size: 48px;
  font-weight: 600;
  color: rgba(5, 28, 44, 1);
  padding: 42px 0px;
}
.lives-status {
  width: 130px;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
}
.live-status-icon {
  width: 130px;
  height: 40px;
}

.guide {
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 160px;
}
.guide img {
  border-top: 1px solid rgba(204, 204, 204, 0.5);
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.lice-content {
  padding-top: 30px;
  font-size: 28px;
  line-height: 56px;
  font-weight: 400;
  color: rgba(5, 28, 44, 1);
  padding-bottom: 180px;
}
.vjs-poster {
  background-size: cover !important;
}
.vjs-big-play-button {
  width: 108px !important;
  height: 108px !important;
  background: transparent !important;
  border-radius: 100% !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}
.video-js .vjs-big-play-button {
  font-size: 68px !important;
}
.video-js .vjs-mute-control {
  width: 36px !important;
}
.vjs-live-display {
  width: 60px !important;
  line-height: 60px !important;
  font-size: 20px !important;
}
.video-js .vjs-control-bar {
  height: 60px !important;
}
.vjs-remaining-time {
  line-height: 60px !important;
  font-size: 24px !important;
}
.video-js button {
  font-size: 20px !important;
}
</style>
