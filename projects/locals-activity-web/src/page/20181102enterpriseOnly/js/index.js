import "../css/index.less";
import "../css/reset.less";
require("@js/flexible.min.js");
import "babel-polyfill";
import Config from "@js/config.js";
import {
  telRegExp,
  getParam,
  getAuthCode,
  bindMobile,
  getCode
} from "../../../js/util";
import { get } from "http";
import { Promise } from "core-js";
var fundebug = require("fundebug-javascript");
fundebug.apikey =
  "2ade2502ceb079f6d6de9a285e24218a4d3e015d128257094071c497302dcc46";

$(function() {
  let api = Config.api;
  let mobile = null;
  let sid = getParam("sid") || "";
  let traceId = sid;
  let traceInfo = "";
  let actCode = 9;
  let actArr = [8159, 8298, 7209, 4915];
  let userInfo =
    sessionStorage.getItem("userInfo") ||
    localStorage.getItem("userInfo") ||
    null;
  let nickName = "";
  // let token = sessionStorage.getItem("token");
  // let hasBindPhone = false;

  // 判断是否授权
  if (true) {
    getUserInfo(api);
    // console.log(4444,getUserInfo());
  } else {
    userInfo = JSON.parse(userInfo);
    nickName = userInfo.nickName;
    mobile = userInfo.mobile;
    weShare(nickName);
  }

  // 获取企业信息
  if (sid) {
    getCompany(sid)
      .then(res => {
        traceInfo = res;
        $("#company").text(res);
      })
      .catch(err => {
        console.log(err);
      });
  }

  $(document).ready(function() {
    var mySwiper = new Swiper(".swiper-container", {
      direction: "horizontal", // 垂直切换选项
      loop: true, // 循环模式选项
      autoplay: true, //自动播放
      freeMode: false,
      // 如果需要分页器
      pagination: {
        el: ".swiper-pagination",
        dynamicBullets: false,
        dynamicMainBullets: 2
      }
    });

    $(".main").css("display", "flex");
  });

  // 画面延迟显示
  // setTimeout(() => {
  //   $(".main").css("display", "flex");
  // }, 500);

  // 确定活动代码
  // actArr.forEach((v, i) => {
  //   if (v == sid) {
  //     actCode = actCode + i;
  //   }
  // });

  if (sid) {
    switch (parseInt(sid)) {
      case 8159:
        actCode = 9;
        break;
      case 8298:
        actCode = 10;
        break;
      case 7209:
        actCode = 11;
        break;
      case 4915:
        actCode = 12;
        break;
      default:
        actCode = parseInt(sid);
    }
  }
  console.log("活动代码", actCode);

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
    getAuthCode(api, mobile).then(res => {
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
    });
  });

  // 绑定手机号码登录
  $("#verify").on("click", function(e) {
    let authCode = $("#authNum").val();
    if (!authCode || !mobile) {
      alert("请输入收到的验证码");
      return;
    }
    $(".loading-mask").css("display", "flex");
    bindMobile(api, mobile, authCode, traceId, traceInfo)
      .then(res => {
        if (res.id) {
         sessionStorage.setItem("userInfo", JSON.stringify(res));
          userInfo = res;
        }
        check(actCode, mobile)
          .then(res => {})
          .catch(err => {
            console.log(err);
          });

        Promise.all([upToVip(), memberCardUp("GOLD")])
          .then(res => {
            // console.log(res);
            console.log("升级成功");
            setTimeout(() => {
              location.href = "./success.html";
            }, 500);
          })
          .catch(err => {
            // console.log(res);
            alert(err);
            $(".loading-mask").css("display", "none");
          });
      })
      .catch(err => {
        alert(err);
        $(".loading-mask").css("display", "none");
      });
  });

  // 查询记录是否领过金卡
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
        timeout: 4000,
        success: function(res) {
          resolve(res.success);
        }
      });
    });
  }

  //   升级银卡会员
  function memberCardUp(card) {
    let id = userInfo.id;
    let memberCardCode = card;
    let validTimeStart = new Date().getTime();
    let now = new Date();
    let end = now.setFullYear(now.getFullYear() + 1);
    let validTimeEnd = now.getTime();

    let params = {
      userId: id,
      memberCardCode: memberCardCode,
      validTimeStart: validTimeStart,
      validTimeEnd: validTimeEnd
    };
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "PUT",
        url: api + "/platform/member",
        data: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        timeout: 4000,
        success: function(res) {
          if (res.success) {
            // console.log("升级会员卡成功");
            resolve(res.success);
          }
        },
        error: function(err) {
          console.log(err);
        }
      });
    });
  }

  function getCompany(sid) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url: `http://ms.localhome.cn/api/platform/promotion/channel/${sid}`,
        success: function(res) {
          if (res.success) {
            resolve(res.data);
          } else {
            // console.log(res);
            reject(res);
          }
        }
      });
    });
  }
  // 升级商务会员
  function upToVip() {
    let params = {
      userId: userInfo.id,
      changeMode: 2,
      vipType: 1,
      source: "企业专属认证"
    };
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "POST",
        url: api + "/platform/cash-vip",
        data: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        success: function(res) {
          if (res.success) {
            console.log("商务会员升级成功");
            resolve(res.data);
          } else {
            console.log(res);
            resolve(res);
          }
        }
      });
    });
  }

  // 微信授权获取userInfo
  async function getUserInfo(api) {
    // 等待获取token
    await getCode(api);
    if (sessionStorage.getItem("token")) {
      return new Promise((resolve, reject) => {
        $.ajax({
          type: "GET",
          headers: {
            "LOCALS-ACCESS-TOKEN": "Bearer " + sessionStorage.getItem("token")
          },
          url: api + "/platform/user/user-info",
          success: function(res) {
            resolve(res.data);
            // sessionStorage.setItem("userInfo", JSON.stringify(res.data));
            // localStorage.setItem("userInfo", JSON.stringify(res.data));
            nickName = res.data.nickName || "";
            userInfo = res.data;
            weShare(nickName);
          },
          timeout: 5000,
          complete: function(xhr, status) {
            if (status == "timeout") {
              //超时,status还有success,error等值的情况
              // 　　　　　 ajaxTimeoutTest.abort();
              reject("网络超时003,请重新尝试");
            }
          }
        });
      });
    }
  }

  //   微信分享方法
  function weShare(nickName) {
    var appId,
      timestamp,
      nonceStr,
      signature = "";

    nickName = nickName || "";
    // console.log(invitationCode, 2222);
    var shareUrl =
      "http://f.localhome.cn/20181102enterpriseOnly/index.html?sid=" + sid;
    shareUrl = encodeURI(shareUrl);

    var shareImg =
      "http://120.76.204.105/upload/181102/BZBKN181102104855425.jpeg";

    var desc = "附赠商务会员六大服务特权，出差你能住得更好";

    var title = `${nickName}邀请你免费申请路客企业会员，出差预订专享9.2折优惠！`;

    var url = encodeURIComponent(location.href.split("#")[0].toString());

    weChatShare();

    async function weChatShare() {
      // 获取参数
      await getParams();
      // 微信分享方法
      share();
    }
    function getParams() {
      return new Promise((resolve, reject) => {
        $.ajax({
          type: "POST",
          url: "https://ms.localhome.cn/api/wechat/five-plus/config?url=" + url,
          contentType: "application/json",
          success: function(res) {
            appId = res.data.appId;
            timestamp = res.data.timestamp;
            nonceStr = res.data.nonceStr;
            signature = res.data.signature;
            resolve(true);
          },
          fail: function() {
            showMsg("服务器连接error", "bottom");
            reject(false);
          }
        });
      });
    }
    function share() {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appId, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: signature, // 必填，签名
        jsApiList: [
          "checkJsApi",
          "hideMenuItems",
          "showMenuItems",
          "hideAllNonBaseMenuItem",
          "showAllNonBaseMenuItem",
          "hideOptionMenu",
          "showOptionMenu",
          "closeWindow",
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
          "previewImage",
          "chooseImage",
          "uploadImage",
          "downloadImage"
        ] // 必填，需要使用的JS接口列表
      });
      wx.ready(function() {
        wx.onMenuShareTimeline({
          title: title,
          link: shareUrl,
          imgUrl: shareImg,
          success: function() {}
        });
        wx.onMenuShareAppMessage({
          title: title,
          desc: desc,
          link: shareUrl,
          imgUrl: shareImg, // 分享图标
          type: "",
          dataUrl: "",
          success: function() {}
        });
      });
    }
  }
});
