<template>
  <div class="home">
    <banner></banner>
    <pane-b-i></pane-b-i>
    <scene-serv></scene-serv>
    <apply-carousel></apply-carousel>
    <content6></content6>
    <news-tabs :newsTabsData="newsTabsData"></news-tabs>
    <file-panel></file-panel>
    <!--<unit-list></unit-list>-->
    <join-us title="加入溯源" title2="Join us"></join-us>
  </div>
</template>

<script>
// @ is an alias to /src
import Banner from "@/components/Banner.vue";
import ApplyCarousel from "@/components/ApplyCarousel.vue";
import PaneBI from "@/components/PaneBI.vue";
import FilePanel from "@/components/FilePanel.vue";
import UnitList from "@/components/UnitList.vue";
import JoinUs from "@/components/JoinUs.vue";
import newsTabs from "@/components/NewsTabs.vue";
import SceneServ from "@/components/SceneServ.vue";
import Content6 from "@/components/Content6.vue";

export default {
  name: "Home",
  components: {
    Banner,
    SceneServ,
    ApplyCarousel,
    PaneBI,
    FilePanel,
    UnitList,
    JoinUs,
    newsTabs,
    Content6
  },
  data() {
    return {
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
    };
  },
};
</script>

