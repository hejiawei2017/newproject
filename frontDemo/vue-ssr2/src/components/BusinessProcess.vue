<template>
  <!-- 知识产权服务申请业务流程 -->
  <div class="business-process">
    <div class="container-w">
      <div class="wrap">
        <h2 class="business-process-title">知识产权服务申请业务流程</h2>
        <div class="business-process-box">
          
          <div class="business-process-circle right-arrow color-white">
            溯源共建方提出<br />知识产权服务申请
          </div>

          <div class="business-process-circle right-arrow m-r-5 bg-1">
            <span class="margin-top">知识产权确权<br />信息登记</span>
          </div>

          <div class="business-process-analyze">
            <div class="business-process-analyze-small">

              <div class="business-process-circle m-0 right-arrow bg-2">
                <span span class="margin-top">监管信息反馈</span>
              </div>

              <div class="business-process-circle m-0 right-arrow bg-3">
                <span span class="margin-top">消费者信息反馈</span>
              </div>

              <div class="business-process-circle m-0 right-arrow bg-4">
                <span span class="margin-top">其他溯源共建方<br />信息反馈</span>
              </div>
            </div>

            <div class="business-process-circle m-0 right-arrow-space bg-5">
              <span span class="margin-top">风险识别</span>
            </div>
          </div>

          <div class="business-process-circle m-r-15 right-arrow bg-6">
            <span span class="margin-top">风险处置</span>
          </div>
          <div class="business-process-put-forward">
            <div class="business-process-circle small bg-7">
              <span span class="margin-top">确权需求</span>
            </div>
            <div class="business-process-circle small bg-7">
              <span span class="margin-top">用权需求</span>
            </div>
            <div class="business-process-circle small bg-7">
              <span span class="margin-top">维权需求</span>
            </div>
          </div>
        </div>
        <p class="business-process-tips">*红色部分为企业需要操作部分</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessProcess'
}
</script>

<style lang="scss" scoped>
.business-process {
  padding-top: 90px;
  padding-bottom: 20px;
  min-height: 670px;
  background: url('~@/assets/img/institution/BusinessProcess-bgimg.png') no-repeat center;
  background-size: cover;
  .container-w {
    width: 1260px;
    margin: 0 auto;
  }
  .wrap {
    .business-process-title {
      margin-bottom:95px;
      font-size: 48px;
      font-weight: bold;
      color: #444444;
    }
    .business-process-box {
      display: flex;
      align-items: center;
      margin-bottom: 70px;
      color: #fff;
      .business-process-circle {
        position: relative;
        margin-right: 40px;
        flex: none;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 115px;
        height: 115px;
        font-size: 12px;
        border-radius: 50%;
        background-color: rgb(39 125 210 / 10%);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        &.small {
          margin: 0;
          width: 80px;
          height: 80px;
        }
        &.m-0 {
          margin: 0;
        }
        &.m-r-15 {
          margin-right: 15px;
        }
      }
      .margin-top {
        margin-top: 35px;
      }
      .m-r-5 {
        margin-right: 5px;
      }
      .color-white {
        color: #444444;
      }
      .right-arrow {
        &::after {
          position: absolute;
          right: -33%;
          content: "";
          display: inline-block;
          width: 35px;
          height: 15px;
          background: url('~@/assets/img/institution/arrow.png') no-repeat center;
          background-size: cover;
          z-index: 2;
        }
      }
      .right-arrow-space {
        &::after {
          position: absolute;
          right: -42%;
          content: '';
          display: inline-block;
          width: 40px;
          height: 18px;
          background: url('~@/assets/img/institution/arrow.png') no-repeat center;
          background-size: cover;
          z-index: 2;
        }
      }
      .business-process-analyze {
        position: relative;
        display: flex;
        align-items: center;
        padding-left: 14px;
        margin-right: 25px;
        width: 660px;
        height: 273px;
        background: rgb(148 200 252 / 10%);
        border: 2px solid rgba(148, 200, 252, 0.6);
        &:before {
          content: '全球溯源中心风险分析';
          position: absolute;
          top: -35px;
          left: 35%;
          font-size: 18px;
          color: #444;
          font-weight: 400;
        }
        .business-process-analyze-small {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-around;
          margin-right: 20px;
          width: 480px;
          height: 160px;
          background: rgb(148 200 252 / 20%);
          border: 2px solid rgba(148, 200, 252, 0.6);
          &:before {
            content: '信息反馈';
            position: absolute;
            top: -35px;
            font-size: 18px;
            color: #444;
            font-weight: 400;
          }
        }
      }
      .business-process-put-forward {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        width: 158px;
        height: 317px;
        background: rgb(148 200 252 / 10%);
        border: 2px solid rgba(148, 200, 252, 0.6);
        &:before {
          content: '服务需求提出';
          position: absolute;
          top: -35px;
          left: 50%;
          margin-left: -41px;
          font-size: 14px;
          color: #444;
          font-weight: 400;
        }
      }
      .bg-1 {
        background-image: url('~@/assets/img/institution/circle-1.png');
      }
      .bg-2 {
        background-image: url('~@/assets/img/institution/circle-2.png');
      }
      .bg-3 {
        background-image: url('~@/assets/img/institution/circle-3.png');
      }
      .bg-4 {
        background-image: url('~@/assets/img/institution/circle-4.png');
      }
      .bg-5 {
        background-image: url('~@/assets/img/institution/circle-5.png');
      }
      .bg-6 {
        background-image: url('~@/assets/img/institution/circle-6.png');
      }
      .bg-7 {
        background-image: url('~@/assets/img/institution/circle-7.png');
      }
    }
    .business-process-tips {
      font-size: 14px;
      font-weight: 400;
      color: #444444;
      opacity: 0.8;
    }
  }
}
</style>