import '../css/index.less'
import '../css/active-end.less'
import { getUrlArg, telRegExp } from '../../../js/util'
import $ from 'jquery'
import Config from '@js/config.js'


// // 获取参数
let api=Config.api;
// let api="http://ms.localhome.cn/api";
let data = getUrlArg();
let info = data.ADTAG;
// if (info) { let num = info.split('.')[1] };
let canGetCoupon=false;
let mobile=null;

function sendCode(mobile){
    return $.ajax({
        type: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        url:api+'/platform/auth/auth-code/send',
        data:JSON.stringify({'mobile':mobile}),
        success:function(res){
            if(res.success){
                canGetCoupon=true;
                // 倒计时
                let i = 60;
                let timer = setInterval(() => {
                    i--;
                    $('#send').text(`请于${i}秒后重试`)
                    if (i <= 0) {
                        $('#send').attr('disabled', false).text('重新获取验证码')
                        clearInterval(timer)
                    }
                }, 1000)
            }else{
                alert(res.errorMsg || '验证码获取失败!')
            }
        },
        error:function(err){
            alert(err)
        }
    })
}

function codeSignIn(data){
    return $.ajax({
        type: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        url:api+'/platform/auth/auth-code/sign-in',
        data:JSON.stringify(data),
        success:function(res){
            if(res.success){
                // 存token
                sessionStorage.token = res.data;
                localStorage.token = res.data;

                // 获user-info
                $.ajax({
                    type:'GET',
                    headers:{
                        'LOCALS-ACCESS-TOKEN':'Bearer ' + sessionStorage.getItem('token')
                    },
                    url:api+'/platform/user/user-info',
                    success:function(res){
                        // console.log(res)
                        localStorage.setItem('userInfo', JSON.stringify(res.data));
                    }
                })

                // 缓存号码
                sessionStorage.setItem('phoneNumber',mobile)

                
                 // 获取优惠劵
                 $.ajax({
                    type: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    url:api+'/coupon/record/receive/',
                    data:JSON.stringify({mobile:mobile,couponCode:'HJKIHNGV',platform:'WEB'}),
                    success:function(res){
                        if(res.success){
                           console.log('领取成功')
                           // 登录成功跳转抽奖页面
                           location.href="./lottery.html";
                        }else{
                            alert('跳转失败;错误码001 请重试') 
                        }
                    },
                    error:function(err){
                        alert('跳转失败;错误码002 请重试')
                    }
                })
            }else{
                alert(res.errorMsg || '登录失败，请重试') 
            }
        },
        error:function(err){
            alert(err.errorMsg || '登录失败，请重试')
        }
    })
}


// 验证电话号码
$('#send').on('click', function(e) {
    mobile = $('#phone').val()
        // 验证不通过return
    if (!telRegExp.test(mobile)) {
        alert('请输入正确的手机号') 
        return;
    };
    // 按钮失效
    $('#send').attr('disabled', true)
    // 发送验证码接口
    sendCode(mobile);
    
})

// 验证验证码
$('#verify').on('click',function(e){
    let authCode=$('#authNum').val();
    if(!authCode && !canGetCoupon){
        alert('请输入收到的验证码');
        return
    }
    // 验证验证码，获取优惠卷
    let param={
        mobile:mobile,
        authCode:authCode,
        authType:1,
        appId:'4',
        platform: "ACT"
    }
    // 验证请求优惠卷
    codeSignIn(param)
})

// 微信分享代码
var appId, timestamp, nonceStr, signature = "";
    
        var shareUrl = window.location.href;
        var shareImg = 'http://f.localhome.cn/static/wechatfont.jpeg';

        var desc = "好礼到家 送房又送车！";
        var title = "路客民宿X曹操专车 七夕送大礼";
        var url = location.href.split('#')[0].toString();
    
        $(function () {
            $.ajax({
                type: 'POST',
                url: "http://ms.localhome.cn/api/wechat/five-plus/config?url="+url,
                contentType: "application/json",
                success: function (res) {
                        appId = res.data.appId;
                        timestamp = res.data.timestamp;
                        nonceStr = res.data.nonceStr;
                        signature = res.data.signature;
                },
                fail: function () {
                    showMsg("服务器连接error", "bottom");
                }
            });
            
            
            setTimeout(function () {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: appId, // 必填，公众号的唯一标识
                    timestamp: timestamp, // 必填，生成签名的时间戳
                    nonceStr: nonceStr, // 必填，生成签名的随机串
                    signature: signature,// 必填，签名
                    jsApiList: [
                        'checkJsApi',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'hideOptionMenu',
                        'showOptionMenu',
                        'closeWindow',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'previewImage',
                        'chooseImage',
                        'uploadImage',
                        'downloadImage'
                    ] // 必填，需要使用的JS接口列表
                });
                wx.ready(function () {
                    wx.onMenuShareTimeline({
                        title: title,
                        link: shareUrl,
                        imgUrl: shareImg,
                        success: function () {
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: title,
                        desc: desc,
                        link: shareUrl,
                        imgUrl: shareImg, // 分享图标
                        type: '',
                        dataUrl: '',
                        success: function () {
                        }
                    });
    
                });
            },1000);
  
    
        })