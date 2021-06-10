<template>
  <div class="service-evaluation">
    <div class="wrap">
      <div class="service-evaluation-bg">
        <div class="container">
          <h2 class="search-title">服务商评价查看</h2>
          <div class="common-search">
            <input
              v-model="ccodename"
              class="settled-search-input"
              type="text"
              placeholder="请输入您想查询的机构名称 "
            />
            <button class="settled-search-btn" @click="handleSearch">
              <img src="@/assets/img/search/searchIcon.png" />
            </button>
          </div>
        </div>
      </div>
      <template v-if="institutionData.datas">
        <div class="container">
          <ul class="tabs-list">
            <li
              v-for="item in tabs"
              :key="item.key"
              class="tabs-item"
              :class="{ active: tabKey === item.key }"
              @click="changeTabs(item.key)"
            >
              {{ item.value }}
            </li>
          </ul>
          <div
            v-for="(item, index) in institutionData.datas"
            :key="index"
            class="tabs-line"
          >
            <!-- <img
              :src="BaseImgUrl + item.ccodelogo"
              class="tabs-list-img"
              @error="imgerrorfun"
            /> -->
            <div class="body">
              <b-row style="margin-bottom: 10px;">
                <b-col>
                  <span class="title">{{ item.beeditccodename }}</span>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <span class="label">服务价格：</span>
                  <span class="text">
                    <i
                      v-for="(item2, index2) in 5"
                      :key="index2"
                      class="iconfont"
                      :class=" index2 < Math.round(+item.pricegrade) ? 'icon-start-i' : 'icon-stars-lines' "
                      style="margin-right: 5px"
                      :style="{ color: index2 < Math.round(+item.pricegrade) ? '#ec8200' : '', }"
                    ></i>
                  </span>
                </b-col>
                <b-col>
                  <span class="label">服务品质：</span>
                  <span class="text">
                    <i
                      v-for="(item2, index2) in 5"
                      :key="index2"
                      class="iconfont"
                      :class=" index2 < Math.round(+item.qualitygrade) ? 'icon-start-i' : 'icon-stars-lines' "
                      style="margin-right: 5px"
                      :style="{ color: index2 < Math.round(+item.qualitygrade) ? '#ec8200' : '', }"
                    ></i>
                  </span>
                </b-col>
                <b-col></b-col>
                <b-col></b-col>
              </b-row>
                
                <b-row>
                  <b-col>
                  <span class="label">服务效率：</span>
                  <span class="text">
                    <i
                      v-for="(item2, index2) in 5"
                      :key="index2"
                      class="iconfont"
                      :class=" index2 < Math.round(+item.efficiencygrade) ? 'icon-start-i' : 'icon-stars-lines' "
                      style="margin-right: 5px"
                      :style="{ color: index2 < Math.round(+item.efficiencygrade) ? '#ec8200' : '', }"
                    ></i>
                  </span>
                </b-col>
                <b-col>
                  <span class="label">服务态度：</span>
                  <span class="text">
                    <i
                      v-for="(item2, index2) in 5"
                      :key="index2"
                      class="iconfont"
                      :class=" index2 < Math.round(+item.attitudegrade) ? 'icon-start-i' : 'icon-stars-lines' "
                      style="margin-right: 5px"
                      :style="{ color: index2 < Math.round(+item.attitudegrade) ? '#ec8200' : '', }"
                    ></i>
                  </span>
                </b-col>
                <b-col>
                  <span class="label">反馈时间：</span>
                  <span class="text">
                    {{ $moment(item.evaluatedate).format('YYYY-MM-DD')}}
                  </span>
                </b-col>
                <b-col>
                  <span class="label-inline">需求服务</span>
                  <span class="label">服务编号</span>
                  <span class="text">
                    {{ item.sourcerecpcode || '无' }}
                  </span>
                </b-col>
                </b-row>
                
              <b-row class="intro">
                <b-col>
                  <span class="label intro">服务简介:</span>
                  <div style="display:inline-block;" class="text" v-html="item.req_typename"></div>
                </b-col>
              </b-row>
            </div>
            <!-- <i class="tab-flag iconfont icon-tuijian" /> -->
          </div>
          <button v-if="pageSize < institutionData.totalRows" class="search-detail-more" @click="handleSeeMore">查看更多</button>
        </div>
      </template>
      <empty v-else></empty>
    </div>
  </div>
</template>

<script>
import empty from '@/components/empty'
import _ from 'lodash'
export default {
  name: "ServiceEvaluation",
  components: {
    empty
  },
  data() {
    return {
      tabs: [
        {
          key: "300002",
          value: "评价记录",
        },
        // {
        //   key: "300003",
        //   value: "服务分类 2",
        // },
      ],
      tabKey: "300002",
      ccodename: "",
      pageSize: 5,
      BaseImgUrl: process.env.PROXY_URL + process.env.BASE_IMG_URL,
    };
  },
  asyncData: {
    plEvaluation(store, data) {
      return store.dispatch("plEvaluation", data);
    },
  },
  computed: {
    institutionData() {
      return _.get(this,'$store.state.sourceServer.plEvaluation',{});
    },
  },
  mounted() {
    this.$options.asyncData.plEvaluation(this.$store);
  },
  methods: {
    handleSearch() {
      // this.tabKey = "300002";
      // this.$store.dispatch("institutionList", { ccodename: this.ccodename });
    },
    changeTabs(key) {
      this.tabKey = key;
      this.$store.dispatch("institutionList", { cbmsubtype: key });
    },
    handleSeeMore() {
      if (this.pageSize > this.institutionData.totalRows) {
        return
      }
      this.pageSize = this.pageSize + 5
      this.$store.dispatch("plEvaluation", { "pageParam": {
          "firstRow": 0,
          "pageNo": 1,
          "rowsPerPage": this.pageSize
      },});
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/_handle.scss";
.service-evaluation {
  .container {
    padding-bottom: 80px;
  }
  .wrap {
    @include font_color("font_color2");
    .service-evaluation-bg {
      padding: 100px 0 150px;
      margin-bottom: 50px;
      background: url('~@/assets/img/Inspection/serviceEvaluation.png') no-repeat top center;
      background-size: cover;
      .common-search {
        padding: 60px 0;
      }
    }
    .search-title {
      color: #fff;
      font-size: 48px;
    }
    .search-detail-list {
      list-style: none;
      margin: 0;
      padding: 0;
      text-align: left;
      .search-detail-item {
        .search-detail-item-title {
          margin-bottom: 15px;
          font-size: 24px;
          font-weight: 500;
        }
        .search-detail-item-text {
          font-size: 14px;
          font-weight: 400;
          line-height: 28px;
        }
      }
    }
    .search-detail-more {
      margin-top: 80px;
      width: 136px;
      height: 43px;
      @include background_color("background_color1");
      color: #fff;
      outline: none;
      border: none;
    }
    .tabs-list {
      display: flex;
      margin: 0;
      padding: 0;
      list-style: none;
      user-select: none;
      .tabs-item {
        padding: 0 30px;
        width: 198px;
        height: 50px;
        line-height: 50px;
        background: #ededed;
        border-radius: 4px 4px 0px 0px;
        font-size: 20px;
        font-weight: 400;
        color: #252525;
        text-align: center;
        cursor: pointer;
        &.active {
          @include background_color("background_color1");
          color: #fff;
        }
      }
    }
    .tabs-line {
      display: flex;
      padding: 48px 50px 54px 45px;
      position: relative;
      &:nth-child(odd) {
        background-color: rgba(231, 231, 231, 0.2);
      }
      &:nth-child(even) {
        background-color: rgba(231, 231, 231, 0.5);
      }
    }
    .tabs-list-img {
      width: 182px;
      height: 162px;
      margin-right: 45px;
    }
    .body {
      width: 100%;
      text-align: left;
      line-height: 32px;
      .title {
        margin-bottom: 10px;
        font-size: 20px;
        font-weight: 400;
      }
      .col {
        padding: 0;
        width: 25%;
        white-space: nowrap;
        .text {
          white-space: pre-wrap;
          vertical-align: top;
        }
        .label.intro {
          margin-right: 10px;
        }
      }
      .intro {
        margin-top: 15px;
      }
    }
    .label {
      font-weight: 500;
    }
    .label-inline {
      display: inline-block;
      padding: 0 15px;
      margin-right: 5px;
      color: #fff;
      background-color: rgb(4 65 179 / 50%);
      border-radius: 13px;
    }
    .text {
      color: #444444;
      font-size: 14px;
    }
    .tab-flag{
      position: absolute;
      top: -6px;
      right: -6px;
      font-size: 32px;
      @include font_color('font_color1')
    }
  }
}
</style>