<template>
  <!-- 溯源资讯 -->
  <div class="SourceNews">
    <banner2 :banner-data="bannerData"></banner2>
    <news-tabs :news-tabs-data="newsTabsData" showPagination></news-tabs>
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
        img: require("@/assets/img/consumer/source-news-banner.png"),
        title: "溯源资讯",
        textArr: [
          "消费者权益保护平台相关新闻资讯，便于用户快速了解、掌握消费者权益保护动态","包括行业动态、政策法规等内容。"
        ],
      },
      newsTabsData: {
        perPage: 10, // 分页-每页行数
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
    };
  },
};
</script>

<style>
</style>
