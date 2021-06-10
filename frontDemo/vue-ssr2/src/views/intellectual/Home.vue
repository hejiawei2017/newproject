<template>
  <div class="home">
    <banner></banner>
    <business-process></business-process>
    <apply-carousel
      :applyData="applyCarouselData"
      @handleUp="handleUp"
      @handleNext="handleNext"
      ></apply-carousel>
    <content5></content5>
    <pane-b-i></pane-b-i>
    <news-tabs :newsTabsData="newsTabsData"></news-tabs>
    <file-panel></file-panel>
    <unit-list></unit-list>
    <join-us title="加入溯源" title2="Join us"></join-us>
  </div>
</template>

<script>
// @ is an alias to /src
import Banner from "@/components/Banner.vue";
import Content5 from "@/components/Content5.vue";
import ApplyCarousel from "@/components/ApplyCarousel.vue";
import PaneBI from "@/components/PaneBI.vue";
import FilePanel from "@/components/FilePanel.vue";
import UnitList from "@/components/UnitList.vue";
import JoinUs from "@/components/JoinUs.vue";
import newsTabs from "@/components/NewsTabs.vue";
import BusinessProcess from '@/components/BusinessProcess'

export default {
  name: "Home",
  components: {
    Banner,
    Content5,
    ApplyCarousel,
    PaneBI,
    FilePanel,
    UnitList,
    JoinUs,
    newsTabs,
    BusinessProcess
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
          { text: "政策法则" },
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
      BaseImgUrl: process.env.PROXY_URL + process.env.BASE_IMG_URL,
    };
  },
  asyncData: {
    knowledgeProtect(store) {
      // 平台公告
      return store.dispatch('knowledgeProtect');
    },
  },
  mounted () {
    this.$options.asyncData.knowledgeProtect(this.$store);
  },
  computed: {
    knowledgeData() {
      return this.$store.state.sourceServer.knowledgeData
    },
    applyCarouselData(){
      return {
          title: '知识产权',
          titleBold: '保护案例',
          applyArr: [
            {
              text: this.knowledgeData.datas && this.knowledgeData.datas[0].summary || '',
              img: this.knowledgeData.datas && this.BaseImgUrl + this.knowledgeData.datas[0].imgpathview || '',
            },
          ],
          articleid: this.knowledgeData.datas && this.knowledgeData.datas[0].articleid || '',
          catalogid: this.knowledgeData.datas && this.knowledgeData.datas[0].catalogid || '',
          pageNo: this.knowledgeData.pageNo,
          pageSumCount: this.knowledgeData.pageSumCount,
      }
    }
  },
  methods: {
    handleUp() {
      // 上一页
      console.log("上一页");
    },
    handleNext() {
      // 下一页
      console.log("下一页");
    },
  }
};
</script>

