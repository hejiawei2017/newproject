<template>
  <div class="doc-content">
    <div class="container">
      <div class="wrap">
        <div class="content-tabs-left">
          <h3 class="left-title">
            {{ tabsData.title }}
            <span>{{ tabsData.title2 }}</span>
          </h3>
          <div class="c-line"></div>
          <div class="content-tabs-left-tabs">
            <div
              v-for="(item, index) in docContentTabs"
              :key="index"
              class="tabs-item"
            >
              <span
                class="tabs-item-text"
                :class="{ active: active === index }"
                @click="handleTabsClick(index, item.catalogid)"
                >{{ item.catalogname }}</span
              >
            </div>
          </div>
        </div>
        <div class="content-tabs-right">
          <div class="content-tabs-right-box">
            <div class="content-text">
              {{ docContent.summary || "" }}
            </div>
            <span
              class="dow-btn"
              @click="
                download(
                  BaseUrl + helpDetailData.pathview
                )
              "
              >下载文档</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DocContent",
  props: {
    tabsData: {
      type: Object,
    },
  },
  data() {
    return {
      active: 0,
      BaseUrl: process.env.PROXY_URL + process.env.BASE_IMG_URL,
    };
  },
  asyncData: {
    helpfile(store, data) {
      return store.dispatch("helpfile", data);
    },
  },
  computed: {
    docContentTabs() {
      return this.$store.state.sourceServer.docContentTabs.slice(1);
    },
    docContent() {
      return (
        (this.$store.state.sourceServer.docContent.datas &&
          this.$store.state.sourceServer.docContent.datas[0]) ||
        {}
      );
    },
    helpDetailData() {
      return this.$store.state.sourceServer.helpDetailData.resource[0] || {}
    }
  },
  mounted() {
    this.$options.asyncData.helpfile(this.$store);
  },
  methods: {
    handleTabsClick(index, catalogid) {
      this.active = index;
      this.$options.asyncData.helpfile(this.$store, { catalogid });
    },
    download(url,optcontent,isExcel=false,functionmodule) {
      /*downloadmode=1时，图片、文本等类型的文件不会进行下载，改为2就可以了*/
      url = url.replace("downloadmode=1", "downloadmode=2");
      function downloadinner(urli) {
        let iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = urli;
        document.body.appendChild(iframe);
      }
      if (navigator.userAgent.indexOf("Firefox") > 0) {
        downloadinner(url);
      } else {
        let a = document.createElement("a");
        a.href = url;
        a.download = this.getDownLoadFileName(url);
        // a.target = "_blank";
        a.style.position = "absolute";
        a.style.top = "-3000px";
        a.style.left = "-3000px";
        a.style.top = "-1";
        document.body.appendChild(a);
        a.click();
        a.parentNode.removeChild(a);
      }
      if (optcontent) {
        let params = {
          opttype: isExcel ? "08" : "06", // isExcel?导出:下载
          optcontent: `【%OptType%】了名称为【${optcontent}】的数据。`, //下载附件名称
        };
        if (functionmodule) {
          params["functionmodule"] = functionmodule;
        }
      }
    },
    getDownLoadFileName(url) {
      let arrUrl = url.split('/');
      let strPage = arrUrl[arrUrl.length - 1];
      strPage = strPage.split('?')[0];
      if (strPage.indexOf('/#/') != -1) {
        strPage = strPage.replace('/#/', '?');
        strPage = strPage.split('?')[0];
      }
      return strPage;
    }
  },
};
</script>

<style scoped lang="scss"></style>
