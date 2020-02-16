<template>
  <div ref="container" class="lottery-container">
    <turntable
      class="turntable"
      @clickHandler="clickHandler"
      @lotteryEndHandler="lotteryEndHandler"
      :options="options"
    ></turntable>
    <!-- <span>{{responeMsg}}</span> -->
    <div class="canLottery-con">
      您有
      <span class="can-lottery">{{ surplusTime }}</span> 次抽奖机会！
    </div>
    <div class="lottery-footer">
      <div class="footer-top">
        <span class="line"></span>
        <span class="title">活动介绍</span>
        <span class="line"></span>
      </div>
      <div class="footer-bottom">
        <div class="bottom-item">
          1. 活动时间：11月9日-11月17日，奖品数量有限，先到先得，发完即止
        </div>
        <div class="bottom-item">
          2.
          活动玩法：活动期间，用户兑换标有【抽免单】字样的商品，在支付完成后，可以参与积分抽奖活动，每笔订单可得一次抽奖机会。
        </div>
        <div class="bottom-item">
          3.
          奖品设置：免单机会（返还所购商品等值积分至该订单账户）、200积分、80积分，活动期间综合中奖率100%
        </div>
        <div class="bottom-item">
          4.
          如用户存在违法违规或违反活动公平公正原则，包括但不限于刷单作弊获得奖品等行为，广汽蔚来新能源汽车有限公司有权取消用户的中奖资格，收回奖品或权益
        </div>

        <div class="bottom-item">
          5.
          活动期间（11月9-17日），非质量问题，活动商品暂不接受退单，不便之处，敬请谅解
        </div>
        <div class="bottom-item">6. 广汽蔚来对活动保有最终解释权</div>
      </div>
    </div>
    <show-tips ref="showTips"></show-tips>
    <div class="lottery-model" v-show="lotteryModel">
      <div class="lottery-model-inner">
        <div>
          <img
            src="https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191108110542095-shop_pic_cj_lh%403x.png"
          />
        </div>
        <div class="title">恭喜你</div>
        <div class="msg">抽中{{ lotteryItemName }}！</div>
        <div class="lottery-model-bottom">
          <div class="left-bottom" @click.stop="goshop">商城首页</div>
          <div class="right-bottom" @click.stop="goIntegral">查看积分</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import turntable from "@/components/turntable/turntable.vue";
import showTips from "@/components/showTips/showTips.vue";
import util from "@/common/util.js";
import adapter from "@/common/adapter.js";
import axios from "@/libs/axios.js";
import bridge from "@/libs/bridge2.js";

let istest = false;

export default {
  name: "lottery",
  components: {
    turntable,
    showTips
  },
  data() {
    return {
      istest: istest,
      responeMsg: "",
      isSequence: false, //是否小程序
      lotteryItemName: "", //中奖项目名称
      lotteryModel: false, //控制中奖弹窗
      options: {
        rotateNum: 5,
        totalLotteryCount: istest ? 100 : 0,
        lotteryCount: 0,
        lanrenImg:
          "https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191105110204536-shop_pic_cj_lp%403.png",
        lotteryBtnImg:
          "https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191028161011784-shop_btn_yellow_cj.png",
        lotteryData: [
          //抽奖数据
          { name: "10积分", id: 1, angle: [240, 360] },
          { name: "100积分", id: 2, angle: [0, 120] },
          { name: "免单", id: 3, angle: [120, 240] }
        ],
        getDegByUser(item, angle) {
          //用户设定角度
          if (item.id == 1 && angle.length == 0) {
            return [240, 360];
          }
          if (item.id == 2 && angle.length == 0) {
            return [0, 120];
          }
          if (item.id == 3 && angle.length == 0) {
            return [120, 240];
          }
          return angle;
        }
      }
    };
  },
  created() {
    this.isMiniProgram().then(res => {
      console.log("isSequence", res);
      this.isSequence = res; //判断小程序
    });
  },
  computed: {
    surplusTime() {
      let num = this.options.totalLotteryCount - this.options.lotteryCount;
      if (num < 0) {
        num = 0;
      }
      return num;
    }
  },
  mounted() {
    let vm = this;
    this.$refs.showTips.hideTips();
    this.orderId = util.jsUrlHelper.getUrlParam(
      window.location.href,
      "orderId"
    );
    this.token = util.jsUrlHelper.getUrlParam(window.location.href, "token");
    if (this.istest) {
      this.loadLotteryMsg();
    }

    if (vm.token && vm.orderId) {
      vm.setErrorParams();
    } else {
      setTimeout(() => {
        if (!vm.orderId) {
          bridge.jsCallApp({ method: "getProductInfo", data: {} }, res => {
            res = JSON.parse(res);
            vm.orderId = res.data.orderId;
            vm.setErrorParams();
          });
        }
        if (!vm.token) {
          bridge.jsCallApp({ method: "getUserInfo", data: {} }, res => {
            res = JSON.parse(res);
            vm.token = res.data.token;
            vm.setErrorParams();
          });
        }
      }, 100);
    }
    setTimeout(() => {
      document.body.offsetHeight;
      vm.$refs.container.style.width = window.innerWidth + "px";
    }, 100);
    this.sendLotteryState(0);
  },

  methods: {
    setErrorParams() {
      if (!this.orderId || !this.token) {
        this.noparamError = true;

        return;
      } else {
        this.noparamError = false;
        let vm = this;
        this.loadLotteryMsg()
          .then(res => {
            vm.responeMsg = JSON.stringify(res.data);
            if (res.data && res.data.data) {
              vm.options.lotteryData = res.data.data.prizeDataVo || [];
              vm.options.lotteryCount = res.data.data.drawTime; //已经抽奖次数
              vm.options.totalLotteryCount =
                res.data.data.residueTime + res.data.data.drawTime; //总共抽奖次数
              if (vm.istest) {
                vm.options.totalLotteryCount = 100;
              }
              res.data.data.imaUrl &&
                (vm.options.lanrenImg = res.data.data.imaUrl);
              setTimeout(() => {
                this.$refs.showTips.showTips("支付成功，可进行抽奖");
              }, 500);
            }
          })
          .catch(e => {
            vm.responeMsg = JSON.stringify(e);
            setTimeout(() => {
              if (e.response && e.response.data && e.response.data.msg) {
                vm.$refs.showTips.showTips(e.response.data.msg);
              }
            }, 500);
          });
      }
    },
    sendLotteryState(state, item) {
      bridge.jsCallApp(
        { method: "lotteryState", data: { state: state } },
        () => {}
      );

      window.wx.miniProgram.postMessage({
        data: { state: "" + state, lotteryMsg: item }
      });
    },
    goLottery() {
      //测试
      //this.orderId = "639042062997520384";
      //this.token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsaWNlbnNlIjoibWFkZSBieSBnYWMtbmlvIiwidXNlcl9uYW1lIjoiYWRtaW4iLCJzY29wZSI6WyJzZXJ2ZXIiXSwiZXhwIjoxNTc0NjQ5ODI1LCJ1c2VySWQiOjEsImF1dGhvcml0aWVzIjpbIlJPTEVfQURNSU4iLCJST0xFX1VTRVIiXSwianRpIjoiOTA5YTFlOTktYzNlMy00NzYzLWJiNGQtMWZhNDRmOTI5NTA1IiwiY2xpZW50X2lkIjoiZ2FjLXRlc3QifQ.edGkpSieQeyna5o4VWoH_L40w_lTP96K926s_WNhy_0`;

      return axios({
        method: "post",
        url: `/order/salePrizeOrder/simpleAuth/front/v3.1.3/draw`,
        data: { orderId: this.orderId },
        headers: {
          Authorization: this.token
        }
      });
    },
    loadLotteryMsg() {
      if (this.istest) {
        this.orderId = "639042062997520384";
        this.token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsaWNlbnNlIjoibWFkZSBieSBnYWMtbmlvIiwidXNlcl9uYW1lIjoiYWRtaW4iLCJzY29wZSI6WyJzZXJ2ZXIiXSwiZXhwIjoxNTc0NjQ5ODI1LCJ1c2VySWQiOjEsImF1dGhvcml0aWVzIjpbIlJPTEVfQURNSU4iLCJST0xFX1VTRVIiXSwianRpIjoiOTA5YTFlOTktYzNlMy00NzYzLWJiNGQtMWZhNDRmOTI5NTA1IiwiY2xpZW50X2lkIjoiZ2FjLXRlc3QifQ.edGkpSieQeyna5o4VWoH_L40w_lTP96K926s_WNhy_0`;
      }

      return axios({
        method: "get",
        url: `/order/salePrizeOrder/simpleAuth/front/v3.1.3/prize`,
        params: { orderId: this.orderId },
        headers: {
          Authorization: this.token
        }
      });
    },
    isMiniProgram() {
      return new Promise(resolve => {
        if (-1 == navigator.userAgent.toLowerCase().indexOf("micromessenger")) {
          resolve(false);
          return;
        } else {
          window.wx.miniProgram.getEnv(res => {
            if (!res.miniprogram) {
              resolve(false);
              return;
            } else {
              resolve(true);
            }
          });
        }
      });
    },
    goIntegral() {
      adapter.navigate({ url: "/pages/my-point/my-point?delta=99" });
      bridge.jsCallApp(
        { method: "openLocalPage", data: { pageType: 101 } },
        res => {
          console.log(res);
        }
      );
    },
    goshop() {
      adapter.navigate({
        method: "reLaunch",
        url: "/pages/shop-index/shop-index"
      });
      bridge.jsCallApp(
        { method: "openLocalPage", data: { pageType: 100 } },
        res => {
          console.log(res);
        }
      );
    },
    clickHandler(e) {
      //测试

      // window.jsCallJavaSpec();
      // bridge.jsCallApp({ method: "getUserInfo", data: {} }, res => {
      //   alert(JSON.stringify(res));
      // });

      // bridge.registerHandler("setToken", res => {
      //   alert(JSON.stringify(res));
      // });

      if (this.noparamError) {
        this.$refs.showTips.showTips("页面缺少参数,请稍后重试");
        return;
      }
      if (this.surplusTime <= 0) {
        //提示抽奖完成
        this.$refs.showTips.showTips("抽奖机会已经用完咯～");
        return;
      }
      if (this.istest) {
        e.lotteryMove({ fieldName: "id", fieldValue: 1 }); //测试
      } else {
        //点击去后台获取中奖数据
        this.goLottery()
          .then(res => {
            if (res.data && res.data.code == 0 && res.data.data) {
              this.sendLotteryState(1, res.data.data);
              e.lotteryMove({
                fieldName: "id",
                fieldValue: res.data.data.id,
                readName: res.data.data.name
              });
            } else {
              this.$refs.showTips.showTips(res.data.msg || "抱歉请稍后重试");
            }
          })
          .catch(e => {
            this.sendLotteryState(2);
            if (e.response && e.response.data && e.response.data.msg) {
              this.$refs.showTips.showTips(e.response.data.msg);
            }
          });
      }
    },
    lotteryEndHandler(item) {
      setTimeout(() => {
        this.lotteryItemName = item.name;
        this.lotteryModel = true;
        this.sendLotteryState(2);
      }, 300);
    }
  }
};
</script>

<style>
html {
  background-color: #f1f7f7;
  /* overflow-x: hidden; */
}
body {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  /* overflow-x: hidden; */
  font-family: Helvetica, Droidsansfallback, Droid Sans;
}
</style>
<style scoped lang="scss">
.lottery-container {
  border: 0.1px solid transparent;
  width: 100%;
  height: 100%;

  background: url("https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191111154657858-shop_bg_blue_gx3.png")
    no-repeat top center;
  background-size: 100%;
}
.turntable {
  width: 600px;
  height: 600px;
  position: relative;
  margin: 0 auto;
  margin-top: 66px;
}
.canLottery-con {
  width: 580px;

  line-height: normal;
  padding: 10px 0;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30px;
  color: #051c2c;
  text-align: center;
  font-size: 29px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  margin: 0 auto;
  margin-top: 40px;
}
.can-lottery {
  color: #2cccd3;
}
.lottery-footer {
  margin-top: 83px;
  color: #051c2c;
}
.footer-top {
  display: flex;
  padding-left: 50px;
  padding-right: 50px;
  .title {
    display: block;
    font-size: 30px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(5, 28, 44, 1);
    line-height: 42px;
    width: 160px;
  }
}
.footer-top .line {
  display: block;
  border-top: 1px solid rgba(216, 220, 227, 0.8);
  margin-top: 21px;
  opacity: 0.8;
}
.footer-top .line {
  flex: 1;
}

.footer-bottom {
  padding: 50px;
}
.bottom-item {
  font-size: 26px;
  text-align: left;
}
.bottom-item + .bottom-item {
  margin-top: 20px;
}
.lottery-model {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  top: 0px;
  left: 0px;
  z-index: 99;
}
.lottery-model-inner {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 560px;
  height: 540px;
  background: rgba(255, 255, 255, 1);
  border-radius: 12px;
  text-align: center;
  img {
    width: 200px;
    height: 157px;
    margin-top: 113px;
  }
  .title {
    font-size: 34px;
    font-weight: 400;
    color: rgba(5, 28, 44, 1);
    text-align: center;
    margin: 16px 0px;
  }
  .msg {
    font-size: 28px;
    font-weight: 400;
    color: rgba(5, 28, 44, 1);
  }
  .lottery-model-bottom {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 87px;
    // line-height: 87px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    .left-bottom {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 87px;
      color: rgba(152, 164, 174, 1);
      border-right: 1px solid #f0f0f0;
      font-size: 30px;
    }
    .right-bottom {
      height: 87px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #2cccd3;
      font-size: 30px;
    }
  }
  .lottery-model-bottom > div {
    flex: 1;
  }
}
</style>
