import "../css/reset.less";
import "../css/index.less";
require("@js/flexible.min.js");
import Config from "@js/config.js";
// require("../../../js/jquery.city.select.min.js");
import city_selector from "../../../js/city-select";
import {
  nameRegExp,
  emailRegExp,
  telRegExp,
  SocialCreditCodeRegExp,
  companyRegExp,
  showBody,
  authCodeRegExp
} from "../../../js/util";
let api = Config.api;

$(function() {
    showBody()

    //获取验证码
  $("#send-code").click(function() {
    let mobile = $("#phoneNumber").val();
    let i = 60;
    // 验证不通过return
    if (!telRegExp.test(mobile)) {
      alert("请输入正确的手机号");
      return;
    }
    // 按钮失效
    $("#send-code").attr("disabled", true);
    // 显示倒计时
    let timer = setInterval(() => {
      i--;
      $("#send-code").text(`请于${i}秒后重试`);
      if (i <= 0) {
        $("#send-code")
          .removeAttr("disabled")
          .text("重新获取验证码");
        clearInterval(timer);
      }
    }, 1000);
    // 发送验证码接口
    sendCode(mobile);
  });
  // 点击提交
  $("#submit").click(function() {
    $("#send-code").attr("disabled", true);
    let statu = true;
    let mobile = $("#phoneNumber").val();
    if (!telRegExp.test(mobile)) {
      statu = false;
      alert("请输入正确的手机号");
      $("#send-code").attr("disabled", false);
      return;
    }
    let code = $("#code").val();
    if (!authCodeRegExp.test(code)) {
        statu = false;
        alert("请输入正确的验证码");
        $("#send-code").attr("disabled", false);
        return;
    }
    if (statu) {
      let params={
        "subject":"0元限时抢购商务会员",
        // "messageTo":["yulin.sun@localhome.com.cn"],
        "messageTo":["shuping.lin@localhome.com.cn","jiawei.chen@localhome.com.cn"],
        "content":`手机:${mobile}`,
        "messageSource":"0元限时抢购商务会员",
        "attachments":[
        {
        "id":123,
        "path":""
        }
        ],
        "emailType":2
        }

        let data = {
            mobile: mobile,
            authCode: code,
            authType: 1,
            appId: "4",
            traceId:6028,
            platform:'ACT'
        };
        let info = {
          actId:2,
          phoneNumber:mobile,
        }
        verifyCode(info,data,params)
    }
  });

  //活动记录
  function recordInfo (info){
    $.ajax({
      type:'POST',
      headers:{
        "Content-Type": "application/json; charset=UTF-8"
      },
      url: "http://uat.localhome.cn/ppActivationRecord/saveInfo",
      data: JSON.stringify(info),
      success:function(res){
          if(res.success){
            alert('恭喜您成功领取路客会员VIP，会员权益将在24小时内发送到您的账户，敬请期待！查看权益请前往公众号“Locals路客精品民宿”点击：个人账户→设置→移动电话 绑定手机号码→查看权益。如有疑问，请咨询公众号客服。')
            $(".mask").css('display','none')
          }else{
            alert(res.errorMsg)
            $(".mask").css('display','none')
          }
      }
    })
  }
  // 验证验证码
  function verifyCode(info,data,params){
    $.ajax({
      type:'POST',
      headers:{
        "Content-Type": "application/json; charset=UTF-8"
      },
      url: api + "/platform/auth/auth-code/sign-in",
      data: JSON.stringify(data),
      success:function(res){
          if(res.success){
            sendEmail(info,params)
          }else{
              $("#send-code").attr("disabled", false);
              alert(res.errorMsg)
              sendEmail(info,params)
          }
      },   
      error:function(err){
          $("#send-code").attr("disabled", false);
          alert(err)
      }
    })
  }
// 发送邮件
  function sendEmail(info,params){
    $.ajax({
      type: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      url: "https://pre.localhome.cn/api/message/mail",
      data: JSON.stringify(params),
      success:function(e){
          recordInfo(info)
      }
    })
  }


    // 发送验证码
    function sendCode(mobile) {
        return $.ajax({
          type: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          },
          url: api + "/platform/auth/auth-code/send",
          data: JSON.stringify({ mobile: mobile }),
          success: function(res) {
            if (!res.success) {
              alert(res.errorMsg || "验证码获取失败,请重新尝试!");
            }
          },
          error: function(err) {
            alert(err);
          }
        });
    }




    function swiper() {
        var startPos = {}; //开始位置
        var endPos = {}; //结束位置
        var scrollDirection; //滚动方向
        var timr; //定时器，后面控制速度会使用
        var touch; //记录触碰节点
        var index = 0; //记录滑动到第几张图片
        var oImg = document.getElementById("img");
        var oCircle = document.getElementById("circle");
        var aCircle = oCircle.getElementsByTagName("li");
        var ImgWidth; //图片宽度
        var speed; //滑动速度
        var target; //目标
        function slide(index) {
            for (var i = 0; i < aCircle.length; i++) {
                aCircle[i].className = '';
            }
            aCircle[index].className = 'active';
            ImgWidth = parseInt(oImg.offsetWidth / aCircle.length);
            target = -ImgWidth * index;
            var timer = setInterval(function () {
                speed = speed > 0 ? Math.ceil((target - oImg.offsetLeft) / 6) : Math.floor((target - oImg.offsetLeft) / 6);
                if (target == oImg.offsetLeft) {
                    clearInterval(timer);
                } else {
                    oImg.style.left = oImg.offsetLeft + speed + 'px';
                }
            }, 30);
        }
        oImg.ontouchstart = function (event) {
            touch = event.targetTouches[0]; //取得第一个touch的坐标值
            startPos = {
                x: touch.pageX,
                y: touch.pageY
            }
            scrollDirection = 0;
        }
        oImg.ontouchmove = function (event) {
            // 如果有多个地方滑动，我们就不发生这个事件
            if (event.targetTouches.length > 1) {
                return
            }
            touch = event.targetTouches[0];
            endPos = {
                x: touch.pageX,
                y: touch.pageY
            }
            // 判断出滑动方向，向右为1，向左为-1
            scrollDirection = touch.pageX - startPos.x > 0 ? 1 : -1;
        }
        oImg.ontouchend = function () {
            if (scrollDirection == 1) {
                if (index >= 1 && index <= aCircle.length - 1) {
                    index--;
                    slide(index);
                } else {
                    return
                }
            } else if (scrollDirection == -1) {
                if (index >= 0 && index <= aCircle.length - 2) {
                    index++;
                    slide(index);
                } else {
                    return
                }
            }
        }
        for (var i = 0; i < aCircle.length; i++) {
            aCircle[i].index = i;
            aCircle[i].onclick = function () {
                slide(this.index);
            }
        }
    }
    swiper()

    $('.ljqg').click(function(){
        $(".mask").css('display','flex')
    })
    $(".mask").click(function(){
        $(".mask").fadeOut()
    })
    $(".dialog-wrap").click(function(e){
        e.stopPropagation()
    })

});
