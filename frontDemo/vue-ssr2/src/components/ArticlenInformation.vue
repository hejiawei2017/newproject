<template>
  <div class="articlen-information">
    <div class="information-breadcrumb">
      <div class="container">
        <div
          v-for="(item, index) in breadcrumbList"
          :key="index"
          class="information-breadcrumb-item"
        >
          <router-link
            :to="item.url"
            class="information-breadcrumb-item-link"
            >{{ item.text }}</router-link
          >
          <slot v-if="index !== breadcrumbList.length - 1" name="icon"
            ><b-icon icon="chevron-right"></b-icon
          ></slot>
        </div>
      </div>
    </div>
    <div class="container">
      <div v-if="articleData.title" class="wrap">
        <h2 class="information-title">
          {{ articleData.title }}
        </h2>
        <div class="information-time">
          {{ timeFormat(articleData.predate) }}
        </div>
        <div class="information-content">
          <div
            v-html="articleData.bodytext"
            class="information-content-text"
          ></div>
        </div>
        <div class="information-share">
          <span class="information-share-text">分享</span>
          <span class="information-share-icon WeChat-icon">
            <!-- <img src="@/assets/img/about/WeChat-icon.png" /> -->
            <div ref="qrCodeUrl" class="qrcode-box"></div>
          </span>
          <span class="information-share-icon weibo-icon">
            <a
              :href="`http://v.t.sina.com.cn/share/share.php?title=${pageHref}`"
              target="_blank"
            >
              <!-- <img src="@/assets/img/about/weibo.png" /> -->
            </a>
          </span>
          <span class="information-share-icon email-icon">
            <a
              :href="`mailto:#?subject=test&cc=sample@hotmail.com&subject=主题&body=${pageHref}`"
            >
              <!-- <img src="@/assets/img/about//note-icon.png" /> -->
            </a>
          </span>
        </div>
      </div>
      <empty v-else></empty>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import empty from '../components/empty'
export default {
  name: "ArticlenInformation",
  components: {
    empty
  },
  data() {
    return {
      breadcrumbList: [
        {
          url: "/",
          text: "首页",
        },
        {
          url: "/traceability",
          text: "溯源资讯",
        },
        {
          url: "/traceability/articlen-information",
          text: "文章详情",
        },
      ],
    };
  },
  asyncData: {
    getArticle(store, data) {
      return store.dispatch("getArticle", data);
    },
  },
  mounted() {
    // 查文章只需传 {catalogid:catalogid,articleid:articleid} 放在route的query
    this.$options.asyncData.getArticle(this.$store, this.$route.query);
    this.$nextTick(() => {
      new QRCode(this.$refs["qrCodeUrl"], {
        text: this.pageHref, // 需要转换为二维码的内容
        colorDark: "#000000",
        colorLight: "#ffffff",
      });
    });
  },
  computed: {
    pageHref() {
      return window.location.href;
    },
    articleData() {
      return (
        (this.$store.state.sourceServer.articleData.datas &&
          this.$store.state.sourceServer.articleData.datas[0]) ||
        {}
      );
    },
    timeFormat() {
      return function (time) {
        if(!time) return ''
        const timestamp4 = new Date(time); //直接用 new Date(时间戳) 格式转化获得当前时间
        //  + " " + timestamp4.toTimeString().substr(0, 8)
        return timestamp4.toLocaleDateString().replace(/\//g, "-"); //再利用拼接正则等手段转化为yyyy-MM-dd hh:mm:ss 格式
      };
    },
  },
};
</script>

<style scoped lang="scss">
</style>