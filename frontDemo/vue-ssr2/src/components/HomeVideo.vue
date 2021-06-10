<template>
  <div
    v-show="isShow"
    class="home-video animate__animated"
    :class="{ animate__backOutUp: showAnimate }"
  >
    <template>
      <video-player
        v-if="playerShow"
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :options="playOptionsData"
        @play="onPlayerPlay($event)"
        @ended="onPlayerEnded($event)"
        @ready="playerReadied"
      >
      </video-player>
      <button
        v-if="true"
        class="home-video-close-btn"
        @click="closeVideo"
      >
        <b-icon icon="x"></b-icon>
      </button>
    </template>

    <template v-if="!showModel && isShowModel">
      <div
        class="video-model animate__animated"
        :class="{ animate__fadeInRight: isShowModel }"
      >
        <ul class="video-model-list">
          <li
            v-for="(item, index) in linkList"
            :key="index"
            class="video-model-item"
          >
            <div class="item-link" @click="handleJump(item.url)">
              <div class="video-model-item-img">
                <img :src="item.img" />
              </div>
              <p class="video-model-item-text">{{ item.text }}</p>
            </div>
          </li>
        </ul>
        <div class="video-model-home">
          <div
            class="video-model-home-link"
            @click="handleJump(pconfig.centerMainUrl)"
          >
            <img
              class="video-model-home-img"
              src="@/assets/img/home/5z00.png"
            />
            <p class="video-model-item-text">
              {{ "全球溯源中心\n公共服务平台" }}
            </p>
          </div>
        </div>
        <button class="video-model-btn" @click="handleRestart">
          重播<b-icon style="margin-left: 5px" icon="arrow-clockwise"></b-icon>
        </button>
      </div>
    </template>

    <template v-if="loading">
      <div class="model-loading">
        <div class="loading-bar">
          <b class="l-dotted-1"></b>
          <b class="l-dotted-2"></b>
          <b class="l-dotted-3"></b>
          <b class="l-dotted-4"></b>
        </div>
        <p class="loading-text">Loading...</p>
      </div>
    </template>
  </div>
</template>

<script>
import pconfig from "@/p.config";
export default {
  props: {
    clickShow: {
      type: Boolean,
    },
  },
  components: {},
  data() {
    return {
      pconfig: pconfig,
      isShow: true,
      playerShow: true,
      showAnimate: false,
      isShowModel: false,
      loading: true,
      playOptionsData: {
        fill: true,
        // playbackRates: 1, // 可选的播放速度 [0.5, 1.0, 1.5, 2.0]
        autoplay: true, // 如果为true,浏览器准备好时开始播放。
        muted: true, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", // 类型
            src: "http://10.10.104.3/downloadfromfront/trouce.mp4", // url地址,
            //type: "application/x-mpegURL",
            //src: "http://10.10.104.3/downloadfromfront/m3u8/trouce.m3u8", // url地址
            //src: "http://172.30.220.205:3007/trouce.m3u8",
          },
        ],
        // poster: require("@/assets/img/home/c-b-01.jpg"), // 封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: false, // 当前时间和持续时间的分隔符
          durationDisplay: false, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: false, // 是否显示全屏按钮
        },
      },
      linkList: [
        {
          img: require("@/assets/img/home/5z03.png"),
          text: "溯源产业\n公共服务平台",
          url: pconfig.industryUrl,
        },
        {
          img: require("@/assets/img/home/5z04.png"),
          text: "检验检测\n公共服务平台",
          url: pconfig.InspectionUrl,
        },
        {
          img: require("@/assets/img/home/5z02.png"),
          text: "知识产权\n公共服务平台",
          url: pconfig.intellectualUrl,
        },
        {
          img: require("@/assets/img/home/5z01.png"),
          text: "消费者权益保护\n公共服务平台",
          url: pconfig.consumerUrl,
        },
      ],
    };
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
    isHome() {
      return this.$route.path === "/";
    },
    showVideo() {
      return (
        this.$store.state.common.showVideo ||
        this.showModel ||
        this.$route.query.is === "0" ||
        this.$route.path !== "/"
      );
    },
    showModel() {
      if (window) {
       return window.sessionStorage.getItem("showVideo") === "0"
      }
      return false
    },
  },
  watch: {
    clickShow() {
      this.playerShow = false;
      this.$nextTick(() => {
        // this.player.currentTime(0);
        this.playerShow = true;
        this.loading = true;
        this.isShow = true;
        // this.player.play(); // 播放
        document.documentElement.style.overflow = "hidden";
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.showVideo || this.showModel) {
        this.isShow = false;
        this.player.pause();
        return;
      }
      this.isShow = true;
      this.player.play(); // 播放
      this.$store.commit("setShowVideo", true);
      document.documentElement.style.overflow = "hidden";
    });
  },
  methods: {
    onPlayerPlay() {
      // 播放回调
      if (!this.isShow) {
        this.player.pause();
        return;
      }
      this.loading = false;
      const myPlayer = this.$refs.videoPlayer.player;
      myPlayer.play();
      document.documentElement.style.overflow = "hidden";
    },
    onPlayerEnded() {
      // 视频播完回调
      // this.isShowAnimate()
      if (window) {
        window.sessionStorage.setItem("showVideo", 0);
      }
      this.$store.commit("setShowVideo", true);
      this.isShowModel = true;
      document.documentElement.style.overflow = "";
    },
    //将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
    playerReadied() {
      console.log("example player 1 readied");
    },
    closeVideo() {
      this.isShowAnimate();
      this.player.pause();
      document.documentElement.style.overflow = "";
    },
    isShowAnimate() {
      this.showAnimate = true;
      setTimeout(() => {
        this.isShow = false;
        this.showAnimate = false;
      }, 1000);
    },
    handleJump(url) {
      window.open(url);
    },
    handleRestart() {
      this.loading = true;
      this.playerShow = false;
      this.isShowModel = false;
      this.$nextTick(() => {
        this.playerShow = true;
      });

      // this.loading = true;
      // this.player.currentTime(0);
      // this.player.play();
    },
  },
};
</script>

.<style lang="scss" scoped>
.home-video {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 999999;
  ::v-deep .vjs-custom-skin > .video-js .vjs-control-bar {
    /* 因为本质是视频，鼠标放上去会显示下面的控制条，不需要显示 */
    display: none;
  }
  ::v-deep .vjs-tech {
    /* 点击视频，会使视频暂停或是继续播放，不需要这样 */
    pointer-events: none;
    object-fit: fill;
  }
  ::v-deep .vjs-big-play-button {
    visibility: hidden;
    opacity: 0;
  }
  ::v-deep .vjs-poster {
    background-size: cover;
  }
  .home-video-close-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    position: absolute;
    top: 20px;
    right: 50px;
    border-radius: 10px;
    background: #000;
    font-size: 34px;
    color: #fff;
    border: none;
    outline: none;
    z-index: 3;
  }
  .video-model {
    position: absolute;
    top: 0;
    right: 0;
    width: 600px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 2;
    .video-model-list {
      display: flex;
      flex-wrap: wrap;
      height: 90%;
      .video-model-item {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        height: 50%;
        cursor: pointer;
        .item-link {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          opacity: 0.9;
          &:hover {
            opacity: 1;
          }
        }
        .video-model-item-img {
          width: 120px;
          margin-bottom: 10px;
          img {
            width: 100%;
          }
        }
      }
    }
    .video-model-item-text {
      font-size: 16px;
      color: #fff;
      white-space: break-spaces;
    }
    .video-model-home {
      position: absolute;
      top: calc(42% - 120px / 2);
      left: calc(50% - 120px / 2);
      width: 120px;
      cursor: pointer;
      .video-model-home-link {
        opacity: 0.9;
        .video-model-home-img {
          width: 100%;
          margin-bottom: 10px;
        }
        &:hover {
          opacity: 1;
        }
      }
    }
    .video-model-btn {
      outline: none;
      padding: 5px 20px;
      border-radius: 15px;
      background: transparent;
      color: #fff;
      font-size: 14px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.2s;
      &:hover {
        box-shadow: 0px 0px 6px #fff;
      }
    }
  }
  .model-loading {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.9);
    user-select: none;
    .loading-bar {
      b {
        margin-right: 20px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: inline-block;
        -webkit-transform: scale(0);
        -moz-transform: scale(0);
        -ms-transform: scale(0);
        -o-transform: scale(0);
        transform: scale(0);
      }
      .l-dotted-1 {
        background-color: #0c6da9;
        animation: loading 1800ms infinite ease;
      }
      .l-dotted-2 {
        background-color: #ff445e;
        animation: loading 1800ms infinite ease 300ms;
      }
      .l-dotted-3 {
        background-color: #5dcbbd;
        animation: loading 1800ms infinite ease 600ms;
      }
      .l-dotted-4 {
        background-color: #cc59b8;
        animation: loading 1800ms infinite ease 900ms;
      }
      @keyframes loading {
        0% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(30px);
        }
        100% {
          transform: translateY(0);
        }
      }
    }
    .loading-text {
      margin-top: 60px;
      font-size: 20px;
      color: #fff;
    }
  }
}
</style>

