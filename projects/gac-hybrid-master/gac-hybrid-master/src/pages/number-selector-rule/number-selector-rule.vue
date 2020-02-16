<template>
  <div class="rule">
    <div class="title">
      “个性号码在线选编”活动规则
    </div>
    <div class="block">1、 活动日期：2020年1月20日-2020年2月28日；首轮活动1月20日开启，除首轮外，逢每周五19:00-20:00开放选编号系统（注意：1月20日的首轮活动，用户将分时段进入系统，详见下文）。
    </div>
    <div class="block lag">2、个性号码选编：号码限量一万个，由“0000至9999”的四位阿拉伯数字组成。</div>
    <div class="block">3、活动参与对象：活动期间，所有订单用户均可参与“个性号码在线选编”。</div>
    <div class="block">4、首轮选编号规则：参与1月20日首轮选编号活动的用户，将分时段进入系统。首批盲订用户于当天 19:00 进入、第二批盲订用户 19:30 进入、小订用户 20:00 进入，均至 21:00 结束。次轮开始，所有订单客户可同步进入系统参与选编号。</div>
    <div class="block">5、在线选编方式：用户可通过系统提示 “自选随机号码” 或 “手动自编号码” 两种方式生成个性号码。</div>
    <div class="block">6、每轮活动同一用户仅有一次个性号码选编的权限，确定后当轮不可更改；如需更改，在新一轮活动开启后，放弃上一轮确认的个性号码，可再次对个性号码进行选编。</div>
    <div class="block">7、所有个性号码先占先得，如放弃已选编的个性号码，其自动回归号码池。</div>
    <div class="block">8、选定的个性号码可在 “个人中心” - “订单权益” 中查看；如发生退订，所选的个性号码随即失效，自动回归至号码池。</div>
    <div class="block">9、个性号码在线选编活动最终解释权，在法律允许范围内归广汽蔚来新能源汽车科技有限公司所有。</div>
  </div>
</template>

<script>
    export default {
        name: 'rule',
        components: {
        },
        data () {
            return {

            }
        },
        created(){


        },

        mounted () {

        },

        watch: {

        },

        methods: {
            onProgress:function(e){


            },
            onLoad:function(){

            }
        }
    }
</script>

<style lang="scss">
    @import "~@/common/scss/base";
    .rule {
      padding: 50px 30px;
    }
    .title {
      font-size:36px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(24,26,36,1);
      line-height:36px;
      text-align: center;
    }
    .title+.block {
      margin-top: 45px;
    }
    .block {
      font-size:28px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(24,26,36,1);
      line-height:44px;
    }
    .lag {
      margin-right: -20px;
      word-break: break-all;
    }
    .block+.block {
      margin-top: 30px;
    }
</style>
