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
  // 获取城市
  city_selector();
  let api = Config.api;

  showBody();


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
    console.log(mobile)
    if (!telRegExp.test(mobile)) {
      statu = false;
      alert("请输入正确的手机号");
      return;
    }
    let code = $("#code").val();
    if (!authCodeRegExp.test(code)) {
        statu = false;
        alert("请输入正确的验证码");
        return;
    }
    if (statu) {
      let params={
        "subject":"广交会",
        // "messageTo":["yulin.sun@localhome.com.cn"],
        "messageTo":["shuping.lin@localhome.com.cn","jiawei.chen@localhome.com.cn"],
        "content":`手机:${mobile}`,
        "messageSource":"广交会",
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
            platform: "ACT"
        };
        let info = {
          actId:1,
          phoneNumber:mobile,
        }
        verifyCode(info,data,params)
    }
  });

  //活动记录
  function recordInfo (info,params){
    $.ajax({
      type:'POST',
      headers:{
        "Content-Type": "application/json; charset=UTF-8"
      },
      url: "http://uat.localhome.cn/ppActivationRecord/saveInfo",
      data: JSON.stringify(info),
      success:function(res){
          if(res.success){
            sendEmail(params)
          }else{
            alert(res.errorMsg)
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
              recordInfo(info,params)
          }else{
              $("#send-code").attr("disabled", false);
              alert(res.errorMsg)
          }
      },
      error:function(err){
          $("#send-code").attr("disabled", false);
          alert(err)
      }
    })
  }
// 发送邮件
  function sendEmail(params){
    $.ajax({
      type: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      url: "https://pre.localhome.cn/api/message/mail",
      data: JSON.stringify(params),
      success:function(e){
          alert('恭喜您成功领取路客商务旅客+银卡会员VIP，资格会在24小时内发送到你的账号，敬请及时查看尊享权益，如有疑问，请咨询公众号客服！')
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
});
