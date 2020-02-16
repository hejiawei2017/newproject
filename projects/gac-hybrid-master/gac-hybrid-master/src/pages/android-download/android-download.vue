<template>
    <div style="text-align:center" class="about-con">
        <img class="about-bg"  src="https://azure-shop.obs.cn-south-1.myhuaweicloud.com/dowm_bg%403x.png"/>
        <div class="about-p tips">下载体验APP，获取30积分奖励</div>
        <div class="about-p title">获取攻略：</div>
        <div class="about-p item">1、下载「HYCAN合创」APP</div>
        <div class="about-p item">2、打开APP，<span style="color:#EC5042;font-weight:bold;">用手机号18688880429登录</span></div>
        <div class="about-p item">3、体验3~5分钟APP，可返回小程序领取奖励</div>
        <div class="download"> <a href="https://github.com/shadowsocks/shadowsocks-android/releases/download/v4.8.3/shadowsocks--universal-4.8.3.apk" target="_blank">立即下载</a> </div>
    </div>
</template>

<script>


export default {
    name: 'androidDownload',
    components: {
    },
    data () {
        return {
        }
    },
    mounted () {
    },
    watch: {
    },
    methods: {
    }
}
</script>

<style lang="scss">
    @import "~@/common/scss/base";
    .about-con{
        margin-top: rem(100)
    }
    .about-bg{
        width: rem(750);
        height: rem(508);
        margin: auto;
        text-align: left;
    }
    .about-p{
        margin:rem(10) auto 0;
        width:rem(630);
        font-size:rem(28);
        font-weight:400;
        color:#051C2C;
        line-height:rem(50);
        text-align: left;
        text-indent: rem(54);
        word-break: break-all;
        font-weight: bold;
    }
    .about-p.tips{
        width: rem(640);
        height: rem(100);
        background-color: #F6F7F8;
        border-radius: 8px;
        text-align: center;
        font-size: rem(36);
        line-height: rem(100);
        
    }
    .about-p.title{
        font-size: rem(32);
        margin-top: rem(40);
    }
    .about-p.item{
        font-weight: normal;
        font-size: rem(28);
    }
    .download{
        margin:rem(56) auto 0;
        width: rem(640);
        height: rem(88);
        background-color: #2cccd3;
        border-radius: rem(44);
        text-align: center;
        font-size: rem(32);
        line-height: rem(88);
        color: #fff;
        box-shadow:0px 7px 27px 0px rgba(44,204,211,0.25);
    }
    .download a{
        text-decoration: none;
        color: #fff;
    }
</style>
