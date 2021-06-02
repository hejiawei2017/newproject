<template>
  <div class="traceability">
    <banner2 :banner-data="traceabilityBanner"></banner2>
    <news-tabs :news-tabs-data="newsTabsData" showPagination></news-tabs>
  </div>
</template>

<script>
import banner2 from "@/components/Banner2.vue";
import newsTabs from "@/components/NewsTabs.vue";
export default {
  name: "Traceability",
  data() {
    return {
      traceabilityBanner: {
        img: "http://10.10.104.3:80/downloadfromfront/industryZx.png",
        title: "溯源资讯",
        text: "",
        textArr: ["溯源动态展示，实时信息更新"],
        maxWidth: "745px",
      },
      newsTabsData: {
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
    };
  },
  components: {
    banner2,
    newsTabs,
  },
  methods: {},
};
</script>

<style scoped>
</style>
