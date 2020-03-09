import '../css/index.less'
import { telRegExp,getParam,weChatSign,getCode } from '../../../js/util'
import $ from 'jquery'
import Config from '@js/config.js'

// // 获取参数
let api=Config.api;
let canGetCoupon=false;
let mobile=null;
let userId=null;

// 获取sid
let traceId=getParam('sid') || 1;
let traceInfo="";
switch(parseInt(traceId)){
    case 10:traceInfo="baidu.com";
        break;
    case 11:traceInfo="mafengwo.cn";
        break;
    case 9854:traceInfo="zhenzi";
        break;
    default:traceInfo=""
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
    if(localStorage.getItem('coupon')){
        alert('已经领取过优惠劵');
        return;
    }
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
        traceId:traceId,
        traceInfo:traceInfo,
        platform:'ACT'
    }
    // 验证请求优惠卷
    codeSignIn(param)
})
// 获取微信code和token
getCode()




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
                alert('发送成功！')
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
                // 验证是否领取过再获取优惠劵
                check(8,mobile).then((res)=>{
                    if(res){
                        getCoupon()
                    }else{
                        alert('您已经领取过优惠劵了，关注路客公众号获取跟多优惠信息')
                    }
                })
            }else{
                alert(res.errorMsg || '领取失败，请重试') 
            }
        },
        error:function(err){
            alert(err.errorMsg || '领取失败，请重试')
        }
    })
}


// 获取优惠劵
function getCoupon(){
    $.ajax({
        type: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        url:api+'/coupon/record/receive-coupon/',
        data:JSON.stringify({mobile:mobile,code:'NUHHJRVF',platform:'WEB'}),
        success:function(res){
            if(res.success){
                // 设置缓存,已领取
                localStorage.setItem('coupon',1)
                location.href="http://f.localhome.cn/20180717coupon/success.html";
            }else{
                alert(res.errorMsg || '领取失败，请重试') 
            }
        },
        error:function(err){
            alert(err.errorMsg || '领取失败，请重试')
        }
    })
}

// 查询是否领过
function check(code, mobile) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        url: "http://uat.localhome.cn/ppActivationRecord/saveInfo",
        data: JSON.stringify({
          actId: code,
          phoneNumber: mobile
        }),
        success: function(res) {
          resolve(res.success);
        }
      });
    });
  }

// 微信分享代码
var appId, timestamp, nonceStr, signature = "";
    
        var shareUrl = window.location.href;
        var shareImg = 'http://f.localhome.cn/20180717coupon/images/WechatIMG62.png';
        var desc = "订房享立减优惠哦！";
        var title = "路客请你住好房，领50元订房红包！";
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


// 判断是否是微信打开
// var is_weixin = (function(){return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1})();
// console.log(is_weixin)
// if(is_weixin){
//     let REDIRECT_URI=encodeURIComponent('http://f.localhome.cn/20180717coupon/index.html')
//     // let REDIRECT_URI=encodeURIComponent('http://wpghj2.natappfree.cc')
//     let APPID='wx337df082cab07c04'
//     let SCOPE='snsapi_userinfo'
//     location.href=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}#wechat_redirect`  
// }

// // 获取code
// let code = getParam('code')
// if(code){
//     $.ajax({
//         url:'dev.localhome.cn/api/platform/auth/wechat-open/sign-up',
//         data:JSON.stringify({code:code,app:3}),
//         success:function(res){
//             console.log(res)
//             if(res.success){
//                 sessionStorage.token = res.data;
//                 // 获user-info
//                 $.ajax({
//                     type:'GET',
//                     headers:{
//                         'LOCALS-ACCESS-TOKEN':'Bearer ' + sessionStorage.getItem('token')
//                     },
//                     url:api+'/platform/user/user-info',
//                     success:function(res){
//                         // console.log(res)
//                         userId=res.data.id
//                         localStorage.setItem('userInfo', JSON.stringify(res.data));
//                     }
//                 })

//             }
//         }
//     })
// }
// alert(navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1)