import "../css/shareBuilding.less";
import "../css/reset.less";
require("@js/flexible.min.js");
import "babel-polyfill";
import Config from "@js/config.js";
import { showBody, getParam } from "../../../js/util";

$(function() {
  showBody();
  let type = getParam("type");
  let api = Config.api;
  let parentId = null;
  let userInfo =
    sessionStorage.getItem("userInfo") || localStorage.getItem("userInfo");
  let inviteds = [];
  let mobile = null;
  let hostId = getParam("parentId");
  let name = "";
  let hasBuild = false;
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
    mobile = userInfo.mobile;
  }
  // 如果没有用户id和邀请人id则跳转到建立大厦页面
  if (!userInfo && !hostId) {
    alert("你还没有注册路客的大厦，请先建立哦！");
    location.href = "./build.html";
  }

  // 判断用户是否建立过大厦修改按钮样式
  async function changeBtn() {
    await isBuilding()
    // console.log(type,hasBuild)
    if (type && hasBuild) {
      $("#go-build").text("查看自己的大厦");
    }
  }
  changeBtn()
  // setTimeout(()=>{changeBtn();},500)

  if (!type) {
    //自己的大厦
    $(".share").css("display", "none");
    $(".my").css("display", "flex");
    parentId = userInfo.id;
  } else {
    //别人的大厦
    parentId = hostId;
    $("#go-build").click(function() {
      if (hasBuild) {
        location.href = "./shareBuilding.html";
      } else {
        location.href = "./build.html";
      }
    });
  }

  //   微信分享方法执行
  weShare(parentId);
  // 显示分享遮罩
  $("#invite-btn").click(() => {
    $(".mask").css("display", "flex");
    $(window).scrollTop(0);
  });
  $(".mask").click(() => {
    $(".mask").css("display", "none");
  });

  //   获取邀请人渲染画面
  async function getInviteds(params) {
    await findInviteds(); //获取邀请人
    console.log("获取数据开始渲染画面");
    showGuest(); //渲染页面
  }
  getInviteds(); //执行函数

  //   渲染画面
  function showGuest() {
    let num = inviteds.length;
    let rest = 0;
    let html = "";
    let invitedNum = 0;
    // console.log(num);

    if (9 <= num && num < 21) {
      // 领银卡
      $("#build-star").attr("src", require("../image/三星.png"));
      $(".star-num").text("三");
      $(".level-one").css("display", "none");
      $(".level-two").css("display", "flex");
      check(3, mobile)
        .then(res => {
          if (res) {
            // getCoupon("KIYHFBCE");
            memberCard('SILVER')
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else if (21 <= num && num < 33) {
      // 金卡会员
      $("#build-star").attr("src", require("../image/五星.png"));
      $(".star-num").text("五");
      $(".level-one").css("display", "none");
      $(".level-three").css("display", "flex");
      check(4, mobile)
        .then(res => {
          if (res) {
            // getCoupon("HJKIHNGV");
            memberCard('GOLD');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else if (num >= 33) {
      // 黑卡
      memberCard('BLACK');
      $("#build-star").attr("src", require("../image/七星.png"));
      $(".star-num").text("七");
      $(".level-one").css("display", "none");
      $(".level-four").css("display", "flex");
    }
    // 设置窗户数量
    if (num <= 9) {
      rest = 9 - num;
    } else {
      rest = 3 - (num % 3);
    }
    // 渲染画面
    inviteds.forEach((v, i) => {
      html += `<li class="${v.recall}"><img src="${v.avatar}" alt=""></li>`;
      if (v.userId === userInfo.id) {
        invitedNum = i+1;
      }
    });
    for (let i = 0; i < rest; i++) {
      html += `<li></li>`;
    }
    $("#peoples").text(invitedNum);
    $("#guests").html(html);
    $(".name").text(name);
    $('#guests').on("click","li",function(){
      console.log($(this).attr('data-id'));
      const userId = $(this).attr('data-id')
      $.ajax({
        type: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        url: "http://39.108.138.206:9100/api/memory-building",
        data: JSON.stringify({
          userId:userId,
          avatar: 'userInfo.avatar',
          nickName: 'userInfo.nickName',
          mobile: 'userInfo.mobile',
          parentId: null,
        }),
        success:function(res){
          if(res.data==='用户已建立大厦'){
            location.href='./shareBuilding.html?type=1&parentId='+userId
          }else{
            location.href='./build.html'
          }
        }
      })
    })
  }

  // 验证当前用户是否建立大厦
  function isBuilding() {
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
        parentId: null
      }),
      success: function(res) {
        if (res.data === "用户已建立大厦") {
          hasBuild = true;
        } else {
          hasBuild = false;
        }
        console.log(hasBuild)
        return hasBuild;
      }
    });
  }

  //   获取邀请人数
  function findInviteds() {
    return $.ajax({
      type: "GET",
      url:
        "http://39.108.138.206:9100/api/memory-building?parentId=" + parentId,
      success: function(res) {
        if (res.success) {
          inviteds = res.data.invited;
          name = res.data.userInfo.nickName;
          return true;
        } else {
          console.log("获取入住人失败啦;错误码e001 请重试");
        }
      },
      error: function(err) {
        console.log("获取入住人失败啦;错误码e002 请重试");
      }
    });
  }
  //   领取300元优惠劵
  function getCoupon(couponCode) {
    return $.ajax({
      type: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      url: api + "/coupon/record/receive/",
      data: JSON.stringify({
        mobile: mobile,
        couponCode: couponCode,
        platform: "WEB"
      }),
      success: function(res) {
        if (res.success) {
          console.log("领取优惠劵成功");
          // 登录成功跳转抽奖页面
          //   location.href = "./lottery.html";
        } else {
          console.log("优惠劵获取失败;错误码e004 请重试");
        }
      },
      error: function(err) {
        console.log("优惠劵获取;错误码e005 请重试");
      }
    });
  }

  //   升级银卡会员
  function memberCard(card) {
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
        }
      },
      error: function(err) {
        console.log(err);
      }
    });
  }
  // 查询是否领过
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
          resolve(res.success);
        }
      });
    });
  }

  //   微信分享方法代码
  function weShare(invitationCode) {
    var appId,
      timestamp,
      nonceStr,
      signature = "";
    // console.log(invitationCode, 2222);
    var shareUrl = `http://f.localhome.cn/20180930memoryBuilding/memory.html?parentId=${invitationCode}`;
    shareUrl = encodeURI(shareUrl);

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
