    <template>
    <div class="rule">
      1.活动时间：奖品数量有限，先到先得，发完即止<br/>
      2.活动玩法：邀请好友为自己助力累积指定数量新注册好友（首次注册登录HYCAN合创小程序）即可0元购买指定好物<br/>
      3.每位用户活动期间仅限0元购买一份好物，同一账号、同一手机号或同一设备视为同一用户<br/>
      4.每位新用户注册时即可获得80积分（注册+绑定微信+完善资料），每位新用户最多可为1位好友助力。<br/>
      5.0元购的好物如非质量原因，一经寄出不接受退换。<br/>
      6.如用户存在违法违规或违反活动公平公正原则，包括但不限于作弊获得好物等行为，广汽蔚来新能源汽车有限公司有权取消用户的0元购资格。<br/>
      7.广汽蔚来对该活动持有最终解释权
    </div>
</template>

<script>
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
      padding: rem(30);
      font-size: rem(28);
      font-family: Microsoft YaHei,SimHei,PingFangSC-Regular,PingFangSC;
      font-weight: 400;
      color: rgba(116,122,134,1);
      line-height: rem(60);
    }
</style>
