<template>
  <!-- 首页 -->
  <div class="home">
    <banner class="cutppt"></banner>
    <content-tabs :contentTabs="contentTabs" class="cutppt"></content-tabs>
    <serv-announcement class="cutppt"></serv-announcement>
    <content0 :content-zero="coContent" class="cutppt"></content0>
    <pane-b-i class="cutppt"></pane-b-i>
    <file-panel class="cutppt"></file-panel>
    <news-tabs
      class="cutppt"
      :news-tabs-data="newsTabsData2"
      @changeBreadcrumb="changeBreadcrumb"
      @changeTabs="changeTabs"
    ></news-tabs>
    <unit-list class="cutppt"></unit-list>
    <join-us title="加入溯源" title2="Join us" class="cutppt"></join-us>
  </div>
</template>

<script>
// @ is an alias to /src
import Banner from "@/components/Inspection/Banner0.vue";
import ContentTabs from "@/components/ContentTabs.vue";
import Content0 from "@/components/Content0.vue";
import PaneBI from "@/components/PaneBI.vue";
import FilePanel from "@/components/FilePanel.vue";
import UnitList from "@/components/UnitList.vue";
import JoinUs from "@/components/JoinUs.vue";
import newsTabs from "@/components/NewsTabs.vue";
import ServAnnouncement from "@/components/ServAnnouncement.vue";
import scrollReveal from "scrollreveal";

export default {
  name: "Home",
  components: {
    Banner,
    ContentTabs,
    Content0,
    PaneBI,
    FilePanel,
    UnitList,
    JoinUs,
    newsTabs,
    ServAnnouncement
  },
  data() {
    return {
      breadcrumbActive: 0,
      newsTabsData2: {
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
      contentTabs: {
        title: "检验检测场景", // 标题1
        tabsList: [
          { text: "检测报告安装“追踪器”", id: 0 },
          { text: "了解报告使用情况", id: 1 },
        ],
        bjImg: require("@/assets/img/Inspection/contentTabs-bjImg.png"), // 背景图片
        contentList: [
          // 文字内容
          {
            text: `全球溯源中心汇集商品全生命周期的溯源数据，包含检报告等信息。依据共享规则，全球溯源中心将商品溯源数据中的检测报告相关数据，自动共享给加入全球溯源体系的检测报告出具机构。`,
          },
          {
            text: `通过共享的检测报告相关数据，检测机构可追踪其检报告在市场上的应用情况，并自主标记检测报告的真伪。`,
          },
          {
            text: `检测机构反馈的检测报告真伪标记情况，将反馈给对应企业、监管机构以及作为商品溯源数据反馈至全球溯源中心。`,
          },
        ],
      },
      coContent: {
        title: "用户收获",
        itemStyle: {
          width: "251px",
        },
        contentZeroStyle: {
          background: `url(${require("@/assets/img/Inspection/contnet-zero-bj.png")}) no-repeat center`,
          backgroundSize: "cover",
        },
        imgStyle: {
          width: "245px",
          height: "245px",
          lineHeight: "245px",
          borderRadius: "122px",
          backgroundColor: "rgba(0, 126, 255,.1)",
        },
        itemImgStyle: {
          width: "65%",
          height: "80%",
          marginBottom: "15%",
        },
        bodyData: [
          {
            img: require("@/assets/img/Inspection/content0-icon-1.png"),
            hoverImg: require("@/assets/img/Inspection/content0-icon-1-hover.png"),
            tit:'权威性',
            text: "检验检测公共服务平台提供窗口，向全球各相关方展示、普及、介绍全球溯源体系与检验检测的关系",
          },
          {
            img: require("@/assets/img/Inspection/content0-icon-2.png"),
            hoverImg: require("@/assets/img/Inspection/content0-icon-2-hover.png"),
            tit:'专业性',
            text: "检验检测公共服务平台搭建高效便捷的信息化平台，为检验检测机构有效识别检测证书/报告真伪，维护自身品牌；为相关方提供线上专业知识交流平台，为监管部门提供检验检测相关风险预警、产业辅导，政策宣贯渠道；",
          },
          {
            img: require("@/assets/img/Inspection/content0-icon-3.png"),
            hoverImg: require("@/assets/img/Inspection/content0-icon-3-hover.png"),
            tit:'便利性',
            text: "全球溯源体系搭建高效便捷的信息化平台，为溯源共建方提供高效、便捷的一站式检验检测商业服务；",
          },
          {
            img: require("@/assets/img/Inspection/content0-icon-4.png"),
            hoverImg: require("@/assets/img/Inspection/content0-icon-4-hover.png"),
            tit:'开放性',
            text: "全球潮源体系秉持“共建共享。真实安全、开放便利”原则，对世界所有有需求、与全球溯源体系拥有相同愿景的检验检测、认证机构免费开放。",
          },
        ],
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
  computed: {},
  methods: {
    changeBreadcrumb(index) {
      this.breadcrumbActive = index;
      this.setBtnUrl();
    },
    setBtnUrl() {
      if (this.breadcrumbActive === 0) {
        this.newsTabsData2.btnData.url = "/source-news";
      }
      if (this.breadcrumbActive === 1) {
        this.newsTabsData2.btnData.url = "/message-publicity";
      }
      if (this.breadcrumbActive === 2) {
        this.newsTabsData2.btnData.url;
      }
    },
    changeTabs() {},
  },
};
</script>
