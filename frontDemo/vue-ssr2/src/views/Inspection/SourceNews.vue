<template>
  <!-- 溯源资讯 -->
  <div class="SourceNews">
    <banner2 :banner-data="bannerData"></banner2>
    <news-tabs
      :news-tabs-data="newsTabsData2"
      @changeTabs="changeTabs"
      @changeBreadcrumb="changeBreadcrumb"></news-tabs>
  </div>
</template>

<script>
import banner2 from "@/components/Banner2.vue";
import newsTabs from "@/components/NewsTabs.vue";
export default {
  name: "SourceNews",
  components: {
    banner2,
    newsTabs,
  },
  data() {
    return {
      bannerData: {
        img: require("@/assets/img/Inspection/source-news-banner.png"),
        title: "溯源资讯",
        textArr: [
          "检验检测行业相关新闻资讯，",
          "便于用户快速掌握检验检测行业动态。",
        ],
      },
      newsTabsData2: {
        breadcrumbItems: [
          { text: "溯源资讯" },
          { text: "预警信息" },
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
    };
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    changeBreadcrumb() {
    },
    changeTabs() {
    },
  },
};
</script>

<style>
</style>
