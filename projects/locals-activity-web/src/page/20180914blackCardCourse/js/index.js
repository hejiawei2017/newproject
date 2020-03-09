import "../css/index.less";
import "../css/reset.less";
require("@js/flexible.min.js");
import "babel-polyfill";
import Config from "@js/config.js";
import { showBody, telRegExp, getCode, getParam } from "../../../js/util";

$(function() {
  showBody();
  let api = Config.api;
  let mobile = null;

  // 发送验证码
  $("#send").on("click", function(e) {
    // console.log(1111)
    mobile = $("#phone").val();
    // 验证不通过return
    if (!telRegExp.test(mobile)) {
      alert("请输入正确的手机号");
      return;
    }
    // 按钮失效
    $("#send").attr("disabled", true);
    // 发送验证码接口
    sendCode(mobile);
  });

  // 验证验证码
  $("#verify").on("click", function(e) {
    let authCode = $("#authNum").val();
    if (!authCode) {
      alert("请输入收到的验证码");
      return;
    }
    // 验证验证码
    let param = {
      mobile: mobile,
      authCode: authCode,
      authType: 1,
      appId: "4",
      platform: "ACT"
    };
    // 验证请求优惠卷
    codeSignIn(param);
  });

  function sendCode(mobile) {
    return $.ajax({
      type: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      url: api + "/platform/auth/auth-code/send",
      data: JSON.stringify({ mobile: mobile }),
      success: function(res) {
        if (res.success) {
          // 倒计时
          let i = 60;
          let timer = setInterval(() => {
            i--;
            $("#send").text(`${i}秒后重试`);
            if (i <= 0) {
              $("#send")
                .attr("disabled", false)
                .text("重新获取验证码");
              clearInterval(timer);
            }
          }, 1000);
        } else {
          alert(res.errorMsg || "验证码获取失败!");
        }
      },
      error: function(err) {
        alert(err);
      }
    });
  }

  function codeSignIn(data) {
    return $.ajax({
      type: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      url: api + "/platform/auth/auth-code/sign-in",
      data: JSON.stringify(data),
      success: function(res) {
        if (res.success) {
          // 存token
          sessionStorage.token = res.data;
          localStorage.token = res.data;

          //   检查是否参加过活动
          check(7, mobile).then(res => {
            if (res) {
              location.href = "./success.html";
            } else {
              alert("您已经参加过活动了哦，关注locals路客精品民宿获取更多活动优惠信息");
            }
          });

          // 获user-info
          $.ajax({
            type: "GET",
            headers: {
              "LOCALS-ACCESS-TOKEN": "Bearer " + sessionStorage.getItem("token")
            },
            url: api + "/platform/user/user-info",
            success: function(res) {
              localStorage.setItem("userInfo", JSON.stringify(res.data));
            }
          });
        } else {
          alert(res.errorMsg || "注册失败，请重试一下");
        }
      },
      error: function(err) {
        alert(err.errorMsg || "注册失败，请重试一下");
      }
    });
  }

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
          console.log(res);
          resolve(res.success);
        }
      });
    });
  }
});
