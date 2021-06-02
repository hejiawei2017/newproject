<template>
  <div class="institution">
    <div class="container">
      <div class="search-cont">
        <input
          type="text"
          class="search-input" 
          v-model="ccodename" 
          placeholder="请输入您想查询的机构名称"
          @keyup.enter="handleClickSearh"
        />
        <button class="search-btn" type="button" @click="handleClickSearh">
          <img src="../assets/img/search/searchIcon.png" alt="" />
          <span>查&nbsp;&nbsp;&nbsp;&nbsp;询</span>
        </button>
      </div>
      <button v-if="institutionList.datas && showEvaluateBtn" class="evaluate" @click="handleEvaluate">服务商评价</button>
      <div class="tabs-cont">
        <div v-if="institutionList.datas" class="wrap">
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
            v-for="(item, index) in institutionList.datas"
            :key="index"
            class="tabs-line"
          >
            <img
              :src="BaseImgUrl + item.ccodelogo"
              class="tabs-list-img"
              @error="imgerrorfun"
            />
            <div class="body">
              <b-row>
                <b-col>
                  <span class="label">机构名称：</span>
                  <span class="text">{{ item.editccodename }}</span>
                </b-col>
                <b-col>
                  <span class="label">评分：</span>
                  <span class="text">
                    <i
                      v-for="(item2, index2) in 5"
                      :key="index2"
                      class="iconfont"
                      :class="index2 < Math.round(item.grad) ? 'icon-start-i' : 'icon-stars-lines'"
                      style="margin-right:5px;"
                      :style="{ color: index2 < Math.round(item.grad) ? '#ec8200':''}"
                    ></i>
                  </span>
                </b-col>
                <b-col> </b-col>
              </b-row>
              <b-row>
                <b-col style="white-space: nowrap;">
                  <span class="label">服务行业&nbsp;/&nbsp;领域：</span>
                  <span class="text">{{ item.servicerangename }}</span>
                </b-col>
                <b-col style="white-space: nowrap;">
                  <span class="label">服务范围：</span>
                  <span class="text">{{ item.serviceareaname }}</span>
                </b-col>
                <b-col style="white-space: nowrap;">
                  <span class="label">联系方式：</span>
                  <span class="text">{{ item.linktel }}</span>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <span class="label">服务简介:</span>
                  <div v-html="item.serviceexplain" class="text" style="display:inline-block;"></div>
                </b-col>
              </b-row>
            </div>
            <i
              class="tab-flag iconfont icon-tuijian"
            />
          </div>
        </div>
        <empty v-else></empty>
        <div class="Ins-pagination">
          <MyPagination
            v-if="institutionList.datas"
            :total="institutionList.pageSumCount"
            :perPage="institutionList.rowsPerPage"
            :itemBgColor="'#fff'"
            @changePage="handleChangePage"
          ></MyPagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyPagination from "./MyPagination";
import empty from '@/components/empty'
export default {
  name: "Institution",
  props: {
    showEvaluateBtn: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MyPagination,
    empty
  },
  data() {
    return {
      tabs: [
        {
          key: "300002",
          value: "服务分类 1",
        },
        {
          key: "300003",
          value: "服务分类 2",
        },
      ],
      tabKey: "300002",
      ccodename:'',
      BaseImgUrl: process.env.PROXY_URL + process.env.BASE_IMG_URL,
    };
  },
  asyncData: {
    institutionList(store, data) {
      return store.dispatch("institutionList", data);
    },
  },
  computed: {
    institutionList() {
      return this.$store.state.sourceServer.institutionData;
    },
    arrLength() {
      return function (length) {
        let len = 1;
        if (length) {
          len = length;
        }
        return Math.round(len);
      };
    },
  },
  mounted() {
    this.$options.asyncData.institutionList(this.$store, {
      cbmsubtype: "300002",
    });
  },
  methods: {
    handleChangePage(index) {
      console.log(index);
    },
    changeTabs(key) {
      this.tabKey = key;
      this.$options.asyncData.institutionList(this.$store, {
        cbmsubtype: key,
      });
    },
    handleClickSearh() {
      this.$store.dispatch("institutionList", { cbmsubtype: this.tabKey,ccodename: this.ccodename });
    },
    handleEvaluate() {
      this.$router.push({name:'ServiceEvaluation'})
    },
    imgerrorfun(event) { // 图片
      const img = event.srcElement
      img.src = require('@/assets/img/institution/dome-img.png')
      img.onerror = null // 控制不要一直跳动
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/_handle.scss";
.institution {
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
  .evaluate {
    display: inline-block;
    margin-bottom: 100px;
    width: 123px;
    height: 38px;
    line-height: 38px;
    border: 1px solid #a7a7a7;
    font-size: 16px;
    font-weight: 400;
    color: #a7a7a7;
    cursor: pointer;
  }
}
</style>
