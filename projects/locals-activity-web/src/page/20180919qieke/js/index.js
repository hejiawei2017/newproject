import '../css/index.less'
import '../css/reset.less'
require("@js/flexible.min.js");
import 'babel-polyfill'
import { getUrlArg, telRegExp,getCode,showBody } from '../../../js/util'
import Config from '@js/config.js'

$(function(){
    let api=Config.api;
    let canGetCoupon=false
    let mobile=null
    let userInfo = sessionStorage.getItem("userInfo") || localStorage.getItem('userInfo');

    showBody()
    // 如果有userInfo显示已经登录，没有的话微信授权

    if (userInfo) {
        userInfo = JSON.parse(userInfo);
        $('#signed').css('display','flex')
        $('#sign').css('display','none')
      }else{
        async function getUserInfo() {
            // 等待获取token
            await getCode(api);
            
            if (sessionStorage.getItem("token")) {
                $.ajax({
                    type: "GET",
                    headers: {
                        "LOCALS-ACCESS-TOKEN": "Bearer " + sessionStorage.getItem("token")
                    },
                    url: api + "/platform/user/user-info",
                    success: function (res) {
                      sessionStorage.setItem("userInfo", JSON.stringify(res.data));
                      userInfo=sessionStorage.getItem("userInfo");
                      userInfo = JSON.parse(userInfo);
                      if (telRegExp.test(res.data.mobile)) {
                        // 绑定了手机号码
                        $('#sign').css('display','none')
                        $('#signed').css('display','flex')
                      }
                    }
                });
            }
        }
        getUserInfo();
      }
    // 发送验证码
    $('#send').on('click', function(e) {
        // console.log(1111)
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
                    // sessionStorage.setItem('phoneNumber',mobile)
    
                    
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
                                // 成功领取优惠劵
                                $('#sign').css('display','none')
                                $('#success').css('display','flex')
                            }else{
                                alert('领取失败，请重新尝试一下') 
                            }
                        },
                        error:function(err){
                            alert('领取失败，请重新尝试一下')
                        }
                    })
                }else{
                    alert(res.errorMsg || '注册失败，请重试一下') 
                }
            },
            error:function(err){
                alert(err.errorMsg || '注册失败，请重试一下')
            }
        })
    }
})