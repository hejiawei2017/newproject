<template>
  <div class="search-detail">
    <div class="container">
      <div class="wrap">
        <h2 class="search-title">常见问题</h2>
        <div class="common-search">
          <input
            v-model="searchValue"
            class="settled-search-input"
            type="text"
            placeholder="请输入内容"
            @keyup.enter="handleSearch"
          />
          <button class="settled-search-btn" @click="handleSearch">
            <img src="@/assets/img/search/searchIcon.png" />
          </button>
        </div>
        <ul
          v-if="searchDetailData.datas && searchDetailData.datas.length !== 0"
          class="search-detail-list"
        >
          <li
            v-for="(item, index) in searchDetailData.datas"
            :key="index"
            class="search-detail-item"
          >
            <h3
              class="search-detail-item-title"
              v-html="`${index + 1}.${item.title}`"
            ></h3>
            <p class="search-detail-item-text">{{ item.summary || "" }}</p>
          </li>
        </ul>
        <h2 class="search-fruitless" v-else>很抱歉，暂时没有查到相关内容</h2>
        <button
          v-if="
            searchDetailData.datas &&
            searchDetailData.datas.length !== 0 &&
            pageSize < searchDetailData.totalRows
          "
          class="search-detail-more"
          @click="handleSeeMore"
        >
          查看更多
        </button>
        <h3
          v-if="
            searchDetailData.datas &&
            searchDetailData.datas.length !== 0 &&
            !(pageSize < searchDetailData.totalRows)
          "
        >
          没有更多了
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchDetail",
  data() {
    return {
      searchValue: "",
      searchContent: "",
      pageSize: 5,
    };
  },
  asyncData: {
    helpcenter(store, option) {
      return store.dispatch("helpcenter", option);
    },
  },
  computed: {
    searchDetailData() {
      const data = JSON.parse(
        JSON.stringify(
          this.$store.state.sourceServer.searchDetailData || { datas: [] }
        )
      );
      data.datas
        ? data.datas.forEach((item) => {
            item.title = item.title.replaceAll(
              this.searchContent,
              `<em>${this.searchContent}</em>`
            );
          })
        : [];
      return data;
    },
  },
  mounted() {
    this.searchValue = this.searchContent = decodeURIComponent(this.$route.query.content || "");
    this.$options.asyncData.helpcenter(this.$store, {
      title: this.searchContent,
      pageParam: { pageNo: 1, rowsPerPage: this.pageSize },
    });
  },
  methods: {
    getHelpcenter() {
      this.$store.dispatch("helpcenter", {
        title: this.searchContent,
        pageParam: { pageNo: 1, rowsPerPage: this.pageSize },
      });
    },
    handleSearch() {
      this.searchContent = this.searchValue;
      this.getHelpcenter();
    },
    handleSeeMore() {
      if (this.pageSize > this.searchDetailData.totalRows) {
        return;
      }
      this.pageSize = this.pageSize + 5;
      this.getHelpcenter();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/_handle.scss";
.search-detail {
  .wrap {
    padding-top: 100px;
    padding-bottom: 100px;
    @include font_color("font_color2");
    .common-search {
      padding: 60px 0;
      width: 610px;
      .settled-search-btn {
        width: 110px;
        img {
          margin-right: 0;
        }
      }
    }
    .search-title {
      font-size: 48px;
    }
    .search-detail-list {
      list-style: none;
      margin: 0;
      padding: 0;
      text-align: left;
      .search-detail-item {
        border-bottom: 1px solid #f2f2f2;
        padding: 30px 0 25px 0;
        .search-detail-item-title {
          margin-bottom: 15px;
          font-size: 24px;
          font-weight: 500;
          span.checked {
            background-color: #000;
          }
        }
        .search-detail-item-text {
          font-size: 14px;
          font-weight: 400;
          line-height: 28px;
        }
        &:last-child {
          border: none;
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
    .search-fruitless {
      padding: 50px 0;
    }
  }
}
</style>
<style lang="scss">
.search-detail {
  .search-detail-item-title {
    em {
      color: #2b29d6;
      font-style: normal;
    }
  }
}
</style>