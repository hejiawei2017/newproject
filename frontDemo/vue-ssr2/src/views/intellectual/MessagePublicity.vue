<template>
  <div class="message-publicity">
    <banner2 :banner-data="bannerData"></banner2>
    <news-tabs :news-tabs-data="newsTabsData"></news-tabs>
  </div>
</template>

<script>
import banner2 from "@/components/Banner2.vue";
import newsTabs from "@/components/NewsTabs.vue";
export default {
  name: "MessagePublicity",
  components: {
    banner2,
    newsTabs,
  },
  data() {
    return {
      bannerData: {
        img: require("@/assets/img/Inspection/settled-banner.png"),
        title: "信息公示",
        textArr: ["展示政府部门对知识产权保护行业的管理办法及相关措施和知识产权保护预警信息，便于用户及时接收并了相关重要信息"],
      },
      newsTabsData: {
        breadcrumbItems: [
          { text: "溯源资讯" },
          { text: "信息公示" },
          { text: "平台公告" },
        ],
        contentList: [
          {
            imgpathview: require("@/assets/img/home/new-tabs-img.png"),
            title: "监管动态",
            summary: "国际分拨中心将为南沙带来2千亿业务 ",
            predate: "2021-04-16",
          },
          {
            imgpathview: require("@/assets/img/home/new-tabs-img.png"),
            title: "监管动态",
            summary: "国际分拨中心将为南沙带来2千亿业务 ",
            predate: "2021-04-16",
          },
          {
            imgpathview: require("@/assets/img/home/new-tabs-img.png"),
            title: "监管动态",
            summary: "国际分拨中心将为南沙带来2千亿业务 ",
            predate: "2021-04-16",
          },
          {
            imgpathview: require("@/assets/img/home/new-tabs-img.png"),
            title: "监管动态",
            summary: "国际分拨中心将为南沙带来2千亿业务 ",
            predate: "2021-04-16",
          },
          {
            imgpathview: require("@/assets/img/home/new-tabs-img.png"),
            title: "监管动态",
            summary: "国际分拨中心将为南沙带来2千亿业务 ",
            predate: "2021-04-16",
          },
          {
            imgpathview: require("@/assets/img/home/new-tabs-img.png"),
            title: "监管动态",
            summary: "国际分拨中心将为南沙带来2千亿业务 ",
            predate: "2021-04-16",
          },
          {
            imgpathview: require("@/assets/img/home/new-tabs-img.png"),
            title: "监管动态",
            summary: "国际分拨中心将为南沙带来2千亿业务 ",
            predate: "2021-04-16",
          },
          {
            imgpathview: require("@/assets/img/home/new-tabs-img.png"),
            title: "监管动态",
            summary: "国际分拨中心将为南沙带来2千亿业务 ",
            predate: "2021-04-16",
          },
        ],
        tabsData: {
          tabsList0: [
            { catalogname: "监管动态", id: 0 },
            { catalogname: "处置信息", id: 1 },
            { catalogname: "预警信息", id: 2 },
          ],
        },
      },
    };
  },
};
</script>

<style>
</style>
