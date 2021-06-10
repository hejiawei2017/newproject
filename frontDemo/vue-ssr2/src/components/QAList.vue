<template>
  <div class="qa-list" :style="qaList.bgImg ? `backgroundImage:url(${qaList.bgImg})`: ''">
    <div class="container">
      <div class="wrap">
        <h3 class="qa-title">{{ qaList.title || '常见问题' }}</h3>
        <div class="qa-tabs-list">
          <div class="qa-tabs-left">
            <div
              v-for="(item, index) in columns"
              :key="index"
              class="qa-tabs-left-item"
              :class="{ active: active === index }"
              @click="handleChange(index,item.catalogid)"
            >
              {{ item.catalogname }}
            </div>
          </div>
          <div class="qa-tabs-right">
            <ul class="qa-tabs-right-list">
              <li
                v-for="(item, index) in contentListAll.datas"
                :key="index"
                class="qa-tabs-right-item"
              >
                <h3 class="qa-tabs-right-item-title">{{ item.title }}</h3>
                <p class="qa-tabs-right-item-text">{{ item.summary }}</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="qa-tabs-pagination">
          <b-pagination
            v-if="contentListAll.totalRows > perPage"
            v-model="currentPage"
            :total-rows="contentListAll.totalRows"
            :per-page="perPage"
            align="center"
            @change="changePage"
          ></b-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: "QAList",
  props: {
    qaList: {
      type: Object,
      default: () => ({
        bgImg: "",
      }),
    },
  },
  data() {
    return {
      active: 1,
      perPage: 4,
      currentPage: 1,
      catalogid: '',
    };
  },
  asyncData: {
    commonProblem(store) {
      return store.dispatch("commonProblem",{"pageParam": { "firstRow": 0, "pageNo": 1, "rowsPerPage": 4 }});
    },
  },
  mounted () {
    this.$options.asyncData.commonProblem(this.$store);
  },
  computed: {
    columns() {
      const list = _.cloneDeep(this.$store.state.sourceServer.qaListTabsData)
      return list.map(item=>{
        if (item.catalogname === "帮助中心-常见问题") {
          item.catalogname = '问题分类'
        }
        if (item.catalogname === "全球溯源信息化系统") {
          item.catalogname = item.catalogname.replace('信息','\n信息')
        }
        return item
      })
    },
    contentListAll() {
      return this.$store.state.sourceServer.qaListContentData
    },
  },
  methods: {
    handleChange(index,catalogid) {
      if (index === 0 || this.active === index) return;
      this.active = index;
      this.catalogid = catalogid;
      this.$store.dispatch('commonProblem',{ catalogid,"pageParam": {
          "firstRow": 0,
          "pageNo": this.currentPage,
          "rowsPerPage": this.perPage
      }});
    },
    changePage(pageSiz) {
      this.currentPage = pageSiz
      this.$store.dispatch('commonProblem',{ catalogid: this.catalogid || 'qqsyxxhxt',"pageParam": {
          "firstRow": 0,
          "pageNo": pageSiz,
          "rowsPerPage": this.perPage
      }});
      console.log(pageSiz);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/_handle.scss";
.qa-list {
  ::v-deep .pagination {
    margin: 0;
    font-size: 20px;
    .page-item {
      .page-link {
        @include font_color("font_color2");
        font-weight: 300;
        background-color: transparent;
        border: none;
        &:focus {
          box-shadow: none;
        }
      }
      &.active {
        .page-link {
          @include font_color("font_color1");
          font-weight: 600;
          background-color: transparent;
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
}
</style>
