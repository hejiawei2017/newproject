<template>
  <div class="rule">
    <div class="text">
      假如你被好友邀请下订单，则邀请人和你均会获得9800积分，300积分即时到账，9500积分转为大定时到账。<br/>
      同时你可邀请好友，邀请一个一级好友，一级好友又邀请了二级好友，若2个都转为大定，你将获得邀请好友奖励10700积分。
    </div>
    <img class="img" src="https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191204183631813-fxyj-rule%403x.png" alt="">
  </div>
</template>

<script>
    export default {
        name: 'rule'
    }
</script>

<style lang="scss">
  @import "~@/common/scss/base";
  .rule {
    padding-top: rem(24);
  }
  .text {
    margin: 0 rem(30);
    padding: rem(20) rem(3) rem(26) rem(18);
    height: rem(310);
    background:rgba(246,247,248,1);
    border-radius: rem(8);
    box-sizing: border-box;
    font-size: rem(28);
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(5,28,44,1);
    line-height: rem(44);
  }
  .img {
    display: block;
    width: 100%;
    height: auto;
  }

</style>
