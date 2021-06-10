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
        img: "http://10.10.104.3:80/downloadfromfront/zx.png",
        title: "溯源资讯",
        text: "",
        textArr: ["溯源动态展示，实时信息更新"],
        maxWidth: "745px",
      },
      newsTabsData: {
        perPage: 4, // 分页-每页行数
        breadcrumbItems: [ // 面包屑文字
          { text: "行业动态" },
          { text: "政策法则" },
          { text: "信息公示" },
          { text: "平台公告" },
        ],
        columns: [ // 表格头部数据
          { name: "共建方名称" },
          { level: "共建方警示级别" },
          { creditCode: "统一社会信用代码" },
          { region: "国别/地区" },
          { time: "警示时间" },
          { cause: "警示原因" },
        ],
        dataSource: [ // 表格数据
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
