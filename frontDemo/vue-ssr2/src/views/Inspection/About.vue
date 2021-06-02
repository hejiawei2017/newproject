<template>
  <!-- 关于我们 -->
  <div class="about" id="pageList">
    <banner2 :banner-data="aboutBanner"></banner2>
    <content1 :content-one="contentOne" id="mission"></content1>
    <content1 :content-one="contentOneA" id="system"></content1>
    <content4 id="global"></content4>
    <content-tabs id="co-construction"></content-tabs>
    <time-line :timeLineObj="timeLineObj" id="development"></time-line>
    <floor :floorData="floorData"></floor>
  </div>
</template>

<script>
import banner2 from "@/components/Banner2.vue";
import content1 from "@/components/Content1.vue";
import content4 from "@/components/Content4.vue";
import contentTabs from "@/components/ContentTabs.vue";
import timeLine from "@/components/TimeLine.vue";
import Floor from "@/components/Floor.vue";
export default {
  name: "About",
  data() {
    return {
      aboutBanner: {
        img: require("@/assets/img/Inspection/about-banner.png"),
        title: "关于我们",
        text: "",
        textArr: ["为用户介绍全球溯源体系、全球溯源中心、全球溯源发展历程等信息"],
        maxWidth: "745px",
      },
      contentOne: {
        title: "我们的",
        boldTit: "使命",
        text: "助推国际贸易最大程度便利化和自由化, 推动构建人类命运共同体。",
        img: "http://10.10.104.3:80/downloadfromfront/wmdsm.png",
        bgImg: "",
        imgStyle: {
          width: "635px",
          height: "414px",
        },
        leftStyle: {
          color: "#444444",
          width: "400px",
        },
        bgClass: "container",
      },
      contentOneA: {
        title: "全球溯源体系",
        boldTit: "",
        text:
          "全球溯源体系是各国政府部门、企业和消费者共建共享的价值传递体系，以物联网、云计算为手段，创新市场化、法制化、国际化核 心规则，分级采集商品全周期信息，科学分析与精准识别，实现风险 可识别、可控制、可处置，服务于货物流通、贸易便利、权益维护， 构建质量安全与风险可控的国际贸易生态链。",
        subText:
          "秉承共商共建共享原则， 以最低成本实现商品价值的真实传递和国际贸易质量识别，形成新时代国际贸易的中国规则和中国方案，实现风险可控和精准应用，助推国际贸易最大程度便利化和自由化。",
        img: "",
        bgImg: "http://10.10.104.3:80/downloadfromfront/bg1.png",
        imgStyle: {
          width: "635px",
          height: "414px",
        },
        leftStyle: {
          color: "#FFFFFF",
          width: "384px",
        },
        bgClass: "container card-img-overlay",
      },
      timeLineObj: {
        title: "溯源发展历程",
        list: [
          {
            time: "2015",
            text:
              "2015年6月，依托于原检验检疫“智检口岸”平台，全球溯源1.0版系统上线运行。",
          },
          {
            time: "2016",
            text:
              "2016年10月，广东出入境检验检疫局发布全球溯源体系2.0版本。以“一平台、三系统”为架构，引入第三方公证、溯源标识等应用，覆盖全品类的商品溯源应用。",
          },
          {
            time: "2017",
            text:
              "2017年08月，基于公共基础设施理念，发布独立于原检验检疫部门的全球溯源3.0版本。实现全球的互联互通，支撑跨区域、跨行业的溯源应用。",
          },
          {
            time: "2019",
            text:
              "2019年3月，“福州海关全球质量溯源体系”在中国(福建)国际贸易单一窗口上线，实现以标准、质量为核心内容的全链条、闭环式大质量管理机制。",
          },
          {
            time: "2020",
            text:
              "2020年11月，广州南沙和海南洋浦签订协同发展战略合作框架协议，打造港湾联动先行示范区。",
          },
          {
            time: "2021",
            text:
              "2021年3月，中国（山东）自由贸易试验区青岛片区管理委员会与中国（广东）自由贸易试验区广州南沙新区片区管理委员会签署创新发展战略合作框架协议。",
          },
          {
            time: "2021",
            text:
              "2021年X月 ，首个全球溯源中心在南沙上线（全球溯源4.0版本）。",
          }
        ],
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
    };
  },
  components: {
    banner2,
    content1,
    content4,
    contentTabs,
    timeLine,
    Floor,
  },
  methods: {},
};
</script>
