import "../css/reset.less";
import "../css/approve.less";
require("@js/flexible.min.js");
import "babel-polyfill";
import {
  nameRegExp,
  telRegExp,
  emailRegExp,
  SocialCreditCodeRegExp,
  companyRegExp,
  authCodeRegExp,
  showBody,
  getParam,
  getCode,
  getMiniprogramEnv
} from "../../../js/util";
import Config from "@js/config.js";

$(function() {
  let api = Config.api;
  // 获取changeMode参数
  let changeMode = getParam("changeMode");
  // let api="http://ms.localhome.cn/api";
  let hasBindMobile = false;
  let userInfo =
    sessionStorage.getItem("userInfo") || localStorage.getItem("userInfo");
  let channel = getParam("channel");
  let source = "";
  let inMiniProgram = false;

  showBody();

  console.log("小程序环境初始值", inMiniProgram);

  // 判断渠道来源
  switch (channel) {
    case "swcx.zihf":
      source = "自动回复";
      break;
    case "swcx.baner":
      source = "banner";
      break;
    case "swcx.menu":
      source = "菜单栏";
      break;
    case "swcx.gerzh":
      source = "个人账户";
      break;
    case "swcx.kfxx":
      source = "客服消息";
      break;
    default:
      source = "其他";
      break;
  }
  // 如果是大礼包跳转过来就变跟样式
  if (changeMode == 5) {
    $(".title").text("请购买大礼包后再填写");
    $(".dalibao-hide").css("display", "none");
  }

  // 如已经获取到userInfo
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
    if (telRegExp.test(userInfo.mobile)) {
      $("#phone").val(userInfo.mobile);
      $("#phone").attr("readonly", "readonly"); //手机号码不可修改
      $(".code-line").css("display", "none");
      hasBindMobile = true;
    }
  } else {
    // 如果是直接微信打开获取授权和token
    getUserInfo();
  }

  //获取验证码
  $("#send-code").click(function() {
    let mobile = $("#phone").val();
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

  //   点击提交
  $(".submit").click(function() {
    let statu = true;
    let name = $("#name").val();
    let mobile = $("#phone").val();
    let code = $("#code").val();
    let companyEmail = $("#email").val();
    let companyName = $("#company").val();
    let companyTaxpayerId = $("#tax-code").val();

    if (!nameRegExp.test(name)) {
      statu = false;
      alert("请输入正确的姓名");
      return;
    }
    if (!telRegExp.test(mobile)) {
      statu = false;
      alert("请输入正确的手机号");
      return;
    }
    if (!hasBindMobile) {
      if (!authCodeRegExp.test(code)) {
        statu = false;
        alert("请输入正确的验证码");
        return;
      }
    }

    // if (companyEmail && !testCompanyEmail(companyEmail)) {
    //   statu = false;
    //   alert("请输入正确的企业邮箱");
    //   return;
    // }
    // if (companyName && !companyRegExp.test(companyName)) {
    //   statu = false;
    //   alert("请输入正确的公司名称");
    //   return;
    // }
    // if (companyTaxpayerId && !SocialCreditCodeRegExp.test(companyTaxpayerId)) {
    //   statu = false;
    //   alert("请输入正确的税号");
    //   return;
    // }
    // 打开loading
    $(".dialog-mast").css("display", "flex");
    // 如果验证没有问题
    if (statu) {
      // 有token且之前已经绑定手机号码
      if (userInfo && hasBindMobile) {
        getBusinessTrip();
      }
      // 如果有token但没有绑定手机请求新的token再获取新的userInfo
      else if (userInfo) {
        $.ajax({
          type: "PUT",
          headers: {
            "LOCALS-ACCESS-TOKEN": "Bearer " + sessionStorage.getItem("token"),
            "Content-Type": "application/json; charset=UTF-8"
          },
          data: JSON.stringify({ mobile: mobile, code: code }),
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
                  getBusinessTrip();
                }
              });
            } else {
              $(".dialog-mast").css("display", "none");
              alert(res.errorMsg || "登录失败，请重试");
            }
          }
        });
      }
      // 如果没有token在浏览器打开
      else {
        //   console.log('如果没有token在浏览器打开')
        let data = {
          mobile: mobile,
          authCode: code,
          authType: 1,
          appId: "4",
          platform: "ACT"
        };
        $.ajax({
          type: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          },
          url: api + "/platform/auth/auth-code/sign-in",
          data: JSON.stringify(data),
          success: res => {
            if (res.success) {
              // console.log('获取到token')
              sessionStorage.token = res.data;
              localStorage.token = res.data;
              $.ajax({
                type: "GET",
                headers: {
                  "LOCALS-ACCESS-TOKEN":
                    "Bearer " + sessionStorage.getItem("token")
                },
                url: api + "/platform/user/user-info",
                success: function(res) {
                  sessionStorage.setItem("userInfo", JSON.stringify(res.data));
                  getBusinessTrip();
                }
              });
            } else {
              $(".dialog-mast").css("display", "none");
              sessionStorage.removeItem("token");
              sessionStorage.removeItem("userInfo");
              localStorage.removeItem("token");
              localStorage.removeItem("userInfo");
              alert(res.errorMsg || "登录失败，请重试");
            }
          }
        });
      }
    }
  });

  async function getUserInfo() {
    // 不是在小程序打开
    // 获取小程序环境
    inMiniProgram = await getMiniprogramEnv();
    console.log('小程序环境',inMiniProgram)
    if (!inMiniProgram) {
      await getCode(api);
    }

    if (sessionStorage.getItem("token")) {
      $.ajax({
        type: "GET",
        headers: {
          "LOCALS-ACCESS-TOKEN": "Bearer " + sessionStorage.getItem("token")
        },
        url: api + "/platform/user/user-info",
        success: function(res) {
          sessionStorage.setItem("userInfo", JSON.stringify(res.data));
          userInfo = sessionStorage.getItem("userInfo");
          localStorage.getItem("userInfo");
          userInfo = JSON.parse(userInfo);
          if (telRegExp.test(res.data.mobile)) {
            $("#phone").val(userInfo.mobile);
            $("#phone").attr("readonly", "readonly"); //手机号码不可修改
            $(".code-line").css("display", "none");
            hasBindMobile = true;
          }
        }
      });
    }
  }

  //验证商务旅客
  function getBusinessTrip() {
    let companyEmail = $("#email").val();
    let companyName = $("#company").val();
    let companyTaxpayerId = $("#tax-code").val();
    let params = {
      userId: JSON.parse(sessionStorage.getItem("userInfo")).id,
      changeMode: 2,
      vipType: 1,
      companyEmail: companyEmail || "",
      companyTaxpayerId: companyTaxpayerId || "",
      companyName: companyName || "",
      companyCity: "",
      source: source
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
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("userInfo");
          if (changeMode == 5) {
            alert(
              "激活成功，请前往Locals路客精品民宿公众号菜单 我的 查看优惠券"
            );
            location.href = "https://h5.youzan.com/v2/goods/1y8ykr765lvg0";
          } else {
            location.href = "./success.html";
          }
        } else {
          alert(res.errorDetail || "");
          $(".dialog-mast").css("display", "none");
          if (res.errorDetail.indexOf("机会已用过") !== -1) {
            history.back(-1);
          }
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  // 验证企业邮箱
  function testCompanyEmail(email) {
    if (!emailRegExp.test(email)) {
      return false;
    }
    let emailArr = [
      "@126.com",
      "@163.net",
      "@188.com",
      "@yeah.net",
      "@gmail.com",
      "@googlemail.com",
      "@hotmail.com",
      "@yahoo.com",
      "@yahoo.com.cn",
      "@sina.com",
      "@sohu.com",
      "@tom.com",
      "@21cn.com",
      "@qq.com",
      "@263.net",
      "@189.cn",
      "@139.com",
      "@eyou.com",
      "@sogou.com"
    ];
    for (let i = 0; i < emailArr.length; i++) {
      if (email.indexOf(emailArr[i]) !== -1) {
        return false;
      }
    }
    return true;
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
