<template>
  <div class="home">
    <!-- <banner class="cutppt"></banner> -->
    <my-swiper class="cutppt"></my-swiper>
    <scene-serv class="cutppt"></scene-serv>
    <apply-carousel
      class="cutppt"
      :applyData="applyCarouselData"
      @handleUp="handleUp"
      @handleNext="handleNext"
    ></apply-carousel>
    <pane-b-i class="cutppt"></pane-b-i>
    <news-tabs
      :news-tabs-data="newsTabsData2"
      class="cutppt"
      @changeTabs="changeTabs"
      @changeBreadcrumb="changeBreadcrumb"
    ></news-tabs>
    <file-panel class="cutppt"></file-panel>
    <unit-list class="cutppt" showMoreBtn></unit-list>
    <industry class="cutppt"></industry>
    <join-us class="cutppt" title="加入溯源"></join-us>
  </div>
</template>

<script>
// @ is an alias to /src
// import Banner from "@/components/Banner.vue";
import SceneServ from "@/components/SceneServ.vue";
import ApplyCarousel from "@/components/ApplyCarousel.vue";
import PaneBI from "@/components/PaneBI.vue";
import FilePanel from "@/components/FilePanel.vue";
import UnitList from "@/components/UnitList.vue";
import JoinUs from "@/components/JoinUs.vue";
import Industry from "@/components/Industry.vue";
import newsTabs from "@/components/NewsTabs.vue";
import scrollReveal from "scrollreveal";
import MySwiper from '@/components/MySwipier'
export default {
  name: "Home",
  components: {
    // Banner,
    SceneServ,
    ApplyCarousel,
    PaneBI,
    FilePanel,
    UnitList,
    JoinUs,
    Industry,
    newsTabs,
    MySwiper
  },
  data() {
    return {
      scrollReveal: scrollReveal(),
      newsTabsData2: {
        btnData: {
          url: "/traceability",
          text: "查看更多",
        },
        breadcrumbItems: [
          { text: "溯源资讯" },
          { text: "信息公示" },
          { text: "平台公告" },
        ],
        columns: [
          { name: "共建方名称" },
          { level: "共建方警示级别" },
          { creditCode: "统一社会信用代码" },
          { region: "国别/地区" },
          { time: "警示时间" },
          { cause: "警示原因" },
        ],
        dataSource: [
          {
            name: "某企业",
            level: "1级",
            creditCode: "统一社会信用代码",
            region: "中国",
            time: "2021.4.21",
            cause: "警示原因",
          },
          {
            name: "某企业",
            level: "1级",
            creditCode: "统一社会信用代码",
            region: "中国",
            time: "2021.4.21",
            cause: "警示原因",
            rowColor: true,
          },
          {
            name: "某企业",
            level: "1级",
            creditCode: "统一社会信用代码",
            region: "中国",
            time: "2021.4.21",
            cause: "警示原因",
          },
          {
            name: "某企业",
            level: "1级",
            creditCode: "统一社会信用代码",
            region: "中国",
            time: "2021.4.21",
            cause: "警示原因",
            rowColor: true,
          },
          {
            name: "某企业",
            level: "1级",
            creditCode: "统一社会信用代码",
            region: "中国",
            time: "2021.4.21",
            cause: "警示原因",
          },
        ],
      },
      options: {},
      BaseImgUrl: process.env.PROXY_URL + process.env.BASE_IMG_URL,
      applyCarouselActive: 0
    };
  },
  asyncData: {
    getApplicationCases(store) {
      // 应用案例
      return store.dispatch("getApplicationCases");
    },
  },
  computed: {
      applyCarouselData() {
        return {
          title: "应用",
          titleBold: "案例",
          applyArr: [
            {
              text: this.applyData.datas && this.applyData.datas[this.applyCarouselActive].summary,
              img: this.applyData.datas && this.BaseImgUrl + this.applyData.datas[this.applyCarouselActive].imgpathview,
            },
          ],
          articleid: this.applyData.datas && this.applyData.datas[this.applyCarouselActive].articleid,
          catalogid: this.applyData.datas && this.applyData.datas[this.applyCarouselActive].catalogid,
          pageNo: this.applyCarouselActive + 1, //applyData.pageNo
          pageSumCount: this.applyData.totalRows,
        };
      },
      applyData() {
        return this.$store.state.common.applyData
      }
  },
  mounted() {
    this.$store.dispatch('getApplicationCases'); // 应用案例
    this.$nextTick(() => {
      let nodeList = document.querySelectorAll(".cutppt");
      this.scrollReveal.reveal(nodeList, {
        // 动画的时长
        duration: 500,
        // 延迟时间
        delay: 500,
        // 动画开始的位置，'bottom', 'left', 'top', 'right'
        origin: "top",
        // 回滚的时候是否再次触发动画
        reset: false,
        // 在移动端是否使用动画
        mobile: false,
        // 滚动的距离，单位可以用%，rem等
        distance: "10px",
        // 其他可用的动画效果
        opacity: 0.001,
        easing: "ease-in-out",
        scale: 1,
      });
    });
  },
  methods: {
    handleUp() {
      // 上一页
      if (this.applyCarouselActive === 0) {
        this.applyCarouselActive === 0
        return
      }
      this.applyCarouselActive = this.applyCarouselActive - 1
    },
    handleNext() {
      // 下一页
      if (this.applyCarouselActive >= this.applyData.totalRows - 1) {
        this.applyCarouselActive = this.applyData.totalRows - 1
        return
      }
      this.applyCarouselActive = this.applyCarouselActive + 1
    },
    changeTabs() {
    },
    changeBreadcrumb() {
    },
  },
};
</script>

