import "../css/invited.less";
import "../css/reset.less";
import "@js/flexible.min.js";
import Config from "@js/config.js";
import "babel-polyfill";
import {showBody} from "../../../js/util"

$(function() {
  let api = Config.api;
  let invitationCode;
  let userInfo =
    localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");
  let token =
    sessionStorage.getItem("token") || localStorage.getItem("token");
  let nickName = userInfo ? JSON.parse(userInfo).nickName : "我";

  showBody();

  $("#invited").click(() => {
    $(".mask").css("display", "flex");
    $(window).scrollTop(0);
  });
  $(".mask").click(() => {
    $(".mask").css("display", "none");
  });
  // 获取邀请人数信息
  $.ajax({
      url:api+'/platform/cash-vip/invitation-users',
      headers: {
        "LOCALS-ACCESS-TOKEN": "Bearer " + token
      },
      success:(res)=>{
        if(res.success){
            let peoples=res.data;
            let num=peoples.length;
            let html=''
            for(let i=0;i<peoples.length;i++){
                let people=peoples[i]
                html+=`<li>
                <span class="name">${people.nickName}</span>
                <span class="date">${formatTime(new Date(people.validTimeStart))}</span>
            </li>`
            }
            $('#people-invited').text(num+'人')
            $('#month-left').text(num+'个月资格')
            $('.invited-people ul').html(html)
            $('#save-money').text(num*10+'元')
            if(num>12){
              $('.full').text('马上订房享受权益吧')
            }
        }
      }
  })
  // 获取邀请码后再启动微信分享方法
  // getInitationCode().then(weShare(invitationCode));
  async function getInitationCodeAsynx(){
    let invitationCode=await getInitationCode()
    weShare(invitationCode)
  }
  getInitationCodeAsynx();


  // 格式化时间
  function formatTime(time){
    let y=time.getFullYear();
    let m=time.getMonth()+1;
    let d=time.getDate();

    return y+'/'+m+'/'+d
  }
  // 请求邀请码
  function getInitationCode() {
    return new Promise(resolve => {
      $.ajax({
        type: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "LOCALS-ACCESS-TOKEN": "Bearer " + token
        },
        url: api + "/platform/business-invitation",
        success: res => {
          if (res.success) {
            invitationCode = res.data.invitationCode;
            console.log(invitationCode,1111)
            resolve(invitationCode);
          }
        }
      });
    });
  }

  // 微信分享文案图片
  function weShare(invitationCode) {
    var appId,
      timestamp,
      nonceStr,
      signature = "";
      console.log(invitationCode,2222)
    var shareUrl = `http://f.localhome.cn/20180823businessTrip/invitedApprove.html?invitationCode=${invitationCode}&nickName=${nickName}`;
        shareUrl = encodeURI(shareUrl)

    var shareImg =
      "http://120.76.204.105/upload/180829/AEZ8H180829150531506.jpeg";

    var desc = "权益更多，服务更好，2.5折福利限时抢购中";

    var title = `${nickName}已经领了【路客商务旅客】就差你没领了`;

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
