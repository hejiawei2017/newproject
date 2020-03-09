import "../css/build.less";
import "../css/reset.less";
require("@js/flexible.min.js");
import "babel-polyfill";
import Config from "@js/config.js";
import { showBody, telRegExp, getCode, getParam } from "../../../js/util";

$(function() {
  showBody();
  let api = Config.api;
  let mobile = null;
  let userInfo =
    sessionStorage.getItem("userInfo") || localStorage.getItem("userInfo");
  let folder = true;
  let hasBindMobile = false;
  let type = getParam("type");

  showBody();
  // 如果有userInfo显示已经登录，没有的话微信授权
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
    if (telRegExp.test(userInfo.mobile)) {
      $("#phone").val(userInfo.mobile);
      $("#phone").attr("readonly", "readonly"); //手机号码不可修改
      hasBindMobile = true;
      mobile=userInfo.mobile
      $(".authcode").css("display", "none");
    }
  } else {
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
          success: function(res) {
            sessionStorage.setItem("userInfo", JSON.stringify(res.data));
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            userInfo = sessionStorage.getItem("userInfo");
            userInfo = JSON.parse(userInfo);
            if (telRegExp.test(res.data.mobile)) {
              // 绑定了手机号码
              hasBindMobile = true;
              mobile=userInfo.mobile;
              $(".authcode").css("display", "none");
              $("#phone").val(res.data.mobile);
              $("#phone").attr("readonly", "readonly"); //手机号码不可修改
            }
          }
        });
      }
    }
    getUserInfo();
  }

  //   点击折叠
  // $("#folder").click(function(e) {
  //   if (folder) {
  //     folder = false;
  //     $(".fold").animate({ maxHeight: "700px" }, 500, "linear");
  //   } else {
  //     folder = true;
  //     $(".fold").animate({ maxHeight: "0px" }, 500, "linear");
  //   }
  // });
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
    if (!hasBindMobile && !authCode) {
      alert("请输入收到的验证码");
      return;
    }
    // 验证验证码
    let params = {
      mobile: mobile,
      authCode: authCode,
      authType: 1,
      appId: "4",
      platform: "ACT"
    };
    // 如果已经授权且绑定了电话号码
    if (userInfo && hasBindMobile) {
      // 建立大厦跳转页面
      build();
    }
    // 如果有token但没有绑定手机请求新的token再获取新的userInfo
    else if (userInfo) {
      $.ajax({
        type: "PUT",
        headers: {
          "LOCALS-ACCESS-TOKEN": "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json; charset=UTF-8"
        },
        data: JSON.stringify({ mobile: mobile, code: authCode }),
        url: api + "/platform/user/user-info-mobile",
        success: function(res) {
          if (res.success) {
            sessionStorage.token = res.data;
            localStorage.token = res.data;
            // 获取userInfo
            $.ajax({
              type: "GET",
              headers: {
                "LOCALS-ACCESS-TOKEN":
                  "Bearer " + sessionStorage.getItem("token")
              },
              url: api + "/platform/user/user-info",
              success: function(res) {
                sessionStorage.setItem("userInfo", JSON.stringify(res.data));
                localStorage.setItem("userInfo", JSON.stringify(res.data));
                userInfo = res.data;
                // 建立大厦
                build();
              }
            });
          } else {
            // $(".dialog-mast").css("display", "none");
            // alert(res.errorMsg || "登录失败，请重试");
          }
        }
      });
    } else {
      //在浏览器打开
      codeSignIn(params);
    }
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
          //   canGetCoupon = true;
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
  // 验证码登录
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

          // 获user-info
          $.ajax({
            type: "GET",
            headers: {
              "LOCALS-ACCESS-TOKEN": "Bearer " + sessionStorage.getItem("token")
            },
            url: api + "/platform/user/user-info",
            success: function(res) {
              // console.log(res)
              localStorage.setItem("userInfo", JSON.stringify(res.data));
              sessionStorage.setItem("userInfo", JSON.stringify(res.data));
              userInfo = res.data;
              build();
            }
          });
        } else {
          alert(res.errorMsg || "建立失败啦，请重试一下");
        }
      },
      error: function(err) {
        alert(err.errorMsg || "建立失败啦，请重试一下");
      }
    });
  }

  // 获取优惠劵50元
  function getCoupon() {
    return $.ajax({
      type: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      url: api + "/coupon/record/receive/",
      data: JSON.stringify({
        mobile: mobile,
        couponCode: "NUHHJRVF",
        platform: "WEB"
      }),
      success: function(res) {
        if (res.success) {
          console.log("领取成功");
          //   跳转页面
          location.href = "./shareBuilding.html";
        } else {
          alert("领取优惠劵失败;错误码e001 请重试");
        }
      },
      error: function(err) {
        alert("领取优惠劵失败;错误码e002 请重试");
      }
    });
  }
  //   获取1个月商务会员
  function getVip() {
    let params = {
      userId: userInfo.id,
      changeMode: 2,
      vipType: 1,
      source: "回忆大厦赠送"
    };
    $.ajax({
      type: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      url: api + "/platform/cash-vip",
      data: JSON.stringify(params),
      success: res => {
        if (res.success) {
          console.log("领取商务会员成功");
        } else {
          //   alert(res.errorDetail || "");
          //   if (res.errorDetail.indexOf("机会已用过") !== -1) {
          //     history.back(-1);
          //   }
          console.log(res);
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  //   建立大厦
  function build() {
    return $.ajax({
      type: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      url: "http://39.108.138.206:9100/api/memory-building",
      data: JSON.stringify({
        userId: userInfo.id,
        avatar: userInfo.avatar,
        nickName: userInfo.nickName,
        mobile: mobile,
        parentId:null
      }),
      success: function(res) {
        if (res.success) {
          console.log("建立大厦成功");
          //   如果是一起出差建立大厦获取vip商务会员和优惠劵
          if (type==='trip') {
            getCoupon();
            getVip();
          } else { //
            // 如果是普通建立大厦获取vip商务会员和优惠劵
            getCoupon()
            // location.href = "./shareBuilding.html";
          }
        } else {
          console.log(res)
          alert("建立失败;错误码e003 请重试");
        }
      },
      error: function(err) {
        console.log(err)
        alert("建立失败;错误码e004 请重试");
      }
    });
  }
});
