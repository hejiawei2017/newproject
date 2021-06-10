<template>
  <!-- 消费者中心 -->
  <div class="about" id="pageList">
    <banner2 :banner-data="aboutBanner"></banner2>
    <search></search>
    <announcement :tableData="tableData"></announcement>
    <content1 :content-one="contentOneA"></content1>
    <content0 :content-zero="coContent"></content0>
    <app-show-content></app-show-content>
    <floor :floorData="floorData"></floor>
  </div>
</template>

<script>
import banner2 from "@/components/Banner2.vue";
import Search from "@/components/Search2.vue";
import Announcement from "@/components/Announcement.vue";
import content1 from "@/components/Content1.vue";
import AppShowContent from "@/components/AppShowContent.vue";
import Content0 from "@/components/Content0.vue";
import Floor from "@/components/Floor.vue";

export default {
  components: {
    banner2,
    Floor,
    Search,
    Announcement,
    content1,
    AppShowContent,
    Content0,
  },
  name: "Need",
  data() {
    return {
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
      aboutBanner: {
        img: require("@/assets/img/consumer/customer-service-banner.png"),
        title: "消费者中心",
        text: "",
        textArr: [
          "为消费者提供查询及咨询",
          "建立在溯源数据库上的商品信息情报，真实可信",
        ],
        maxWidth: "745px",
      },
      floorData: {
        title: "定位导航",
        positionArr: [
          {
            id: "#mission",
            text: "我们的使命",
          },
          {
            id: "#system",
            text: "全球溯源体系",
          },
          {
            id: "#global",
            text: "全球溯源中心",
          },
          {
            id: "#co-construction",
            text: "支撑共建方",
          },
          {
            id: "#development",
            text: "发展历程",
          },
        ],
      },
      coContent: {
        title: "服务指南",
        normalTitle: "消费者",
        subTitle: "",
        itemStyle: {
          width: "251px",
        },
        imgStyle: {
          width: "245px",
          height: "245px",
          padding: "60px 0",
          borderRadius: "122px",
        },
        bodyData: [
          {
            img: require("@/assets/img/consumer/join-source.png"),
            imgText: "加入溯源",
            hoverImg: require("@/assets/img/consumer/join-source-hover.png"),
            text: "用户需要进行\n用户注册与账号信息维护",
            tit: "",
          },
          {
            img: require("@/assets/img/consumer/source-search.png"),
            imgText: "溯源查询",
            hoverImg: require("@/assets/img/consumer/source-search-hover.png"),
            text:
              "消费者通过扫码查询或手动录入\n溯源标识值等信息，查询商品溯源数据",
            tit: "",
          },
          {
            img: require("@/assets/img/consumer/amend.png"),
            imgText: "咨询反馈",
            hoverImg: require("@/assets/img/consumer/amend-hover.png"),
            text:
              "进行溯源查询后，若对查询结果存疑时\n可进行咨询反馈，维护自身权益",
            tit: "",
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
  methods: {
    changeBtn(index) {
      console.log(index, "117");
    },
    changePage(index) {
      console.log(index, "120");
    },
  },
};
</script>
