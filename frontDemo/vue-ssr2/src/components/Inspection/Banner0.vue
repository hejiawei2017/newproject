<template>
  <div class="banner-test">
    <div class="wrap">
      <div class="banner-test-content">
        <ul class="banner-test-content-list">
          <li
            v-for="(item, index) in bannerList"
            :key="index"
            class="banner-test-content-item"
          >
            <!-- <img src="" alt=""> -->
            <div class="content-item-icon">
              <img :src="item.icon" alt="icon" />
            </div>
            <div class="content-item-center" :class="{ warning: index === 4 }">
              <span class="content-item-center-num">{{ item.num }}</span
              ><span class="content-item-center-text">{{ item.name }}</span>
            </div>
            <span class="content-item-bottom-text">{{ item.itemName }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Banner",
  data() {
    return {
      bannerList: [
        {
          id: 0,
          icon: require("@/assets/img/Inspection/icon-1.png"),
          num: 68347,
          name: "份",
          itemName: "上传报告",
        },
        {
          id: 1,
          icon: require("@/assets/img/Inspection/icon-2.png"),
          num: 94,
          name: "所",
          itemName: "入驻机构",
        },
        {
          id: 2,
          icon: require("@/assets/img/Inspection/icon-3.png"),
          num: 583,
          name: "所",
          itemName: "服务企业",
        },
        {
          id: 3,
          icon: require("@/assets/img/Inspection/icon-4.png"),
          num: 784665,
          name: "条",
          itemName: "发布风险预警",
        },
        {
          id: 4,
          icon: require("@/assets/img/Inspection/warning.png"),
          num: 5896,
          name: "次",
          itemName: "发现造假",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.banner-test {
  position: relative;
  width: 100%;
  height: 918px;
  background: url("~@/assets/img/Inspection/banner0.png") no-repeat top;
  background-size: cover;
  font-weight: 400;
  color: #ffffff;
  .wrap {
    position: relative;
    width: 1300px;
    max-width: 1300px;
    height: 100%;
    margin: 0 auto;
    .banner-test-content {
      position: absolute;
      bottom: 40px;
      width: 100%;
      background: rgba(3, 111, 220, 0.8);
      .banner-test-content-list {
        margin: 0;
        padding-left: 35px;
        list-style: none;
        display: flex;
        width: 100%;
        height: 235px;
        .banner-test-content-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          // padding: 35px 0;
          .content-item-icon {
            width: 35px;
            min-height: 45px;
            line-height: 46px;
            img {
              width: 100%;
              height: auto;
            }
          }
          p {
            margin: 0;
          }
          .content-item-center {
            height: 62px;
            line-height: 62px;
            font-size: 48px;
            .content-item-center-text {
              font-size: 20px;
            }
            &.warning {
              color: #ff7a51;
            }
          }
          .content-item-bottom-text {
            font-size: 24px;
          }
          &:last-child {
            margin-left: 50px;
          }
        }
      }
    }
  }
}
</style>

