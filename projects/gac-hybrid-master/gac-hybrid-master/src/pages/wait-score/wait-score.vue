<template>
  <div class="score-container" ref="scoreScontainer">
    <div
      class="score-box"
      v-if="loading===false && (result.bigOrderScore.totalScore>0 || result.miniOrderScore.totalScore>0)"
    >
      <div class="left-bar">
        <div class="dot"></div>
        <div
          class="dot"
          :class="'dot-top'+result.miniOrderScore.lineNum"
          v-if="result.bigOrderScore.totalScore>0 || result.miniOrderScore.totalScore>0"
        ></div>
      </div>
      <div class="right-box">
        <div class="item-score" v-if="result.miniOrderScore.totalScore>0">
          <div class="top">
            <span class="type">
              转为小订时
              <span style="color:#F39F58;margin-left:40px;">待入账</span>
            </span>
            <span class="score">
              <span style="fint-size:36px;font-weight:600;">{{result.miniOrderScore.totalScore}}</span> 积分
            </span>
          </div>
          <div class="bottom">
            <div class="item" v-if="result.miniOrderScore.selfScore>0">
              <span class="type">本人为被邀请人</span>
              <span class="score">{{result.miniOrderScore.selfScore}} 积分</span>
            </div>
            <div class="item" v-if="result.miniOrderScore.oneScore>0">
              <span class="type">
                我邀请的一级好友
                <span>x{{result.miniOrderScore.onePerson}}</span>
              </span>
              <span class="score">{{result.miniOrderScore.oneScore}} 积分</span>
            </div>
            <div class="item" v-if="result.miniOrderScore.twoScore>0">
              <span class="type">
                我邀请的二级好友
                <span>x{{result.miniOrderScore.twoPerson}}</span>
              </span>
              <span class="score">{{result.miniOrderScore.twoScore}} 积分</span>
            </div>
          </div>
        </div>
        <div class="item-score" v-if="result.bigOrderScore.totalScore>0">
          <div class="top">
            <span class="type">
              转为大定时
              <span style="color:#F39F58;margin-left:40px;">待入账</span>
            </span>
            <span class="score">
              <span style="fint-size:36px;font-weight:600;">{{result.bigOrderScore.totalScore}}</span> 积分
            </span>
          </div>
          <div class="bottom">
            <div class="item" v-if="result.bigOrderScore.selfScore>0">
              <span class="type">本人为被邀请人</span>
              <span class="score">{{result.bigOrderScore.selfScore}} 积分</span>
            </div>
            <div class="item" v-if="result.bigOrderScore.oneScore>0">
              <span class="type">
                我邀请的一级好友
                <span>x{{result.bigOrderScore.onePerson}}</span>
              </span>
              <span class="score">{{result.bigOrderScore.oneScore}} 积分</span>
            </div>
            <div class="item" v-if="result.bigOrderScore.twoScore>0">
              <span class="type">
                我邀请的二级好友
                <span>x{{result.bigOrderScore.twoPerson}}</span>
              </span>
              <span class="score">{{result.bigOrderScore.twoScore}} 积分</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="no-score"
      v-if="result.bigOrderScore.totalScore<=0 && result.miniOrderScore.totalScore<=0 && loading===false"
    >暂无待入账</div>
    <div class="no-score" v-if="loading">加载中...</div>
  </div>
</template>

<script>
import util from "@/common/util.js";

import axios from "@/libs/axios.js";
import bridge from "@/libs/bridge2.js";
export default {
  name: "wait-score",
  components: {},
  data() {
    return {
      loading: false,
      isSequence: false, //是否小程序
      token: null,
      temObj: {
        miniOrderScore: {
          totalScore: 0,
          selfScore: 0,
          oneScore: 0,
          onePerson: 0,
          twoScore: 0,
          twoPerson: 0
        },
        bigOrderScore: {
          totalScore: 0,
          selfScore: 0,
          oneScore: 0,
          onePerson: 0,
          twoScore: 0,
          twoPerson: 0
        }
      }
    };
  },
  created() {
    this.isMiniProgram().then(res => {
      console.log("isSequence", res);
      this.isSequence = res;
    });
  },
  computed: {
    result() {
      return this.getResult();
    }
  },
  mounted() {
    this.token = util.jsUrlHelper.getUrlParam(window.location.href, "token");
    let vm = this;
    if (this.token) {
      this.loadScoreMsgContainer();
    } else {
      setTimeout(() => {
        if (!vm.token) {
          bridge.jsCallApp({ method: "getUserInfo", data: {} }, res => {
            res = JSON.parse(res);
            vm.token = res.data.token;
            vm.loadScoreMsgContainer();
          });
        }
      }, 200);
    }
    vm.$nextTick(() => {
      document.body.offsetHeight;
      vm.$refs.scoreScontainer.style.width = window.innerWidth + "px";
    });
  },

  methods: {
    getResult() {
      Object.keys(this.temObj).map(key => {
        let lineNum = 3;
        Object.keys(this.temObj[key]).map(keySon => {
          if (
            keySon === "selfScore" ||
            keySon === "oneScore" ||
            keySon === "twoScore"
          ) {
            if (this.temObj[key][keySon] <= 0) lineNum--;
          }
        });
        this.temObj[key].lineNum = lineNum;
      });
      // console.log(111,'拿到的值',this.temObj, this.temObj.miniOrderScore.lineNum);
      return this.temObj;
    },
    loadScoreMsgContainer() {
      let vm = this;
      vm.loading = true;
      console.log(444,this.temObj);
      this.loadScoreMsg()
        .then(res => {
          vm.loading = false;
          if (res.data.code === 0) {
            vm.$set(vm, "temObj", res.data.data);
          }
          console.log(5555,this.temObj);
        })
        .catch(err => {
          vm.loading = false;
        });
    },
    loadScoreMsg() {
      return axios({
        method: "get",
        url: `/score/carOrderBase/simpleAuth/front/v3.1.3/scoreDetail`,
        data: {},
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
    // goIntegral() {
    //   adapter.navigate({ url: "/pages/my-point/my-point" });
    //   bridge.jsCallApp(
    //     { method: "openLocalPage", data: { pageType: 101 } },
    //     res => {
    //       console.log(res);
    //     }
    //   );
    // },

    lotteryEndHandler(item) {
      setTimeout(() => {
        this.lotteryItemName = item.name;
        this.lotteryModel = true;
      }, 1500);
    }
  }
};
</script>

<style>
html {
  background-color: #f6f7f8;
}

body {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  font-family:Helvetica,Droidsansfallback,Droid Sans;
}
</style>
<style scoped lang="scss">
.score-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 20px;
  color: #051c2c;
  position: relative;
  .no-score {
    position: absolute;
    color: #747a86;
    top: 200px;
    left: 50%;
    font-size: 28px;
    transform: translateX(-50%);
  }
  .score-box {
    background-color: #fff;
    box-sizing: border-box;
    padding: 30px 40px 30px;
    margin: 30px auto;
    width: 690px;
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    .left-bar {
      background-color: #eee;
      min-width: 12px;
      max-width: 12px;
      // min-height: 340px;
      margin-right: 24px;
      border-radius: 8px;
      position: relative;
      .dot {
        position: absolute;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        left: -4px;
        top: 30px;
        background-color: #dbdbdb;
      }
      .dot-top1 {
        top: 195px;
      }
      .dot-top2 {
        top: 245px;
      }
      .dot-top3 {
        top: 297px;
      }
    }
    .right-box {
      width: 580px;
      .item-score {
        width: 580px;
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 28px;
          padding: 20px;
          .type {
            width: 350px;
          }
          .score {
            // margin-left: 20px;
          }
        }
        .bottom {
          font-size: 24px;
          background-color: #f6f7f8;
          border-radius: 8px;
          width: 580px;
          box-sizing: border-box;
          padding: 20px;
          // display: flex;
          // align-items: center;
          // justify-content: center;
          .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            line-height: 50px;
            color: #747a86;
            .type {
              width: 300px;
            }
            .score {
              // margin-left: 100px;
            }
          }
        }
      }
    }
  }
}
</style>
