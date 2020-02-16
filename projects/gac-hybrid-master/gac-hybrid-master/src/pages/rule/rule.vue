    <template>
    <div class="rule">
        <Expansion :open="defaultExpansion === '1'" title="一、TOP10作品投票">
            <p>1）投票规则：每位用户最多可给3款作品投票，投票后不可取消</p>
            <p>2）投票奖励：首次完成投票，可获得10积分奖励</p>
            <p>3）投票截止：9月20日 00:00</p>
        </Expansion>
        <Expansion :open="defaultExpansion === '2'" title="二、邀请投票奖励">
            <p>
                您可以通过投票主页、作品详情页的分享/拉票功能，邀请好友参与此次活动投票，<span>好友在您的邀请下完成首次投票，可计入您的成功邀请人数。</span>成功邀请一定数量的好友，可获得相应的奖励：
            </p>
            <p class="mar-t">
                1）
                <span>积分奖励：</span>
                好友在您的邀请下完成首次投票，可计入您的成功邀请人数。邀请好友为社区新用户，按10积分/人计算，若为老用户，按5积分/人计算。
                <span>每位用户可最多邀请20人，该项积分将于9月20日12:00进行最终统计结算后一次性发放。</span>
            </p>
            <p class="mar-t">
                2）
                <span>创始版车模碎片-A：</span>
                累计邀请人数达3人，可获得该张车模碎片
            </p>
            <p class="mar-t">
                3）
                <span>合创版车模碎片-A：</span>
                累计邀请人数达5人，可获得该张车模碎片
            </p>
            <p>邀请好友投票将与作品投票同时于9月20日 00:00截止</p>
        </Expansion>
        <Expansion :open="defaultExpansion === '3'" title="三、车模奖励及兑换">
            <p>本次活动将提供200套1:18「创始版」车模（CEO签名）、200套1:18「合创版」车模（设计师签名）作为实物奖励。每一种车模都需要完成相应的任务集齐3张车模碎片后可进行兑换：</p>
            <p class="mar-t">1）车模碎片的获取</p>
            <p><span>「创始版」车模：</span></p>
            <p>碎片-A：邀请好友投票首次完成投票，累计达成3人可获取</p>
            <p>碎片-B：通关「HYCAN拼图游戏」第3关可获取</p>
            <p>碎片-C：9月23日从所有参与投票的用户中随机抽取200名发放</p>
            <p class="mar-t"><span>「合创版」车模：</span></p>
            <p>碎片-A：邀请好友投票首次完成投票，累计达成5人可获取</p>
            <p>碎片-B：通关「HYCAN拼图游戏」第7关可获取</p>
            <p>碎片-C：9月24日从所有参与投票的用户中随机抽取200名发放</p>
            <p>特别幸运的用户，有机会同时获得两款车模哟~</p>
        </Expansion>
        <Expansion :open="defaultExpansion === '4'" title="四、HYCAN拼图游戏">
            <p>此次活动配套一款拼图小游戏，共设置7关，每个关卡通关后可获得相应的奖励：</p>
            <p>第1关（9月14日开放）：10积分</p>
            <p>第2关（9月14日开放）：10积分</p>
            <p>第3关（9月14日开放）：「创始版」车模碎片-B</p>
            <p>第4关（9月16日开放）：10积分</p>
            <p>第5关（9月18日开放）：10积分</p>
            <p>第6关（9月20日开放）：10积分</p>
            <p>第7关（9月23日开放）：「合创版」车模碎片-B</p>
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
