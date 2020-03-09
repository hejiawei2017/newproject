import "../css/index.less";
import "../css/reset.less";
require("@js/flexible.min.js");
import "babel-polyfill";
import { showBody, weShare } from "../../../js/util";

$(function() {
  showBody();
  // 禁止模态框滚动
  let maskList = document.getElementsByClassName("mask");
  let type;
  let youzan;
  let img;
  let title;
  let shareUrl = location.href;
  let shareTitle = "【限时抢购】路客会员升级套餐，一键直升VIP！";
  let desc = "";
  let shareImg='https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/20181228upgrade/WechatIMG252.jpeg'
  weShare(shareUrl, shareTitle, desc, shareImg)
  
  for (var i = 0; i < maskList.length; i++) {
    // console.log("4444",maskList[i])
    maskList[i].addEventListener(
      "touchmove",
      function(e) {
        e.preventDefault();
        e.stopPropagation();
      },
      false
    );
  }
  // 显示rule
  $(".rule").click(function(e) {
    $(".main").fadeOut();
    $(".rule-wrap").fadeIn();
  });
  $(".rule-wrap").click(function(e) {
    $(".rule-wrap").fadeOut();
    $(".main").fadeIn();
  });

  //显示隐藏模态框
  $(".go").click(function(e) {
    type = $(this).attr("data-type");
    change(type);
    console.log(type);
    $(".card-img").attr("src", img);
    $(".card-title").text(title);
    $(".modle-wrap").fadeIn();

    $(".go-youzan").click(function(e) {
      location.href =
        youzan || "https://h5.youzan.com/wscshop/goods/2g2r54agzdhxc";
    });
  });
  $(".modle-wrap").click(function() {
    $(".modle-wrap").fadeOut();
  });
  $(".content").click(function(e) {
    e.stopPropagation();
  });

  // 根据type生成不同内容
  function change(type) {
    switch (type) {
      case "black":
        youzan = "https://h5.youzan.com/wscshop/goods/2xab9117ubfxc";
        img =
          "https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/20181228upgrade/blackcard.png";
        title = "路客黑卡VIP套餐";
        break;
      case "gold":
        youzan = "https://h5.youzan.com/wscshop/goods/2g2r54agzdhxc";
        img =
          "https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/20181228upgrade/goldcard.png";
        title = "路客金卡VIP套餐";
        break;
      case "silver":
        youzan = "https://h5.youzan.com/wscshop/goods/278w8lj5fkckw";
        img =
          "https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/20181228upgrade/silvercard.png";
        title = "路客银卡VIP套餐";
        break;
    }
  }
});
