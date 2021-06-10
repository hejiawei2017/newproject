<template>
  <div class="early-warning">
    <div class="warning-breadcrumb">
      <div class="container wrap">
        <div
          v-for="(item, index) in breadcrumbList"
          :key="index"
          class="warning-breadcrumb-item"
        >
          <span
            class="warning-breadcrumb-item-link"
            :class="{active: index === breadcrumbList.length - 1}"
            >{{ item.text }}</span
          >
          <slot v-if="index !== breadcrumbList.length - 1" name="icon"
            ><span class="breadcrumb-item-icon">/</span></slot>
        </div>
      </div>
    </div>
    <div class="early-warning-banner">预警内容</div>
    <div class="early-warning-detail">
      <div class="warning-detail-header">
        <span class="warning-detail-header-tips"><i class="tab-flag iconfont icon-jinggao" />{{ earlyWarningDetailData.warningevelname }}风险</span>
        <!-- <span class="warning-detail-header-tips">风险系数：<i class="tab-flag iconfont icon-start-i" /></span> -->
      </div>
      <div class="warning-detail-body">
        <div class="detail-body-title">
          <div class="detail-body-title-left">
            <span class="body-title-official">官方通报&nbsp;∶</span>
            <h2 class="body-title-text">{{ earlyWarningDetailData.risktitle }}</h2>
          </div>
          <span class="body-title-time">{{ $moment(earlyWarningDetailData.predate).format('YYYY-MM-DD hh:mm:ss') }}</span>
        </div>
        <div class="detail-body-content">
          <p class="detail-body-content-text">{{ earlyWarningDetailData.riskdesc }}</p>
          <ul class="detail-body-content-list">
            <li class="detail-body-content-item">
              <div class="detail-body-content-item-tit"><i class="detail-body-content-item-icon"></i>可能影响行业/领域:</div>
              <div class="detail-body-content-item-txt">{{ earlyWarningDetailData.riskterrname || '无' }}</div>
            </li>
            <li class="detail-body-content-item">
              <div class="detail-body-content-item-tit"><i class="detail-body-content-item-icon"></i>可能影响区域:</div>
              <div class="detail-body-content-item-txt">{{ earlyWarningDetailData.risktareaname || '无' }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      breadcrumbList: [
        {
          url: "###",
          text: "风险管理",

        },
        {
          url: "###",
          text: "风险预警",
        },
        {
          url: "###",
          text: "风险预警详情",
        },
      ],
    }
  },
  asyncData: {
    earlyWarningDetail(store,data) {
      return store.dispatch('earlyWarningDetail',data);
    },
  },
  mounted () {
    this.$options.asyncData.earlyWarningDetail(this.$store,this.$route.query)
  },
  computed: {
    earlyWarningDetailData() {
      return this.$store.state.sourceServer.earlyWarningDetailData
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/_handle.scss";
.early-warning {
  margin-bottom: 80px;
  text-align: left;
  .warning-breadcrumb {
    display: flex;
    align-items: center;
    width: 100%;
    height:  60px;
    font-size: 18px;
    font-weight: 300;
    @include font_color("font_color2");
    background: #F2F3F4;
    .container.wrap {
      display: flex;
      align-items: center;
      .warning-breadcrumb-item {
        .warning-breadcrumb-item-link {
          @include font_color("font_color2");
          &.active {
            @include font_color("font_color1");
            font-weight: 400;
          }
        }
        .breadcrumb-item-icon {
          margin: 0 5px;
        }
      }
    }
  }
  .early-warning-banner {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 350px;
    font-size: 50px;
    font-weight: bold;
    color: #fff;
    background: url('~@/assets/img/Inspection/EarlyWarningDetails-bgImg.png') no-repeat center;
    background-size: cover;
  }
  .early-warning-detail {
    position: relative;
    top: -60px;
    margin: auto;
    width: 1085px;
    background-color: #fff;
    box-shadow: 1px 0px 18px 0px rgba(233, 233, 233, 0.66);
    z-index: 3;
    .warning-detail-header {
      display: flex;
      align-items: center;
      height: 60px;
      padding-left: 40px;
      border-bottom: 1px dashed #888;
      .warning-detail-header-tips {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20px;
        padding: 2px 10px;
        border-radius: 15px;
        border: 1px solid #DD1010;
        color: #DD1010;
        font-size: 12px;
        font-weight: 400;
        i {
          margin-right: 5px;
          font-size: 14px;
        }
      }
    }
    .warning-detail-body {
      padding: 0 40px 60px 40px;
      .detail-body-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 35px;
        font-weight: 300;
        color: #313131;
        .detail-body-title-left {
          display: flex;
          align-items: center;
          .body-title-official {
            margin-right: 10px;
            white-space: nowrap;
          }
          .body-title-text {
            margin: 0;
            font-weight: 500;
          }
        }
        .body-title-time {
          margin-left: 10px;
          font-size: 14px;
          font-weight: 400;
          white-space: nowrap;
        }
      }
      .detail-body-content {
        margin-top: 30px;
        padding-top: 30px;
        border-top: 1px solid #EFEFEF;
        .detail-body-content-text {
          margin-bottom: 45px;
          font-size: 18px;
          font-weight: 300;
          line-height: 30px;
        }
        .detail-body-content-list {
          margin: 0;
          padding: 0;
          list-style: none;
          .detail-body-content-item {
            margin-bottom: 35px;
            font-size: 18px;
            .detail-body-content-item-tit {
              margin-bottom: 10px;
              font-weight: 500;
              .detail-body-content-item-icon {
                display: inline-block;
                margin-right: 5px;
                border: 6px solid transparent;
                border-left: 12px solid #2B29D6;
              }
            }
            .detail-body-content-item-txt {
              font-weight: 300;
            }
          }
        }
      }
    }
  }
}
</style>