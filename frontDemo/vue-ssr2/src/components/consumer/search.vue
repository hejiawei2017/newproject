<template>
  <div class="consumer-search">
    <div class="container">
      <div class="wrap">
        <h3 class="consumer-search-title">
          <span class="consumer-search-title-normal">溯源查询，帮助您</span
          >发现商品真实价值
        </h3>
        <p class="consumer-search-text">
          溯源为数字时代的商品数据采集、识别和处置
        </p>
        <p class="consumer-search-text">提供了一套高效低成本的工具</p>
        <div class="common-search">
          <div class="search-select">
            <div class="search-select-text">溯源标识</div>
            <span>
              <b-icon icon="chevron-down"></b-icon>
            </span>
          </div>
          <input
            v-model="searchValue"
            class="settled-search-input"
            type="text"
            placeholder="请输入溯源标识值"
          />
          <button class="settled-search-btn">
            <img src="@/assets/img/search/searchIcon.png" />查询
          </button>
        </div>
        <div class="search-learn-more">
          <span class="search-learn-more-text">如您想了解更多溯源信息</span>
          <button class="search-learn-more-btn">加入溯源</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchValue:'',
      selectValue:'0',
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/_handle.scss";
.consumer-search {
  @include font_color("font_color2");
  padding: 100px 0;
  height: 775px;
  font-weight: 400;
  background: url("~@/assets/img/consumer/search-bj.png") no-repeat center;
  background-size: cover;
  .wrap {
    .consumer-search-title {
      margin-bottom: 30px;
      font-size: 48px;
      .consumer-search-title-normal {
        font-weight: 300;
      }
    }
    .consumer-search-text {
      margin: 0;
      font-size: 20px;
      &:last-child {
        margin-bottom: 60px;
      }
    }
    .search-select {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 140px;
      height: 66px;
      background: #f8f8f8;;
      .search-select-text {
        padding-right: 10px;
        font-size: 20px;
      }
    }
    .search-learn-more {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 30px;
      .search-learn-more-text {
        margin-bottom: 13px;
        font-size: 14px;
      }
      .search-learn-more-btn {
        outline: none;
        width: 151px;
        height: 42px;
        border: 1px solid;
        @include border_color("border_color2");
      }
    }
  }
}
</style>