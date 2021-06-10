<template>
  <div class="layout">
    <navigation
      :class="{ fix: isFix }"
      @handleOnclick="handleOnclick"
    ></navigation>
    <div
      :style="{
        minHeight: contentMinHeight + 'px',
        marginTop: contentMarginTop + 'px',
      }"
    >
      <router-view :key="key" />
    </div>

    <HomeVideo :clickShow="isShow" />
    <drag-service />
    <footer-temp></footer-temp>
  </div>
</template>

<script>
import Navigation from "./Navigation.vue";
import FooterTemp from "./Footer2.vue";
import DragService from "@/components/DragService.vue";
import HomeVideo from "@/components/HomeVideo";
import _ from "lodash";
import "../../styles/layout.scss";
import enumerate from '../../util/staticMapData'

export default {
  name: "Layout",
  components: {
    Navigation,
    FooterTemp,
    DragService,
    HomeVideo,
  },
  computed: {
    key() {
      return this.$route.path;
    },
    contentMinHeight() {
      const windowHeight = document.documentElement.clientHeight;
      return this.isFix
        ? windowHeight - this.switchBarHeight
        : windowHeight - this.headerHeight - this.switchBarHeight;
    },
    contentMarginTop() {
      return this.isFix ? this.switchBarHeight : 0;
    },
  },
  data() {
    return {
      isFix: false,
      headerHeight: 0,
      scrollTop: 0,
      scrollHeight: 0,
      switchBarHeight: 0,
      throttleScroll: null,
      isShow: true,
    };
  },
  mounted() {
    this.$nextTick(() => {
      // 节流监听滚动事件
      window.addEventListener("scroll", this.throttleScroll, false);
    });
    this.throttleScroll = _.throttle(this.handleScroll, 100);

    window.addEventListener("message", (e) => {
      // console.log("login-message", e.data);
      let data = JSON.parse(e.data)
      if(e.data && !_.isEmpty(data) && !_.isEmpty(data.userInfo) && enumerate.roleType[data.roleType]){
        data.roleName = enumerate.roleType[data.roleType]
        localStorage.setItem("userInfo", data);
      }
    });
  },
  methods: {
    handleScroll() {
      this.setData();
      // 判断是否吸顶效果
      if (this.scrollTop >= this.headerHeight) {
        this.isFix = true;
      } else {
        this.isFix = false;
      }
    },
    setData() {
      this.headerHeight = 0;
      this.switchBarHeight = 98;
      this.scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      this.scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
    },
    handleOnclick() {
      this.isShow = !this.isShow;
    },
  },
  destoryed() {
    window.removeEventListener("scroll", this.throttleScroll);
  },
};
</script>

<style scoped>
</style>
