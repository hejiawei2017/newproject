<template>
  <div>
    <div v-if="pageState === 'selector'" class="selector">
      <Header title="在线选号"></Header>
      <div class="main">
        <div class="title">选择您的个性号码</div>
        <div class="timer">
          <div class="timer-label">剩余选号时间</div>
          <div class="timer-count-down"><count-down :time="1000"></count-down></div>
        </div>
        <div class="selector">
          <div class="selector-item"><NumberScroller/></div>
          <div class="selector-item"><NumberScroller/></div>
          <div class="selector-item"><NumberScroller/></div>
          <div class="selector-item"><NumberScroller/></div>
        </div>
        <div class="start-btn">开始选择</div>
        <div class="tips">*可选择 0000 ～ 9999 的号码</div>
      </div>
      <div class="rule">活动规则</div>
      <div class="floor">
        <div class="floor-box">
          <div class="floor-btn">
            确定
          </div>
        </div>
      </div>
    </div>
    <div v-if="pageState === 'confirm'">

    </div>
  </div>
</template>

<script>
  import NumberScroller from '@/components/numberScroller';
  import Header from '@/components/header';
  import CountDown from '@/components/countDown';
  export default {
    name: "number-select",
    components: {
      NumberScroller,
      Header,
      CountDown
    },
    data() {
      return {
        pageState: 'selector'
      };
    },
    created() {

    },
    computed: {

    },
    mounted() {

    },
    methods: {
      goConfirm() {
        let token = '123';
        let url = `http://10.130.240.104:8999/number-confirm.html?noBridge=1&t=${new Date().getTime()}&token=Bearer ${token}`;
        window.wx.miniProgram.navigateTo({
          url: `/pages/page/webview/webview?url=${encodeURIComponent(url)}`
        })
      }
    }
  };
</script>
<style lang="scss">
  html {
    background-color: #F6F7F8;
  }
  body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: Helvetica, Droidsansfallback, Droid Sans;
  }
</style>
<style scoped lang="scss">
  .main {
    margin: 20px auto 0 auto;
    width: 690px;
    min-height: 800px;
    background: white;
    border-radius: 20px;
    overflow: hidden;
    .title {
      margin-top: 70px;
      font-size: 48px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: #181A24;
      line-height: 48px;
      text-align: center;
    }
    .timer {
      margin-top: 40px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      .timer-label {
        font-size: 28px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(109,114,120,1);
        line-height: 36px;
      }
      .timer-count-down {
        margin-left: 12px;
      }
    }
    .selector {
      margin-top: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      .selector-item {
        width: 108px;
        height: 164px;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        font-size: 100px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(24,26,36,1);
        line-height: 164px;
        letter-spacing: 5px;
      }
    }
    .start-btn {
      margin: 80px auto 0 auto;
      width: 530px;
      height: 88px;
      line-height: 88px;
      border-radius: 44px;
      border: 2px solid rgba(44,204,211,1);
      font-size: 32px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(44,204,211,1);
      text-align: center;
    }
    .tips {
      margin-top: 40px;
      font-size: 28px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(116,122,134,1);
      line-height: 40px;
      text-align: center;
    }
  }
  .rule {
    margin-top: 170px;
    height: 45px;
    font-size: 32px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(44,204,211,1);
    line-height: 45px;
    text-align: center;
  }
  .floor {
    height:120px;
    .floor-box {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px 30px;
      height:120px;
      background: white;
      box-sizing: border-box;
      .floor-btn {
        height: 88px;
        line-height: 88px;
        background: linear-gradient(90deg,rgba(78,225,231,1) 0%,rgba(44,204,211,1) 100%);
        border-radius: 44px;
        font-size:32px;
        font-family: PingFangSC-Regular;
        font-weight:400;
        color: white;
        text-align: center;
      }
    }

  }

</style>
