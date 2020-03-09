import "../css/index.less";
import "../css/reset.less";
require("@js/flexible.min.js");
import "babel-polyfill";
import Config from "@js/config.js";
import { showBody, getParam, getCode } from "../../../js/util";
import { get } from "https";

$(function() {
  let api = Config.api;
  let userid = getParam("userid");
  let openId = getParam("openId");
  let time_end = new Date("2018/10/31 12:00:00"); //结束的时间
  let now = new Date();
  now = now.getTime();
  time_end = time_end.getTime();

  if(now>time_end){
    $('.end-mask').css('display','flex')
  }

  showBody();

  // 显示隐藏规则
  $(".rule").click(function() {
    $(".rule-mask").css("display", "flex");
  });
  $(".rule-mask").click(function() {
    $(".rule-mask").css("display", "none");
  });

  //  如果有openId和userid传入是别人分享的，设置别人的二维码
  if (userid && openId) {
    getQrCode(userid, openId)
      .then(res => {
        console.log("二维码", res);
        $("#code-img").attr("src", res);
        $(".invited").css("display", "none");
        $(".share").css("display", "block");
      })
      .catch(err => {
        console.log(err);
      });
  }

  //  获取二维码
  function getQrCode(userid, openId) {
    let sceneId = parseInt(userid.substring(userid.length - 6));
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `http://wxpt.localhome.cn/api/ManageMain/GetDynamicQrcode?sceneId=${sceneId}&openId=${openId}`,
        success: function(res) {
          if (res.IsSuccess) {
            resolve(res.Result);
          } else {
            reject(res);
          }
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
      "http://120.76.204.105/upload/181029/FZOWQ181029150209796.jpeg";

    var desc = "你敢来睡吗";

    var title = `【万圣节】我想邀你挑战贞子民宿，瓜分10000元奖金！`;

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
