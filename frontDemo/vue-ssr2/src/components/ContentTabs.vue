<template>
  <div class="content-tabs">
    <div class="container">
      <div class="wrap" v-if="!ord">
        <div class="content-tabs-left">
          <h3 class="left-title">
            {{ hasContentTabs.title }}<br />
            <span v-if="hasContentTabs.title2">{{
              hasContentTabs.title2
            }}</span>
          </h3>
          <div class="c-line"></div>
          <div class="content-tabs-left-tabs">
            <div
              v-for="(item, index) in hasContentTabs.tabsList"
              :key="index"
              @click="handleTabsClick(index)"
              class="tabs-item"
            >
              <span
                class="tabs-item-text"
                :class="{ active: active === index }"
                >{{ item.text }}</span
              >
            </div>
            <i class="iconfont icon-consumer-arrow tabs-icon-arrow"></i>
          </div>
        </div>
        <div class="content-tabs-right animate__animated" :class="{ animate__fadeInUpBig: showAnimate }">
          <div class="content-tabs-right-img">
            <img :src="hasContentTabs.bjImg" />
          </div>
          <div class="content-tabs-right-text">
            <h3 v-if="hasContentTabs.conTitle" class="right-title">
              {{ hasContentTabs.conTitle }}
            </h3>
            <h3 v-if="hasContentTabs.conTitle2" class="right-title">
              {{ hasContentTabs.conTitle2 }}
            </h3>
            <p
              v-for="(item, index) in hasContentTabs.contentList"
              :key="index"
              class="right-text"
            >
              {{ item.text }}
            </p>
          </div>
        </div>
      </div>
      <div class="wrap" v-if="ord">
        <div class="content-tabs-left">
          <h3 class="left-title">
            {{ hasContentTabs.title }}<br />
            <span v-if="hasContentTabs.title2">{{
              hasContentTabs.title2
            }}</span>
          </h3>
          <div class="c-line"></div>
          <div class="content-tabs-left-tabs">
            <div
                    v-for="(item, index) in $store.state.dataSourceServ.testingSceneData.datas"
                    :key="index"
                    @click="handleOrdTabsClick(item, index)"
                    class="tabs-item"
            >
              <span
                      class="tabs-item-text"
                      :class="{ active: active === index }"
              >{{ item.title }}</span
              >
            </div>
            <i class="iconfont icon-consumer-arrow tabs-icon-arrow"></i>
          </div>
        </div>
        <div class="content-tabs-right animate__animated"
             :class="{ animate__fadeInUpBig: showAnimate }"
        >
          <div class="content-tabs-right-img">
            <img :src="BaseImgUrl+$store.state.dataSourceServ.testingSceneData.datas[idx].imgpathview" />
          </div>
          <div class="content-tabs-right-text">
            <h3 v-if="hasContentTabs.conTitle" class="right-title">
              {{ hasContentTabs.conTitle }}
            </h3>
            <h3 v-if="hasContentTabs.conTitle2" class="right-title">
              {{ hasContentTabs.conTitle2 }}
            </h3>
            <p
                    v-for="(item, index) in hasContentTabs.contentList"
                    :key="index"
                    class="right-text"
            >
              {{ item.text }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dataSource from "@/assets/dataSource/dataSource";
export default {
  name: "ContentTabs",
  props: {
    ord: {
      type: String
    },
    contentTabs: {
      type: Object,
    },
  },
  asyncData: {
    getTestingSenceData(store) {
      return store.dispatch("fetchTestingScene", '309010');
    },
  },
  data() {
    return {
      active: 0,
      showAnimate: true,
      timeId: null,
      BaseImgUrl: process.env.PROXY_URL + process.env.BASE_IMG_URL,
      idx: 0
    };
  },
  mounted() {
    this.hideAnimate();
    this.$options.asyncData.getTestingSenceData(this.$store,{ord:this.ord});
  },
  computed: {
    hasContentTabs() {
      if (this.contentTabs && this.contentTabs.title) {
        return this.contentTabs;
      }
      return dataSource[process.env.SYSTEM_TYPE].contentTabs;
    },
  },
  methods: {
    handleTabsClick(index) {
      this.active = index;
      this.hideAnimate()
    },
    handleOrdTabsClick(item,index){
      this.active = index;
      this.hideAnimate()
      this.idx = index
      console.log(item)
    },
    hideAnimate() {
      this.showAnimate = true;
      clearTimeout(this.timeId)
      this.timeId = setTimeout(() => {
        this.showAnimate = false;
      }, 1000);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/_handle.scss";
.content-tabs {
  text-align: left;
  overflow: hidden;
  .wrap {
    display: flex;
    padding: 110px 0 130px 0;
    .content-tabs-left {
      width: 27%;
      .left-title {
        font-size: 48px;
        @include font_color("font_color2");
        span {
          font-weight: 300;
        }
      }
      .c-line {
        width: 46px;
        height: 4px;
        margin: 70px 0;
        @include background_color("background_color1");
      }
      .content-tabs-left-tabs {
        .tabs-item {
          .tabs-item-text {
            display: inline-block;
            height: 35px;
            margin-bottom: 60px;
            font-size: 20px;
            font-weight: 300;
            opacity: 0.5;
            cursor: pointer;
            @include font_color("font_color2");
            &.active {
              font-weight: 400;
              opacity: 1;
              @include font_color("font_color1");
            }
          }
        }
        .tabs-icon-arrow {
          @include font_color("font_color1");
        }
      }
    }
    .content-tabs-right {
      margin-left: 100px;
      width: 73%;
      @include font_color("font_color2");
      .content-tabs-right-img {
        width: 100%;
        height: 315px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .content-tabs-right-text {
        padding: 46px 50px 0 73px;
        .right-title {
          font-weight: 400;
          font-size: 20px;
        }
        .right-title:nth-child(2) {
          margin-bottom: 36px;
        }
        .right-text {
          font-size: 16px;
          font-weight: 300;
          margin-top: 40px;
        }
      }
    }
  }
}
</style>
