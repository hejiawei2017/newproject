    <template>
    <div class="rule">
        <Expansion :open="defaultExpansion === '1'" title="一、TOP10作品投票">
            <p>1）投票规则：每位用户最多可投5票，每件作品最多可投1票，投票后不可取消</p>
            <p>2）投票奖励：首次完成投票，可获得10积分奖励</p>
            <p>3）投票截止：11月21日 23:59</p>
        </Expansion>
        <Expansion :open="defaultExpansion === '2'" title="二、邀请投票奖励">
            <p>
              您可以通过投票主页、作品详情页的分享/拉票功能，邀请好友参与此次活动投票，好友在您的邀请下完成首次投票，可计入您的成功邀请人数。成功邀请一定数量的好友，可获得相应的积分奖励：
            </p>
            <p>
              1）邀请好友为社区新用户，按10积分/人计算
            </p>
            <p>
              2）邀请好友为社区老用户，按5积分/人计算
            </p>
            <p>
              3）每位用户可最多邀请20人
            </p>
            <p>
              4）积分奖励将于11月22日12:00进行最终统计结算后一次性发放。
            </p>
            <p>邀请好友投票将与作品投票同时于11月21日 23:59截止</p>
        </Expansion>
        <Expansion :open="defaultExpansion === '3'" title="三、车模大奖及兑换">
          <p>1）<span>1:18 车模大奖：</span>本次活动将在每组投票用户各抽取35名用户(两组共70名用户)，每人奖励1:18创始版车模一台。12月5日将进行抽奖并公示。</p>
          <p class="mar-t">2）<span>奖品兑换：</span>获奖用户通过社区客服通道向工作人员提供收货地址等信息，待车模完成生产后(预计12月下旬)，向中奖用户发货。</p>
        </Expansion>
        <div class="bottom-text">该活动最终解释权由广汽蔚来所有</div>
    </div>
</template>

<script>
    import Expansion from '../../components/Expansion';
    /**
     * 从页面地址拿单个参数
     * @param name
     * @returns {*}
     */
    function getQueryString (name) {
      let reg = new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)', 'i');
      let r = window.location.href.match(reg);
      if (r != null) {
        return decodeURIComponent(r[2]);
      }
      return null;
    }
    export default {
        name: 'rule',
        components: {
            Expansion
        },
        data () {
            return {
                defaultExpansion: getQueryString('defaultExpansion')
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
                this.loaded = e.loaded;
                this.total = e.total;

            },
            onLoad:function(){
                this.complete = true;
            }
        }
    }
</script>

<style lang="scss">
    @import "~@/common/scss/base";
    .rule {
        font-size: rem(32);
    }
    p span {
        color: #051C2C;
        font-weight: bold;
    }
    p.mar-t {
        margin-top: rem(56);
    }
    .bottom-text {
        margin-top: rem(40);
        padding-bottom: rem(30);
        font-size: rem(24);
        font-family: PingFangSC;
        font-weight: 400;
        color: rgba(116,122,134,1);
        line-height: rem(24);
        text-align: center;
    }
</style>
