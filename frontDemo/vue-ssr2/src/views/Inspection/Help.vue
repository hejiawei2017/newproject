<template>
  <!-- 帮助中心 -->
  <div class="help">
    <Search1></Search1>
    <QAList></QAList>
    <DocContent :tabsData="tabsData"></DocContent>
    <StandardLibrary :tabsData="tabsData"></StandardLibrary>
    <Content0 :content-zero="coContent" @itemClick="clickContent0Item"></Content0>
  </div>
</template>

<script>
import Search1 from "@/components/Search1.vue";
import Content0 from "@/components/Content0.vue";
import QAList from "@/components/QAList.vue";
import DocContent from "@/components/DocContent.vue";
import StandardLibrary from "@/components/Inspection/StandardLibrary.vue";
const pconfig = require('../../p.config')
export default {
  name: "Help",
  components: {
    Content0,
    QAList,
    DocContent,
    Search1,
    StandardLibrary,
  },
  data() {
    return {
      coContent: {
        title: "自助服务",
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
        itemImgStyle: {
          height: "100%",
        },
        bodyData: [
          {
            img: require("@/assets/img/Inspection/pw.png"),
            imgText: "找回密码",
            hoverImg: require("@/assets/img/Inspection/pw-hover.png"),
            tit: "",
            text: "",
            clickUrl: pconfig.forgotpassUrl
          },
          {
            img: require("@/assets/img/Inspection/xiugai.png"),
            imgText: "找回账号",
            hoverImg: require("@/assets/img/Inspection/xiugai-hover.png"),
            tit: "",
            text: "",
            clickUrl: pconfig.findaccount
          },
          {
            img: require("@/assets/img/Inspection/account.png"),
            imgText: "登记信息修改",
            hoverImg: require("@/assets/img/Inspection/account-hover.png"),
            tit: "",
            text: "",
            clickUrl: pconfig.personalcenter
          },
        ],
      },
      tabsData: {
        title: "帮助文档",
        title2: "下载",
        list: [
          {
            id: 0,
            text: "客户端配置文档",
          },
          {
            id: 1,
            text: "其他帮助文档",
          },
        ],
        content:
          "不同的共建方使用客户端的方法，包括客户端配置、用户关联等内容。帮助共建方通过客户端将自身数据传输至全球溯源中心，并提供客户端的下载说明。",
        dowText: "下载文档",
      },
    };
  },
  methods: {
    clickContent0Item(item) {
      window.open(item.clickUrl);
    }
  }
};
</script>

<style scoped>
</style>
