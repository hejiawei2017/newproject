<template>
  <div style="text-align:center" class="about-con">
    <img class="about-bg" mode="widthFix" :src="aboutBgSrc" />
    <div class="about-p">广汽蔚来，一家以“合创”为理念，汽车和互联网深度融合的用户企业，不仅提供智能纯电动汽车，更为用户提供充满创享的生活。</div>
    <div class="about-p">
      创立于2018年4月，2019年5月发布品牌
      <br />「HYCAN合创」 及首款概念车。
    </div>
    <div class="jobs-btn" @click="showModel=true">热招职位</div>
    <div class="about-model" v-show="showModel" @click="showModel=false">
      <div class="about-model-inner">
        <div class="msg">
          在客服对话中回复【职位】
          <br />即刻查看全部热门招聘信息
        </div>
        <div class="about-model-bottom">
          <div class="left-bottom" @click.stop="showModel=false">取消</div>
          <div class="right-bottom" @click.stop="goClient">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import adapter from "@/common/adapter.js";
export default {
  name: "about",
  components: {},
  data() {
    return {
      a: 1,
      showModel: false,
      aboutBgSrc:
        "https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20190627170413_3eadb43b-ec94-4919-94ac-67e7eaa116c2_ic_about_top_bg.png?t=" +
        new Date().getTime()
    };
  },

  mounted() {},

  watch: {},

  methods: {
    goClient() {
      //
      adapter.navigate({
        method: "reLaunch",
        url: "/pages/my-index/my-index"
      });
    }
  }
};
</script>

<style lang="scss">
@import "~@/common/scss/base";
.jobs-btn {
  width: 650px;
  height: 88px;
  border-radius: 44px;
  border: 2px solid rgba(44, 204, 211, 1);
  color: #2cccd3;
}

.about-con {
  margin-top: rem(160);
}
.about-bg {
  width: rem(580);
  height: rem(430);
  margin: auto;
  text-align: center;
}
.about-p {
  margin: rem(60) auto 0;
  width: rem(630);
  font-size: rem(27);
  font-weight: 400;
  color: rgba(34, 34, 34, 1);
  line-height: rem(50);
  text-align: left;
  text-indent: rem(54);
  word-break: break-all;
}
.jobs-btn {
  width: 650px;
  height: 88px;
  line-height: 88px;
  border-radius: 44px;
  border: 2px solid rgba(44, 204, 211, 1);
  margin: 0 auto;
  color: #2cccd3;
  font-size: 32px;
  margin-top: 100px;
}
.about-model {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  top: 0px;
  left: 0px;
  z-index: 99;
}
.about-model-inner {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 540px;
  height: 270px;

  background: rgba(255, 255, 255, 1);
  border-radius: 12px;
  text-align: center;

  img {
    width: 183px;
    height: 142px;
    margin-top: 113px;
  }
  .title {
    font-size: 34px;
    font-weight: 400;
    color: rgba(5, 28, 44, 1);
    text-align: center;
    margin: 20px 0px;
  }
  .msg {
    width: 480px;
    height: 80px;
    font-size: 30px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 500;
    color: rgba(5, 28, 44, 1);
    line-height: 40px;
    padding: 60px 30px;
  }
  .about-model-bottom {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 87px;
    line-height: 87px;
    border-top: 1px solid rgba(216, 220, 227, 0.9);
    display: flex;
    .left-bottom {
      font-size: 30px;
      color: rgba(152, 164, 174, 1);
      border-right: 1px solid rgba(216, 220, 227, 0.8);
    }
    .right-bottom {
      font-size: 30px;
      color: #2cccd3;
    }
  }
  .about-model-bottom > div {
    flex: 1;
  }
}
</style>
