<template>
  <div class="standard-library">
    <div class="container">
      <div class="wrap">
        <h2 class="standard-library-title">检验检测标准库</h2>
        <div class="common-search">
          <input
            v-model="searchValue"
            class="settled-search-input"
            type="text"
            placeholder="请输入您想查询的机构名称"
          />
          <button class="settled-search-btn">
            <img src="@/assets/img/search/searchIcon.png" />查询
          </button>
        </div>
        <div class="standard-library-list">
          <div class="content-tabs-left">
            <div class="c-line"></div>
            <div class="content-tabs-left-tabs">
              <div
                v-for="(item, index) in tabsData.list"
                :key="item.id"
                class="tabs-item"
              >
                <span
                  class="tabs-item-text"
                  :class="{ active: active === index }"
                  @click="handleTabsClick(index)"
                  >{{ item.text }}</span
                >
              </div>
            </div>
          </div>
          <div class="content-tabs-right">
            <div class="standard-library-content">
              <h2 class="standard-library-content-title">
                {{ contentData.title }}
              </h2>
              <ul class="standard-library-content-list">
                <li
                  v-for="(item, index) in contentData.navList"
                  :key="index"
                  class="standard-library-content-item"
                >
                  {{ item }}
                </li>
              </ul>
              <p
                v-for="(item, index) in contentData.contentList"
                :key="index"
                class="standard-library-conten-text"
              >
                {{ item.text }}
              </p>
              <p class="standard-library-conten-time">{{ contentData.time }}</p>
              <p class="standard-library-conten-dow">
                <span>{{ contentData.text }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StandardLibrary",
  props: {
    tabsData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      searchValue: "",
      active: 0,
      contentData: {
        title: "标准分类1",
        navList: [
          "标准分类",
          "标准代号",
          "发布时间",
          "发布单位",
          "起草单位",
          "标准简介",
        ],
        contentList: [
          {
            text:
              "内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述。",
          },
          {
            text:
              "内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述。",
          },
          {
            text:
              "内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述，内容描述内容描述内容描述内容描述。",
          },
        ],
        time: "2021/04/13",
        text: "支持下载",
      },
    };
  },
  methods: {
    handleTabsClick(index) {
      this.active = index;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/_handle.scss";
.standard-library {
  .wrap {
    padding: 100px 0;
    font-weight: 400;
    font-size: 16px;
    @include font_color("font_color2");
    .standard-library-title {
      font-size: 48px;
      font-weight: bold;
      color: #000000;
    }
    .standard-library-list {
      display: flex;
      text-align: left;
      .c-line {
        width: 46px;
        height: 4px;
        margin: 0 0 70px 0;
        @include background_color("background_color1");
      }
      .content-tabs-right {
        display: flex;
        justify-content: center;
        width: 73%;
        .standard-library-content {
          padding: 45px 90px;
          background: #f7f7f7;
          .standard-library-content-title {
            margin-bottom: 45px;
            font-size: 24px;
            text-align: center;
          }
          .standard-library-content-list {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0;
            margin-bottom: 30px;
            list-style: none;
            .standard-library-content-item {
            }
          }
          .standard-library-conten-text {
            font-size: 14px;
            font-weight: 300;
            line-height: 28px;
          }
          .standard-library-conten-time,
          .standard-library-conten-dow {
            margin: 0;
            text-align: right;
          }
          .standard-library-conten-time {
            margin-top: 80px;
            margin-bottom: 10px;
          }
          .standard-library-conten-dow {
            font-weight: 400;
            @include font_color("font_color1");
            span {
              display: inline-block;
              height: 25px;
              border-bottom: 1px solid #fff;
              cursor: pointer;
              @include border_bottom_color("border_bottom_color1");
            }
          }
        }
      }
    }
  }
}
</style>