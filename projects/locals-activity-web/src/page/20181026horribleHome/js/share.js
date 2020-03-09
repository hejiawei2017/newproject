import "../css/index.less";
import "../css/reset.less";
require("@js/flexible.min.js");
import "babel-polyfill";
import Config from "@js/config.js";
import { showBody, getParam, getCode } from "../../../js/util";

$(function() {
  let api = Config.api;
  let hasFollow = false;
  let userInfo =
    sessionStorage.getItem("userInfo") || localStorage.getItem("userInfo");
  let canvas = $("#post")[0];
  let ctx = canvas.getContext("2d");
  let scaleBy = DPR();
  let time_end = new Date("2018/10/31 12:00:00"); //结束的时间
  let now = new Date();
  now = now.getTime();
  time_end = time_end.getTime();

  if(now>time_end){
    $('.end-mask').css('display','flex')
  }

  showBody();

  //   授权
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
            // userInfo = sessionStorage.getItem("userInfo");
            userInfo = res.data;
            // avatar = userInfo.avatar;
            // nickName = userInfo.nickName;
            // drawImg(ctx)
            weShare();
            //  确认当前用户是否关注公众号
            // checkFollow(userInfo.appOpenId).then(res => {
            //   if (res && !openId) {
            //     hasFollow = true;
            //     $(".share").css("display", "none");
            //     $(".invited").css("display", "block");
            //   }
            // });
          }
        });
      }
    }
    getUserInfo();
  } else {
    userInfo = JSON.parse(userInfo);
    // avatar = userInfo.avatar;
    // nickName = userInfo.nickName;
    
    weShare();
  }
  setTimeout(() => {
    drawImg(ctx);
    // let imgUrl=canvas.toDataURL('image/png')
    // // console.log(imgUrl)
    // $('#real-post').attr('src',imgUrl)
  }, 500);

  // 点击生成图片
  $("#poster").click(function() {
    $(".post-wrap").css("display", "flex");
  });

//   隐藏海报
  $(".post-wrap").click(function() {
    $(".post-wrap").css("display", "none");
  });

  // 显示隐藏规则
  $(".rule").click(function() {
    $(".rule-mask").css("display", "flex");
  });
  $(".rule-mask").click(function() {
    $(".rule-mask").css("display", "none");
  });

  // 显示分享遮罩
  $("#share").click(() => {
    $(".mask").css("display", "flex");
    $(window).scrollTop(0);
  });
  $(".mask").click(() => {
    $(".mask").css("display", "none");
  });

  // 生成分享图片
  function drawImg(ctx) {
    console.log("开始画图了");
    let openId = userInfo.appOpenId;
    let userid = userInfo.id;
    // let openId='ouBNov_UWWlwCxVKh1D5QK7mgqOE'
    // let userid='1018775612457541633'
    let bgImg = document.getElementById("bg-img");
    // let avatar=document.getElementById('avatar')
    let nickName = userInfo.nickName;
    let avatar = userInfo.avatar;

    //获取canva的宽高
    const dom = document.querySelector("#real-post");
    const box = window.getComputedStyle(dom);
    const width = parseInt(box.width);
    const height = parseInt(box.height);
    // 设置canvas的宽高为原来的DPR倍
    canvas.width = width * scaleBy;
    canvas.height = height * scaleBy;

    console.log(box.width,height)
    // 设定canva的css宽高为原来宽高
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    // 将所有绘制内容放大像素比倍
    const s=parseFloat(width/350)
    ctx.scale(scaleBy*s, scaleBy*s);

    // 设置img的宽高
    $('#real-post').css('width',width)
    $('#real-post').css('height',height)

    // 清除画布
    ctx.clearRect(0, 0, 350, 580);

    // 画背景
    ctx.drawImage(bgImg, 0, 0, 350, 580);

    // 画头像
    let avatarImg = new Image();
    avatarImg.crossOrigin = "anonymous";
    avatarImg.src = avatar + "?" + +new Date();
    // let avatarImg=document.getElementById("avatar");
    // $('#avatar').attr('src',avatar)
    // console.log(1111,avatar)
    avatarImg.onload = function() {
      circleImg(ctx, avatarImg, 20, 460, 25);
      let imgUrl = canvas.toDataURL("image/png");
      // console.log(imgUrl)
      $("#real-post").attr("src", imgUrl);
    };

    // 画姓名
    ctx.fillStyle = "#c2e6e2"; // 文本颜色
    ctx.textAlign = "center"; // 文本对齐方式
    ctx.font = "16px Airal"; // 文本字号、字体著作权归作者所有。
    ctx.fillText(nickName, 120, 510);

    // 画二维码
    drawCode(ctx, userid, openId);
  }
  // 画头像方法
  function circleImg(ctx, img, x, y, r) {
    ctx.save();
    var d = 2 * r;
    var cx = x + r;
    var cy = y + r;
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, x, y, d, d);
    ctx.restore();
  }

  // 画二维码方法
  function drawCode(ctx, userid, openId) {
    let qrCode = new Image();
    qrCode.crossOrigin = "anonymous";
    getQrCode(userid, openId)
      .then(res => {
        // 处理二维码地址
        res = res.replace(
          /https:\/\/mp\.weixin\.qq\.com/gi,
          "http://uat.localhome.cn"
        );
        qrCode.src = res;
        qrCode.onload = function() {
          ctx.drawImage(qrCode, 240, 450, 100, 100);
          let imgUrl = canvas.toDataURL("image/png");
          // console.log(imgUrl)
          $("#real-post").attr("src", imgUrl);
        };
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
          }
        }
      });
    });
  }
  // 获取设备DPR
  function DPR() {
    if (window.devicePixelRatio && window.devicePixelRatio > 1) {
      return window.devicePixelRatio;
    }
    return 1;
  }

  // 查询是否关注公众号
  //   function checkFollow(openId) {
  //     return new Promise((resolve, reject) => {
  //       $.ajax({
  //         type: "GET",
  //         dataType: "json",
  //         url: `http://wxpt.localhome.cn/api/ManageMain/GetQrCodeLogList?openId=${openId}`,
  //         success: function(res) {
  //           let followed = false;
  //           if (res) {
  //             for (let i = 0; i < res.length; i++) {
  //               if (res[i].OpenId == openId && res[i].MemberId > 0) {
  //                 followed = true;
  //               }
  //             }
  //             console.log("fpllowed", followed);
  //             resolve(followed);
  //           }
  //         }
  //       });
  //     });
  //   }

  //   微信分享方法
  function weShare() {
    var appId,
      timestamp,
      nonceStr,
      signature = "";

    let openId = userInfo.appOpenId;
    let userid = userInfo.id;
    // console.log(invitationCode, 2222);
    var shareUrl =
      "http://f.localhome.cn/20181026horribleHome/index.html" +
      `?userid=${userid}&openId=${openId}`;
    // shareUrl = encodeURI(shareUrl);

    var shareImg =
      "http://120.76.204.105/upload/181029/FZOWQ181029150209796.jpeg";

    var desc = "为我注入勇气值吧，一起完成鬼屋过夜挑战！";

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
