import "../css/index.less";
import "../css/reset.less";
require("@js/flexible.min.js");
import "babel-polyfill";
import { telRegExp, showBody } from "../../../js/util";
import city_selector from "../../../js/city-select";

$(function() {
  let mobile = null;
  let address = "";
  let name = "";
  let citySel1={
    province: '#province1',
    city: "#city1",
    area: "#area1",
  }
  let citySel2={
    province: '#province2',
    city: "#city2",
    area: "#area2",
  }

  showBody();

  city_selector(citySel1)
  city_selector(citySel2)
  

  // 头条追踪代码
  _taq.push({convert_id:"1616894687551528", event_type:"form"})

  console.log(111,$('#city1').val())

  $("#btn1").on("click", function(e) {
    let propvince=$("#province1").val()
    let city=$('#city1').val()
    mobile = $("#phone1").val();
    address = $("#province1").val()+' '+$('#city1').val();
    name = $("#name1").val().trim();
    // 验证不通过return
    if (!telRegExp.test(mobile)) {
      alert("请输入正确的手机号");
      return;
    }
    if (!name) {
      alert("请输入您的姓名");
      return;
    }
    if (!propvince || !city) {
      alert("请输入您所在的城市");
      return;
    }
    // 按钮失效
    $("#btn1").attr("disabled", true);
    // 提交数据
    submit(name, mobile, address)
      .then(res => {
        alert(
          "您已提交成功，我们将会安排专业的商务人员48小时内联系您，敬请耐心等待，谢谢！"
        );
        $(".form-one").html(
          "您已提交成功<br>我们将会安排专业的商务人员48小时内联系您，敬请耐心等待，谢谢！"
        );
      })
      .catch(err => {
        console.log(err);
        $("#btn1").attr("disabled", false);
        alert("网络开小差了，请稍等再试一下");
      });
  });

  $("#btn2").on("click", function(e) {
    // console.log(1111)
    let propvince=$("#province2").val()
    let city=$('#city2').val()
    mobile = $("#phone2").val();
    address = $("#province2").val()+' '+$('#city2').val();
    name = $("#name2")
      .val()
      .trim();
    // 验证不通过return
    if (!telRegExp.test(mobile)) {
      alert("请输入正确的手机号");
      return;
    }
    if (!name) {
      alert("请输入您的姓名");
      return;
    }
    if (!propvince || !city) {
      alert("请输入您所在的城市");
      return;
    }
    // 按钮失效
    $("#btn2").attr("disabled", true);
    // 提交数据
    submit(name, mobile, address)
      .then(res => {
        alert(
          "您已提交成功，我们将会安排专业的商务人员48小时内联系您，敬请耐心等待，谢谢！"
        );
        $(".form-one").html(
          "您已提交成功<br>我们将会安排专业的商务人员48小时内联系您，敬请耐心等待，谢谢！"
        );
      })
      .catch(err => {
        console.log(err);
        $("#btn2").attr("disabled", false);
        alert("网络开小差了，请稍等再试一下");
      });
  });

  // 提交数据方法
  function submit(name, mobile, address) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        url: "https://uat.localhome.cn/ppActivationRecord/saveInfo",
        data: JSON.stringify({
          peopleName: name,
          phoneNumber: mobile,
          address: address,
          actId: 19
        }),
        success: function(res) {
          resolve(res.success);
        },
        error: function(err) {
          reject(err);
        }
      });
    });
  }

  weShare();

  //   微信分享方法
  function weShare(nickName) {
    var appId,
      timestamp,
      nonceStr,
      signature = "";

    nickName = nickName || "";
    // console.log(invitationCode, 2222);
    var shareUrl = window.location.href;
    shareUrl = encodeURI(shareUrl);

    var shareImg =
      "https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/recruit/WechatIMG119.jpeg";

    var desc = "加入路客，和商业大咖一起分享民宿红利！";

    var title = `路客民宿，2018年火热招募投资人！`;

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
