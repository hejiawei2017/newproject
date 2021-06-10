<template>
  <div class="container news-tabs">
    <div class="news-tabs-header">
      <div class="news-tabs-breadcrumb">
        <span
          v-for="(item, index) in newsTabsData.breadcrumbItems"
          :key="index"
          :class="{ active: breadcrumbActive === index }"
        >
          <span
            class="news-tabs-breadcrumb-link"
            @click="breadcrumbClick(index, item.catalogid)"
            >{{ item.text }}</span
          >
          <span class="news-tabs-breadcrumb-separator">/</span>
        </span>
      </div>
      <a
        v-if="newsTabsData.btnData && newsTabsData.btnData.url"
        :href="newsTabsData.btnData.url"
        class="more-btn btn btn-secondary"
        target="_self"
        >{{ newsTabsData.btnData.text }}</a
      >
    </div>
    <div class="news-tabs-body">
      <div class="news-tabs-body-tabs">
        <div
          v-for="(item, index) in newsTabsNavList"
          :key="index"
          class="tab-item"
          @click="tabsClick(index, item.catalogid)"
        >
          <span :class="{ active: tabsActive === index }">{{
            item.catalogname
          }}</span>
        </div>
      </div>
      <div
        class="news-tabs-body-box animate__animated"
        :class="{ animate__fadeInUpBig: showAnimate }"
      >
        <template v-if="showContentList">
          <div v-if="newsTabsContentData.length !== 0" class="news-tabs-body-content">
            <div
              v-for="(item, index) in newsTabsContentData"
              :key="index"
              class="content-item"
              @click="jumpLink(item.catalogid,item.articleid)"
            >
              <div class="item-img">
                <img :src="BaseImgUrl + item.imgpathview" @error="imgerrorfun"/>
              </div>
              <div class="item-con">
                <div class="con-title" :title="item.title">
                  {{ item.title }}
                </div>
                <div class="con-text" :title="item.summary">
                  {{ item.summary }}
                </div>
                <div class="con-bottom">
                  <div class="bottom-time">{{ timeFormat(item.predate) }}</div>
                  <span class="click-check">点击查看</span>
                </div>
              </div>
            </div>
          </div>
          <h3 v-else>很抱歉，暂时没有内容</h3>
        </template>

        <template  v-else>
          <b-table
            :items="newsTabsData.dataSource"
            :fields="newsTabsData.columns"
            responsive="sm"
            bordered
            hover
            :tbody-tr-class="rowClass"
            tableClass="publicity-table"
            theadClass="publicity-table-header"
            theadTrClass="publicity-table-header-tr"
            style="text-align: center"
          >
            <template #cell(level)="row">
              <i class="iconfont icon-jinggao" style="font-size:18px;margin-right:5px;"></i>{{ row.value }}
            </template>
          </b-table>
        </template>
        <b-pagination
          v-if="isShowPagination"
          v-model="currentPage"
          :total-rows="newsTabsContentDataAll.pageSumCount || 1"
          :per-page="newsTabsContentDataAll.perPage || 4"
          aria-controls="my-table"
          align="center"
          @change="handleChangePage"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
// 中心公服 centerMain 知识产权 intellectual  检测检验 Inspection  产业 industry 消费者 consumer
const pageParams = {
    centerMain: [ { ord: 2030, index: 1 }, { ord: 2040, index: 1 }, { ord: 2050, index: 1 }, ],// 溯源资讯 // 信息公示 // 平台公告
    intellectual: [ { ord: 4020, index: 1 }, { ord: 4010, index: 1 }, { ord: 4030, index: 1 }, ],
    Inspection: [ { ord: 3020, index: 1 }, { ord: 3010, index: 1 }, { ord: 3030, index: 1 }, ],
    consumer: [ { ord: 1030, index: 1 }, { ord: 1020, index: 1 }, { ord: 1040, index: 1 }, ],
    industry: [ { ord: 5020, index: 1 }, { ord: 5030, index: 1 }, { ord: 5040, index: 1 }, ],
}[process.env.SYSTEM_TYPE]
export default {
  name: "NewsTabs",
  props: {
    showPagination: {
      type: Boolean,
      default: false,
    },
    newsTabsData: {
      type: Object,
      default: () => ({
        perPage: 4, // 分页-每页行数
        btnData: {
          // 按钮数据
          url: "",
          text: "查看更多",
        },
        breadcrumbItems: [
          // 面包屑文字
          { text: "溯源资讯" },
          { text: "信息公示" },
          { text: "平台公告" },
        ],
        contentList: [
          // 列表数据
        ],
        columns: [
          // 表格头部数据
          { name: "共建方名称" },
          { level: "共建方警示级别" },
          { creditCode: "统一社会信用代码" },
          { region: "国别/地区" },
          { time: "警示时间" },
          { cause: "警示原因" },
        ],
        dataSource: [
          // 表格列表数据
          {
            name: "某企业",
            level: "1级",
            creditCode: "统一社会信用代码",
            region: "中国",
            time: "2021.4.21",
            cause: "警示原因",
          },
        ],
        tabsData: {
          // 左侧tabs
          type: Object,
          default: () => ({
            tabsList0: []
          }),
        },
      }),
    },
  },
  data() {
    return {
      breadcrumbActive: 0,
      tabsActive: 0,
      currentPage: 1,
      showAnimate: true,
      timeId: null,
      BaseImgUrl: process.env.PROXY_URL + process.env.BASE_IMG_URL,
      tabsArr: [
        {
          title: "溯源资讯",
          fn: "getTraceInformation",
        },
        {
          title: "信息公示",
          fn: "InformationPublicity",
        },
        {
          title: "平台公告",
          fn: "platformMsg",
        },
      ],
    };
  },
  asyncData: {
    getSourceData(store) {
      return store.dispatch('getTraceInformation', pageParams[0]);
    },
  },
  mounted() {
    this.$options.asyncData.getSourceData( this.$store); // 溯源资讯
    this.hideAnimate();
  },
  computed: {
    newsTabsNavList() {
      return this.$store.state.sourceServer.newsTabsNavList.slice(1)
    },
    newsTabsContentDataAll() {
        return this.$store.state.sourceServer.newsTabsContentData
    },
    newsTabsContentData() {
      if (this.$route.path === '/') {
        return _.get(this,'$store.state.sourceServer.newsTabsContentData.datas',[]).slice(0,4)
      }
        return _.get(this,'$store.state.sourceServer.newsTabsContentData.datas',[])
    },
    isShowPagination() {
      let length = 0;
      if (this.breadcrumbActive !== 1 || this.newsTabsContentData.length === 0) {
        length =
          this.newsTabsContentDataAll.pageSumCount || 1;
      } else {
        length =
          this.newsTabsData.dataSource && this.newsTabsData.dataSource.length;
      }
      return this.showPagination && length > this.newsTabsData.perPage;
    },
    showContentList() {
      if (
        this.breadcrumbActive === 1 &&
        this.tabsActive === 0 &&
        this.newsTabsContentData.length === 0
      ) {
        return false;
      }
      if (this.breadcrumbActive === 1 && this.tabsActive !== 0) {
        return true;
      }
      return true;
    },
    timeFormat() {
      return function (time) {
        const timestamp4 = new Date(time); //直接用 new Date(时间戳) 格式转化获得当前时间
        //  + " " + timestamp4.toTimeString().substr(0, 8)
        return timestamp4.toLocaleDateString().replace(/\//g, "-"); //再利用拼接正则等手段转化为yyyy-MM-dd hh:mm:ss 格式
      };
    },
  },
  methods: {
    breadcrumbClick(index, catalogid) { // 面包屑
      if(this.breadcrumbActive === index) return
      this.hideAnimate();
      this.tabsActive = 0;
      this.breadcrumbActive = index;
      this.$store.dispatch(
        this.tabsArr[index].fn,
        pageParams[index]
      );
      this.$emit("changeBreadcrumb", index, catalogid);
    },
    tabsClick(index, catalogid) { // tabs
      if(this.tabsActive === index) return
      this.hideAnimate();
      this.tabsActive = index;
      let params = JSON.parse(JSON.stringify(pageParams[this.breadcrumbActive]))
      params.catalogid = catalogid
      params.index = index + 1
      this.$store.dispatch(
        this.tabsArr[this.breadcrumbActive].fn,
        params
      );
      this.$emit("changeTabs", index, catalogid, this.breadcrumbActive);
    },
    handleChangePage(pageSize) { // 分页
      console.log(pageSize);
      this.$emit("changePage", pageSize);
    },
    jumpLink(catalogid,articleid) { // 跳转
      this.$router.push({ name: "articlen-information", query: {catalogid,articleid} });
    },
    rowClass(item) {
      if (item.rowColor) return "table-color-row";
    },
    hideAnimate() { // 动画
      this.showAnimate = true;
      clearTimeout(this.timeId);
      this.timeId = setTimeout(() => {
        this.showAnimate = false;
      }, 1000);
    },
    imgerrorfun(event) { // 图片
      const img = event.srcElement
      img.src = require('@/assets/img/home/new-tabs-img.png')
      img.onerror = null // 控制不要一直跳动
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/styles/_handle.scss";
.news-tabs {
  overflow: hidden;
  .news-tabs-body-box {
    ::v-deep .pagination {
      font-size: 20px;
      .page-item {
        .page-link {
          @include font_color("font_color2");
          font-weight: 300;
          background-color: #fff;
          border: none;
          &:focus {
            box-shadow: none;
          }
        }
        &.active {
          .page-link {
            @include font_color("font_color1");
            font-weight: 600;
            background-color: #fff;
            border: none;
            &:focus {
              box-shadow: none;
            }
          }
        }
        &:last-child {
          display: none;
        }
        &:first-child {
          display: none;
        }
      }
    }
    ::v-deep .publicity-table {
      .publicity-table-header {
        @include background_color("background_color1");
        .publicity-table-header-tr {
          th {
            font-size: 18px;
            font-weight: 400;
            color: #fff;
            border-bottom-width: 1px;
            @include border_color("border_color1");
          }
        }
      }
      th,
      td {
        padding: 16px;
        border: 1px solid #eee;
      }
      tbody {
        tr {
          background-color: #fff;
        }
      }
      .table-color-row {
        background: #f3f7ff;
      }
    }
  }
}
</style>
