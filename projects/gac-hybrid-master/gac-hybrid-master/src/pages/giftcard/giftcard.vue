<template>
    <div>
        <div style="text-align:center" class="gc-con">
            <img class="gc-bg"  src="static/images/banner_bg.png"/>
            <div class="gc-rule-text">活动规则</div>
            <div class="gc-friend-tr" v-if="assstcount>0">仅限新注册好友助力</div>
            <div class="gc-friend-con" >
                <div class="gc-friend-t1" v-if="assstcount==0">您还没有好友助力哦，赶快去邀请好友吧~</div>
                <div class="gc-friend-t1"  v-if="assstcount<5 && assstcount>0">您已获得
                    <span class="gc-friend-t3" v-text="assstcount+'位'"></span>好友助力，还差
                    <span class="gc-friend-t4" v-text="5-assstcount+'位'"></span>哦，继续加油~
                    </div>
                <div class="gc-friend-t1" v-if="assstcount>=5">您已经获得
                    <span class="gc-friend-t3" v-text="assstcount+'位'"></span>好友助力，快去
                    <span class="gc-friend-t3">兑换奖品</span>吧~</div>
                <div class="gc-friend-list" >
                    <div class="gc-headimg-con" v-for="(img,i) in fmtImgs(assImgs)" :key="i">
                        <template v-if="img">
                            <img class="gc-friend-headimg" :src="img" />
                        </template>
                        <template v-if="!img">
                            <div class="gc-friend-headimg"></div>
                        </template>
                    </div>
                </div>
                <div class="gc-friend-t2" v-if="assstcount==0">仅限新注册好友助力</div>
            </div>
        </div>
        <div class="gc-mid-con">
            <div class="gc-share-con">
                <div class="gc-share-btn" @click="showShare">
                    <img class="gc-share-icon" src="static/images/wx.png">邀请好友
                </div>
                <div class="gc-share-btn">
                    <img class="gc-share-icon" src="static/images/pyq.png" @click="showQuan">分享到朋友圈
                </div>
            </div>
            <div class="gc-submit-btn" :class="{enable:enable}">兑换奖品</div>
            <div class="gc-mid-text" v-if = "productNum === 0">奖品已兑完，活动结束</div>
            <div class="gc-mid-text" v-if = "productNum > 0" v-text="'奖品库存：'+ productNum"></div>
            <div class="gc-mid-input-con">
                <div class="gc-mid-label">手机:</div>
                <input class="gc-mid-input" placeholder="请输入收取礼品码的手机"/>
                <div class="gc-mid-btn">确定</div>                
            </div>
        </div>
        <div class="gc-bottom-con">
            <div class="gc-bottom-title-fix">
               <div class="gc-bottom-title">热门积分奖品等你来拿</div>
            </div>
            <div class="gc-product-fix">
                <div class="gc-product-list">
                    <div class="gc-product-item" v-for="(item,i) in products" :key="i">
                        <img class="gc-product-img" :src="item.img"/>
                        <div class="gc-product-title" v-text="item.title"></div>
                        <div class="gc-score-con">
                            <div class="gc-score-icon"></div>
                            <div class="gc-score-text" v-text="item.score"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { test,getfriendLog,findassistanceCount,giftRemainCount } from '../../api/giftcard'
// import { getToken } from '../../api/auth'
import { getToken } from '../../libs/sdk';
export default {
    name: 'about',

    components: {
        
    },

    data () {
        return {
            assstcount:0,
            assImgs:[
                'https://azure-upms.obs.cn-south-1.myhuaweicloud.com/yunying_image_03_kdttepkkyyyeueee.png',
                'https://azure-upms.obs.cn-south-1.myhuaweicloud.com/yunying_image_03_kdttepkkyyyeueee.png',
                'https://azure-upms.obs.cn-south-1.myhuaweicloud.com/yunying_image_03_kdttepkkyyyeueee.png',
                'https://azure-upms.obs.cn-south-1.myhuaweicloud.com/yunying_image_03_kdttepkkyyyeueee.png',
                'https://azure-upms.obs.cn-south-1.myhuaweicloud.com/yunying_image_03_kdttepkkyyyeueee.png',
                
            ],
            products:[
                {
                    img:'https://test-azure-community.obs.cn-south-1.myhuaweicloud.com/20190709112630%2Fbbf160aaa4094ab2a0863fe77755c973.png',
                    title:'茶花套碗',
                    score:'1800',
                    id:'11',
                },
                {
                    img:'https://test-azure-community.obs.cn-south-1.myhuaweicloud.com/20190709112630%2Fbbf160aaa4094ab2a0863fe77755c973.png',
                    title:'茶花套碗',
                    score:'1800',
                    id:'11',
                },
                {
                    img:'https://test-azure-community.obs.cn-south-1.myhuaweicloud.com/20190709112630%2Fbbf160aaa4094ab2a0863fe77755c973.png',
                    title:'茶花套碗',
                    score:'1800',
                    id:'11',
                },
                {
                    img:'https://test-azure-community.obs.cn-south-1.myhuaweicloud.com/20190709112630%2Fbbf160aaa4094ab2a0863fe77755c973.png',
                    title:'茶花套碗',
                    score:'1800',
                    id:'11',
                },
            ],
            showInput:true,
            productNum:2,
            showInput:false,
            enable:false,
            showRulePop:false,
            showPostPop:false,
            showConfirmPop:false,
            qrCode:'',
            bgPath:'',
            tempFilePath:'',
            exchanged:false,
            phone:'',
        }
    },
    created (){
        // test().then(res=>{
        //     console.log(res);
        // })
        

        getfriendLog().then(res=>{
            console.log('getfriendLog',res.data);
            if(res.data.data &&res.data.data.length){
                this.assImgs = this.fmtImgs(res.data.data);
            }
        })

        findassistanceCount().then(res=>{
            console.log('findassistanceCount',res.data);
            this.assstcount = res.data.data.assstcount;
            this.enable = (res.data.data.assstcount>=5);
        })

        giftRemainCount().then(res=>{
            console.log('giftRemainCount',res.data);
            if(res.data.data.giftCount !== undefined){
                this.productNum = res.data.data.giftCount
                this.exchanged = res.data.data.isChanged
                this.phone = res.data.data.phone
            }
        })  
        
        
        


    },

    mounted () {
        
    },

    watch: {
        
    },

    methods: {
        fmtImgs:function(arr){
            var ret = [];
            for(var i = 0;i < 5;i++){
                if(arr[i]){
                    ret.push(arr[i]);
                }else{
                    ret.push('');
                }
            }
            return ret;
        },
        toProduct:function(pid){
            // 跳转到

        },
        btnClick:function(){
            if(this.enable){
                this.showInput = true;
            }
            
        },
        showQuan:function(){

        },
        showShare:function(){
            console.log(666)
            wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                }
            });

        }
    }
}
</script>

<style lang="scss">
    @import "~@/common/scss/base";
    .gc-con{
        width: rem(750);
        position: relative;
        overflow: auto;
    }
    .gc-bg{
        width: rem(750);
        height: rem(672);
        position:absolute;
        top: 0;
        left: 0;
    }
    .gc-rule-text{
        width:rem(136);
        height:rem(60);
        font-size:rem(24);
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:rem(60);
        position:absolute;
        right: rem(0);
        top:rem(30)
    }
    .gc-friend-con{
        position: relative;
        margin: rem(612) auto 0;
        width:rem(690);
        background:rgba(255,255,255,1);
        border-radius:rem(20);
        text-align: center;
        overflow: auto;
        
    }
    .gc-friend-t1{
        height:rem(28);
        font-size:rem(28);
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(0,0,0,1);
        line-height:rem(28);
        margin-top: rem(25)
    }
    .gc-friend-t3{
        color: #2DCDD3;
        margin-right: rem(5)
    }  
    .gc-friend-t4{
        color: #FF9900;
        margin-right: rem(5)
    }  
    .gc-friend-list{
        height: rem(60);
        margin: rem(21) auto rem(24);
        // overflow: auto;
        width: rem(275);
    }
    .gc-headimg-con{
        float: left;
        height: rem(60);
        width: rem(50);
        position: relative;
    }   
    .gc-friend-headimg{
        width:rem(60);
        height:rem(60);
        background:rgba(238,238,238,1);
        border:rem(2) solid rgba(255, 255, 255, 1);
        border-radius:50%;
        position: absolute;
        top: 0;
        left: 0;

        
    }
    .gc-submit-btn.enable{
        background:linear-gradient(-90deg,rgba(44,204,211,1),rgba(64,216,222,1));
        box-shadow:0px rem(12) rem(12) 0px rgba(43,206,211,0.15);
        color:rgba(255,255,255,1);
    }
    .gc-friend-t2{
        height:rem(24);
        font-size:rem(24);
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(255,153,0,1);
        line-height:rem(24);
        margin-bottom: rem(37);
    }
    .gc-friend-tr{
        position: absolute;
        height:rem(24);
        font-size:rem(24);
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(5,28,44,1);
        line-height:rem(24);
        right: rem(30);
        top: rem(563)
    }
    .gc-mid-con{
        width:rem(690);
        // height:rem(350);
        background:rgba(255,255,255,1);
        border-radius:rem(20);
        margin: rem(30) auto 0;
        padding: rem(40) rem(35) rem(39);
        box-sizing: border-box;
    }
    .gc-share-con{
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    .gc-share-btn{
        width:rem(300);
        height:rem(88);
        background:linear-gradient(-90deg,rgba(44,204,211,1),rgba(64,216,222,1));
        box-shadow:0 rem(12) rem(12) 0px rgba(43,206,211,0.15);
        border-radius:rem(44);
        font-size:rem(30);
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:rem(88);
        text-align: center;
    }
    .gc-share-icon{
        height: rem(32);
        width: auto;
    }
    .gc-submit-btn{
        width:rem(620);
        height:rem(79);
        background:rgba(240,247,247,1);
        border-radius:rem(40);
        font-size:rem(30);
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(152,164,174,1);
        line-height:rem(79);
        margin: rem(64) auto 0;
        text-align: center;
    }
    .gc-mid-text{
        margin-top: rem(33);
        height:rem(30);
        font-size:rem(30);
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(5,28,44,1);
        line-height:rem(20);
        text-align: center;
    }
    .gc-bottom-con{
        margin:rem(30) auto 0;
        position: relative;
    }
    .gc-bottom-title-fix{
        position: absolute;
        width: 100%;
        text-align: center;
        top: 0;
        z-index: 2;
    }
    .gc-bottom-title{
        width:rem(401);
        height:rem(80);
        background:rgba(255,255,255,1);
        box-shadow:0 rem(10) rem(10) 0 rgba(43,206,211,0.1);
        border-radius:rem(40);
        margin: auto;
        font-size:rem(30);
        font-weight:normal;
        color:rgba(5,28,44,1);
        line-height:rem(80);
        text-align: center;
        
    }
    .gc-product-fix{
        position: absolute;
        width: 100%;
        text-align: center;
        top: rem(30);
    }
    .gc-product-list{
        width: rem(690);
        display: flex;
        flex-wrap: wrap;
        background: #fff;
        margin: 0 auto rem(30);
        border-radius:rem(20);
        overflow: hidden;
    }
    .gc-product-item{
        width: rem(345);
        text-align: center;
    }
    .gc-product-img{
        width: rem(345);
        height: rem(345);
    }
    .gc-product-title{
        height:rem(28);
        font-size:rem(28);
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(5,28,44,1);
        line-height:rem(28);
        
    }
    .gc-score-con{
        display: flex;
        align-items: center;
        justify-content: center;
        margin: rem(23) auto rem(23);
    }
    .gc-score-text{
        height:rem(30);
        font-size:rem(24);
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(116,122,134,1);
        line-height:rem(30);
    }
    .gc-score-icon{
        width: rem(30);
        height: rem(30);
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAhCAMAAACP+FljAAAAflBMVEUAAAB0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eoZ0eobjNiFlAAAAKXRSTlMABrw1+YtWq/ObPspwThMK2sVqJQ7tdxvm4qeiXkPStIJjRn6UiC4qMCrK7BkAAAGVSURBVDjLfZPpdoMgEIUHEFDEuC9xSaLZOu//gnXUpDbWfj/0jFeGy50DrAnLVIi0ZPAH4SD5EWec6Hwxv/8Kzg5+4HriLRsfZ44x15r71VLyr1mXU1udPEJYyITl08eEqgYRK3uAD8qrOwoFgBpfktZuOOhREhAjWtjBQ/TgiMhgB4HIqUPyb4cWES9/9siayQOQlajPNhaLnJYCAPOm4Oo+fYvsYedor1SlMERLuieuvUbzaMndF1ACBI4Cpjh+4tQGwDpPGKWOtgxuvvsS81gOlF2PePuVw+Epuk6kb8MPysFHVLDDHbGBZBnaFiaRtmec/AabqMKWznajHzWOVHLIVikF3uT4PhXQVjhR8dqT0qvjfK6jAMZFJu8gsyfcwBUDladwRsdQnok+/ohR05YANEhJOYQvX0+jlApM+nL8RTmMzQPYoUCs6eHuJGWRFod0Kc5iKw8kaDpmjCOnQrBViOYSIelsquw8Rjdu5LUoLrL2nXmo/fuS3CvccLLZejCdjN0fMedXAVtKo/okaZVZ38Nvubc9Otmj6NoAAAAASUVORK5CYII=)

    }
    .gc-mid-input-con{
        display: flex;
        width:rem(620);
        height:rem(88);
        background:rgba(246,247,248,0.78);
        border-radius:rem(8);
    }
    .gc-mid-label{
        font-size:rem(30);
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(5,28,44,1);
        line-height:rem(88);
        width: rem(100);
        text-align: center;
    }
    .gc-mid-input{
        width: rem(380);
        border: 0;
        background: transparent;
        outline: 0;
        font-size:rem(30);
        line-height:rem(88);
        padding: 0;
    }
    .gc-mid-btn{
        font-size:rem(30);
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(44,204,211,1);
        line-height:rem(88);
        text-align: center;
        width: rem(100);
    }

</style>
