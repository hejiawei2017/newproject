import "../css/index.less";
import "../css/reset.less";
require("@js/flexible.min.js");
import "babel-polyfill";
import Config from "@js/config.js";
import {
  showBody,
  telRegExp,
  getAuthCode,
  codeSignIn,
  getParam
} from "../../../js/util";

$(function() {
  showBody();
  let api = Config.api;
  let mobile = null;
  let userInfo = null;
  let actId = getParam("sid") || 20;

  // $("#fade").click(function() {
  //   $(".ads").fadeOut(1000, function() {
  //     $(".main").fadeIn(300);
  //   });
  // });
  // $(".main").slideDown(5000)

  // 动画滚出优惠劵
  $(document).ready(function() {
    setTimeout(() => {
      $("#coupon-img").animate({ top: "0" }, 1500);
    }, 500);
  });

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

  // 验证验证码
  $("#verify").on("click", function(e) {
    let authCode = $("#authNum").val();
    let traceId = 3201;
    let traceInfo = "朋友圈广告";
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
    codeSignIn(api, mobile, authCode, traceId, traceInfo)
      .then(res => {
        userInfo = res;

        // 送300元劵 // 送金卡会员
        check(actId, mobile)
          .then(res => {
            memberCardUp("GOLD");
          })
          .then(res => {
            getCoupon("HJKIHNGV");
          })
          .then(res => {
            setTimeout(() => {
              location.href = "./success.html";
            }, 1000);
          })
          .catch(res => {
            console.log(err);
          });
      })
      .catch(err => {
        alert(err);
      });
  });

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

  function getCoupon(couponCode) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        url: api + "/coupon/record/receive-coupon",
        data: JSON.stringify({
          mobile: mobile,
          code: couponCode,
          platform: "WEB"
        }),
        success: function(res) {
          if (res.success) {
            console.log("领取优惠劵成功");
            resolve(true);
          } else {
            console.log("优惠劵获取失败;错误码e004 请重试");
            resolve(false);
          }
        },
        error: function(err) {
          console.log("优惠劵获取;错误码e005 请重试");
          reject(err);
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
    // console.log(444, userInfo, params);
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "PUT",
        url: api + "/platform/member",
        data: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        success: function(res) {
          if (res.success) {
            console.log("升级会员卡成功");
            resolve(res.success);
          }
        },
        error: function(err) {
          console.log(err);
        }
      });
    });
  }

  weShare();
  //   微信分享方法
  function weShare() {
    var appId,
      timestamp,
      nonceStr,
      signature = "";

    // console.log(invitationCode, 2222);
    var shareUrl = window.location.href;
    // shareUrl = encodeURI(shareUrl);

    var shareImg =
      "https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/20181117friendPromotion/share.jpg";

    var desc = "马上开抽，商旅网红店，住到不想走";

    var title = `新店回馈—免费睡`;

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
