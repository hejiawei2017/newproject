require("@js/flexible.min.js");
require("../css/index.less");
import Config from "@js/config.js";
import "babel-polyfill";
import {
  getCode,
  showBody,
  getParam,
  getMiniprogramEnv,
  isMiniProgram
} from "../../../js/util";
// const img = require("../images/button3.png");
let channel = getParam("ADTAG") || "swcx";

var business = {
  swiper: function() {
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
        aCircle[i].className = "";
      }
      aCircle[index].className = "active";
      ImgWidth = parseInt(oImg.offsetWidth / aCircle.length);
      target = -ImgWidth * index;
      var timer = setInterval(function() {
        speed =
          speed > 0
            ? Math.ceil((target - oImg.offsetLeft) / 6)
            : Math.floor((target - oImg.offsetLeft) / 6);
        if (target == oImg.offsetLeft) {
          clearInterval(timer);
        } else {
          oImg.style.left = oImg.offsetLeft + speed + "px";
        }
      }, 30);
    }
    oImg.ontouchstart = function(event) {
      touch = event.targetTouches[0]; //取得第一个touch的坐标值
      startPos = {
        x: touch.pageX,
        y: touch.pageY
      };
      scrollDirection = 0;
    };
    oImg.ontouchmove = function(event) {
      // 如果有多个地方滑动，我们就不发生这个事件
      if (event.targetTouches.length > 1) {
        return;
      }
      touch = event.targetTouches[0];
      endPos = {
        x: touch.pageX,
        y: touch.pageY
      };
      // 判断出滑动方向，向右为1，向左为-1
      scrollDirection = touch.pageX - startPos.x > 0 ? 1 : -1;
    };
    oImg.ontouchend = function() {
      if (scrollDirection == 1) {
        if (index >= 1 && index <= aCircle.length - 1) {
          index--;
          slide(index);
        } else {
          return;
        }
      } else if (scrollDirection == -1) {
        if (index >= 0 && index <= aCircle.length - 2) {
          index++;
          slide(index);
        } else {
          return;
        }
      }
    };
    for (var i = 0; i < aCircle.length; i++) {
      aCircle[i].index = i;
      aCircle[i].onclick = function() {
        slide(this.index);
      };
    }
  },
  hideEnter: function(){
    $("#youzan-9").remove();
    $("#youzan-29").remove();
    $("#youzan-699").remove();
  },
  getState: function(userId) {
    let api = Config.api;
    $.ajax({
      type: "GET",
      url: api + `/platform/cash-vip/user-id?userId=${userId}`,
      success: function(res) {
        // console.log(res)
        if (res.success) {
          if (res.data === null) {
            //不是会员要认证
            $(".icon").css("color", "#8894c7");
            $(".left-ctx")
              .html("商务会员未认证")
              .css("color", "#8894c7");
            $(".person-state-content").css("justify-content", "center");
            // 邀请跳转验证
            $("#invited").click(e => {
              e.preventDefault;
              alert("你还没有认证为商旅会员哦！");
              location.href = "./approve.html?channel=" + channel;
            });
            $("#approve").click(e => {
              e.preventDefault;
              location.href = "./approve.html?channel=" + channel;
            });
          } else if (res.data.isVip === 1) {
            //认证会员
            $(".icon").css("color", "#ffdfa2");
            $(".left-ctx")
              .html("商务会员")
              .css("color", "#ffdfa2");
            // $('.right-1').html(`剩余${(res.data.validEndTime - new Date().getTime())/(3600000* 24)}天`).css('color', '#ffdfa2');
            // $('.renzheng-yaoqing a').eq(0).css('background-image',`url(${img})`)//验证成功按钮
            // $('.renzheng-yaoqing a').eq(0).attr('href','javascript:void(0)')//禁止跳转
            var days = Math.floor(
              (res.data.validTimeEnd - new Date().getTime()) / (3600000 * 24)
            );
            $(".right-1")
              .html(`剩余${days}天`)
              .css("color", "#ffdfa2");
            $("#invited").click(e => {
              e.preventDefault;
              location.href = "./invited.html";
            });
            $("#approve").click(e => {
              e.preventDefault;
              alert("你已经是会员了哦，去邀请好友获取更多权益吧!");
            });
            $(".yangzheng").css("display", "flex");
          } else if (res.data.isVip === 0) {
            //会员过期
            $(".icon").css("color", "#8894c7");
            $(".left-ctx")
              .html("会员已过期")
              .css("color", "#8894c7");
            $(".person-state-content").css("justify-content", "center");
            $("#invited").click(e => {
              e.preventDefault;
              location.href = "./invited.html";
            });
            $("#approve").click(e => {
              e.preventDefault;
              alert("你已经是会员了哦，去邀请好友获取更多权益吧!");
            });
            $(".yangzheng").css("display", "flex");
          }
        } else {
          $(".person-state-content").html("");
        }
        // 添加点击事件
      },
      err: function(err) {
        console.log(err);
        $("#invited").click(e => {
          e.preventDefault;
          alert("你还没有认证为商旅会员哦！");
          location.href = "./approve.html?channel=" + channel;
        });
        $("#approve").click(e => {
          e.preventDefault;
          location.href = "./approve.html?channel=" + channel;
        });
      }
    });
  }
};

$(async function() {
  
  
  // business.swiper();
  // 获取参数
  let api = Config.api;
  let nickName = "我";
  let invited = getParam("invited");
  const hideEnter = getParam("hide_enter");
  const ishideEnter = hideEnter === '1';
  let canMove = true;
  let inMiniProgram = false;
  inMiniProgram = await getMiniprogramEnv();

  (inMiniProgram) || ishideEnter ? business.hideEnter() : null;
  showBody();

  console.log("小程序环境初始值", inMiniProgram);

  getUserInfo();

  //   链接跳转
  $("#youzan-9").click(function() {
    if (inMiniProgram) {
      const input = $("<input>");
      input.attr("readonly", "readonly");
      input.attr("value", "https://h5.youzan.com/v2/goods/2fxsjsrlg4t00");
      $("body").append(input);
      input.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        console.log("复制成功");
      }
      input.remove();
      alert("由于小程序功能限制，已将链接复制，请用浏览器打开");
    } else {
      location.href = "https://h5.youzan.com/v2/goods/2fxsjsrlg4t00";
    }
  });
  $("#youzan-29").click(function() {
    if (inMiniProgram) {
      const input = $("<input>");
      input.attr("readonly", "readonly");
      input.attr("value", "https://h5.youzan.com/v2/goods/1y2tjhnwo9334");
      $("body").append(input);
      input.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        console.log("复制成功");
      }
      input.remove();
      alert("由于小程序功能限制，已将链接复制，请用浏览器打开");
    } else {
      location.href = "https://h5.youzan.com/v2/goods/1y2tjhnwo9334";
    }
  });
  $("#youzan-699").click(function() {
    if (inMiniProgram) {
      const input = $("<input>");
      input.attr("readonly", "readonly");
      input.attr("value", "https://h5.youzan.com/v2/goods/1y8ykr765lvg0");
      $("body").append(input);
      input.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        console.log("复制成功");
      }
      input.remove();
      alert("由于小程序功能限制，已将链接复制，请用浏览器打开");
    } else {
      location.href = "https://h5.youzan.com/v2/goods/1y8ykr765lvg0";
    }
  });
  // if(invited){
  //     $('#invited').css('display','block')
  //     $('.renzheng-yaoqing').css('justify-content','space-between')
  // }
  // 显示文案
  $("#desc").click(() => {
    $(".desc-wrap").css("display", "flex");
    canMove = false;
  });
  $(".desc-wrap").click(() => {
    $(".desc-wrap").css("display", "none");
    canMove = true;
  });
  document.addEventListener(
    "touchmove",
    function(e) {
      if (!canMove) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  async function getUserInfo() {
    // 判断是否在小程序环境
    inMiniProgram = await getMiniprogramEnv();
  
    console.log('小程序环境',inMiniProgram)
    // 等待获取token
    let token = getParam("token");
    if (!!token) {
      sessionStorage.setItem("token", token);
    } else if (!token && inMiniProgram) {
      console.log("微信小程序打开且没有传token");
    } else {
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
          // console.log(333)
          sessionStorage.setItem("userInfo", JSON.stringify(res.data));
          localStorage.setItem("userInfo", JSON.stringify(res.data));
          nickName = res.data.nickName || "我";
          business.getState(res.data.id);
        }
      });
    } else {
      $("#invited").click(e => {
        e.preventDefault;
        alert("你还没有认证为商旅会员哦！");
        location.href = "./approve.html?channel=" + channel;
      });
      $("#approve").click(e => {
        e.preventDefault;
        location.href = "./approve.html?channel=" + channel;
      });
    }
  }


  // 微信分享代码
  var appId,
    timestamp,
    nonceStr,
    signature = "";

  var shareUrl = window.location.href;

  var shareImg =
    "http://120.76.204.105/upload/180829/AEZ8H180829150531506.jpeg";

  var desc = "权益更多，服务更好，2.5折福利限时抢购中";

  var url = encodeURIComponent(location.href.split("#")[0].toString());

  async function weChatShare() {
    // 获取参数
    await getParams();
    // 微信分享方法
    share();
  }
  weChatShare();

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
    var title = `${nickName}已经领了【路客商务旅客】就差你没领了`;
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
});
