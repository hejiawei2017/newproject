<template>
  <!-- 首页 -->
  <div class="home">
    <banner class="cutppt"></banner>
    <search class="cutppt" style="position:relative;z-index:2;"></search>
    <announcement :tableData="tableData" class="cutppt"></announcement>
    <content1 :content-one="contentOneA" showLine class="cutppt"></content1>
    <sceneServ class="cutppt"></sceneServ>
    <news-tabs
      :news-tabs-data="newsTabsData"
      @changeBreadcrumb="changeBreadcrumb" 
      class="cutppt"
    ></news-tabs>
    <file-panel class="cutppt"></file-panel>
    <unit-list class="cutppt"></unit-list>
    <join-us title="加入溯源" title2="Join us" class="cutppt"></join-us>
  </div>
</template>

<script>
// @ is an alias to /src
import Banner from "@/components/Banner.vue";
import Search from "@/components/Search2.vue";
import Announcement from "@/components/Announcement.vue";
import content1 from "@/components/Content1.vue";
import SceneServ from "@/components/SceneServ.vue";
import newsTabs from "@/components/NewsTabs.vue";
import FilePanel from "@/components/FilePanel.vue";
import UnitList from "@/components/UnitList.vue";
import JoinUs from "@/components/JoinUs.vue";
import scrollReveal from "scrollreveal";

export default {
  name: "Home",
  components: {
    Banner,
    Search,
    Announcement,
    content1,
    SceneServ,
    newsTabs,
    FilePanel,
    UnitList,
    JoinUs,
  },
  data() {
    return {
      breadcrumbActive: 0,
      tableData: {
        bgImg: require('@/assets/img/consumer/consumer-ann-img.png'),
        columns: [
          { title: "商品查询榜单" },
          { title: "商品咨询榜单" },
          { title: "商品投诉榜单" },
          { title: "企业红榜" },
          { title: "企业黑榜" },
        ],
        dataSource: [
          {
            url: require("@/assets/img/about/monthly-focus.png"),
            text: "荷兰牛栏较大儿配方奶粉 荷兰牛栏较大儿配方奶粉",
            consultText: "咨询量",
            consultNum: 1000,
          },
          {
            url: require("@/assets/img/about/monthly-focus.png"),
            text: "荷兰牛栏较大儿配方奶粉 荷兰牛栏较大儿配方奶粉",
            consultText: "咨询量",
            consultNum: 1000,
          },
          {
            url: require("@/assets/img/about/monthly-focus.png"),
            text: "荷兰牛栏较大儿配方奶粉 荷兰牛栏较大儿配方奶粉",
            consultText: "咨询量",
            consultNum: 1000,
          },
          {
            url: require("@/assets/img/about/monthly-focus.png"),
            text: "荷兰牛栏较大儿配方奶粉 荷兰牛栏较大儿配方奶粉",
            consultText: "咨询量",
            consultNum: 1000,
          },
          {
            url: require("@/assets/img/about/monthly-focus.png"),
            text: "荷兰牛栏较大儿配方奶粉 荷兰牛栏较大儿配方奶粉",
            consultText: "咨询量",
            consultNum: 1000,
          },
          {
            url: require("@/assets/img/about/monthly-focus.png"),
            text: "荷兰牛栏较大儿配方奶粉 荷兰牛栏较大儿配方奶粉",
            consultText: "咨询量",
            consultNum: 1000,
          },
        ],
      },
      newsTabsData: {
        btnData: {
          url: "/traceability",
          text: "查看更多",
        },
        breadcrumbItems: [
          { text: "行业动态" },
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
      contentOneA: {
        titleList: [
          { title:'权益保护机制\n',bold: true },
          { title:'多元共治' },
        ],
        text:
          "监管部门、企业与消费者是全球溯源体系与全球溯源中心的共建单位，消费者权益保护公共服务平台作为全球溯源中心的公共应用，向共建各方共享商品的质量信息、贸易信息、监管应用信息、消费者反馈信息等商品真实价值信息。",
        subText:
          "在全球溯源中心统一管理下，形成消费者投诉咨询、责任相关企业办理、监管部门监督的闭环保护机制。维权服务商的加入，通过市场化手段，促进机制更加有效运行。",
        bgImg: require("@/assets/img/consumer/consumer-Bg1.png"),
        bgClass: "container card-img-overlay",
        imgStyle: {
          width: "635px",
          height: "414px",
        },
        leftStyle: {
          color: "#FFFFFF",
          width: "384px",
        },
        cLineStyle:{ background: '#fff '},
        contentOneStyle: { minHeight: '820px' },
        bgImgStyle: { minHeight: '820px' },
      },
    };
  },
  mounted() {
     this.$nextTick(() => {
      scrollReveal({
        // 动画的时长
        duration: 1000,
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
      }).reveal(".cutppt");
    });
  },
  methods: {
    changeBreadcrumb(index) {
      this.breadcrumbActive = index;
      this.setBtnUrl();
      console.log(index);
    },
    setBtnUrl() {
      if (this.breadcrumbActive === 0) {
        this.newsTabsData.btnData.url = "/traceability";
      }
      if (this.breadcrumbActive === 1) {
        this.newsTabsData.btnData.url = "#";
      }
      if (this.breadcrumbActive === 2) {
        this.newsTabsData.btnData.url = "#";
      }
    },
  },
};
</script>
