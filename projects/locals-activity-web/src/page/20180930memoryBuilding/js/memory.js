import "../css/memory.less";
import "../css/reset.less";
require("@js/flexible.min.js");
import "babel-polyfill";
import Config from "@js/config.js";
import { showBody, getParam, getCode } from "../../../js/util";

$(function() {
  showBody();
  weShare();//微信分享
  let type = "trip";
  let userInfo =
    sessionStorage.getItem("userInfo") || localStorage.getItem("userInfo");
  let api = Config.api;
  let parentId = getParam("parentId");
  // 获取用户信息
  if (!userInfo) {
    // 如果是直接微信打开获取授权和token
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
            if(parentId.replace(/\"/g,"") === userInfo.id){
              location.href = './shareBuilding.html'
            }else {
              isRuzhu()
            }
          }
        });
      }
    }
    getUserInfo();
  } else {
    userInfo = JSON.parse(userInfo);
    if(parentId.replace(/\"/g,"") === userInfo.id){
      location.href = './shareBuilding.html'
    }else{
      isRuzhu()
    }
  }
  $("#memory-list").on("click", "li", function(e) {
    $("#memory-list li").removeClass("active");
    $(this).addClass("active");
    type = $(this).attr("data-type");
    if (type === "trip") {
      $("#business-img").css("display", "block");
    } else {
      $("#business-img").css("display", "none");
    }
  });

  $("#check-in").click(function(e) {
    if (!parentId) {
      alert("这个大厦还没有主人哦，让你盆友再邀请你吧");
    }else{
      checkIn()
    }
  });


  function isRuzhu(){
      $.ajax({
      type: "get",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      url: 'http://39.108.138.206:9100/api/getCheckState?parentId='+parentId+'&userId='+userInfo.id,
      success:function(res){
          if(res.data === '已入住'){
            location.href = './shareBuilding.html?type=1&parentId='+parentId
          }
      }
    })
  }
  // 提交邀请信息
  function checkIn() {
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
        mobile: userInfo.mobile,
        parentId: parentId,
        recall:type
      }),
      success: function(res) {
        if (res.success) {
          // 建立成功跳转到我的大厦页面
          location.href = `./shareBuilding.html?type=${type}&parentId=${parentId}`;
        }
      },
      error: function(err) {
        alert("跳转失败;错误码e002 请重试");
      }
    });
  }


  // 微信分享方法
  function weShare() {
    var appId,
      timestamp,
      nonceStr,
      signature = "";
    // console.log(invitationCode, 2222);
    var shareUrl = window.location.href;
    // shareUrl = encodeURI(shareUrl);

    var shareImg =
      "http://120.76.204.105/upload/181017/YYGVK181017192646889.png";

    var desc =
      "不管是基情还是友情，都通通在这栋回忆大厦里头，快来入住领走我的福利。";

    var title = `那些年，跟我睡过的同事有你吗？`;

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
