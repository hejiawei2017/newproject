import "../css/reset.less";
import "../css/index.less";
require("@js/flexible.min.js");
import Config from "@js/config.js";
import "babel-polyfill";

const press_btn = require("../images/btn2.png");
const btn = require("../images/btn1.png");
import {
  showBody,
  getCode,
  getCoupon,
  memberCardUp,
  getQrCode,
  getDPR,
  weShare,
  myToast
} from "../../../js/util";

$(function() {
  showBody();

  var api = Config.api;
  let able = false;
  let start_btn = document.getElementById("start");
  let act_id = 12;
  let userInfo = null;
  let open_id = null;
  let canvas = document.getElementById("post");
  let ctx = canvas.getContext("2d");
  let best_png = require("../images/best.png");
  let img50 = require("../images/invite_50.png");
  let imgGold = require("../images/invite_vip.png");
  let imgCloth = require("../images/invite_clothes.png");
  let mobile = null;
  let userId = null;
  let done=false;

  // 微信分享参数
  let shareUrl = "http://f.localhome.cn/20181127fresHouseLottery/index.html";
  let shareImg =
    "https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/20181127fresHouseLottery/WechatIMG223.png";
  let desc = "百分百中奖，马上抽免单！";
  let title = `送你一次免单机会，路客精品民宿0元住！`;

  // 微信授权获取用户信息
  getUserInfo().then(res => {
    // 微信分享
    weShare(shareUrl, title, desc, shareImg);
    // 绘制海报
    drawPost(ctx)
    // 获取抽奖次数
    getChance(open_id, act_id).then(res => {
      if (res > 0) {
        $("#chance-have").text(res);
      } else {
        $("#chance-have").text(0);
      }
    });
    // 开始抽奖
    start_btn.addEventListener("touchstart", function() {
      if(done){
        return
      }
      // start_btn.disabled = true;
      $("#start").css("backgroundImage", `url(${press_btn})`);
    });
    start_btn.addEventListener("touchend", function() {
      if(done) return;

      $("#start").css("backgroundImage", `url(${btn})`);
      
      done=true;
      // 获取用户抽奖次数
      getChance(open_id, act_id).then(res => {
        if (res > 0) {
          able = true;
          $("#chance-left").text(res - 1);
        } else {
          able = false;
          $("#chance-left").text(0);
        }
        if (able) {
          able = false;
          // 抽奖
          getPrize(open_id, act_id).then(res => {
            let prizeId = res.prizeId;
            // 开始抽奖
            Lottery(prizeId);
            
            
            // console.log(9999,api,res,prizeId)
            if (prizeId == 2) {
              $(".prize-text").html(
                "恭喜您，抽中了<span>￥</span><strong>50</strong>优惠劵"
              );
              $(".prize-img").attr("src", img50);
              // console.log(888,api)
              getCoupon(mobile, "NUHHJRVF", api);
            } else if (prizeId == 3) {
              $(".prize-text").html("恭喜您，抽中了路客金卡会员1年");
              $(".prize-img").attr("src", imgGold);
              memberCardUp("GOLD", userId, api);
            } else if (prizeId == 4) {
              $(".prize-text").html("恭喜您，抽中了路客定制卫衣一件");
              $(".prize-img").attr("src", imgCloth);
            } else {
              $(".prize-text").html(
                "恭喜您，抽中了<span>￥</span><strong>50</strong>优惠劵"
              );
              $(".prize-img").attr("src", img50);
              getCoupon(mobile, "NUHHJRVF", api);
            }
          });
        } else {
          myToast("你已经抽过奖了，赶紧分享海报邀请好友获取多一次抽奖机会吧！");
        }
      });
    });

    // 获取我的奖品信息
    getMyRecord(open_id, act_id).then(res => {
      if (res && res.length > 0) {
        let html = "";
        res.forEach(item => {
          html += `<li>${item.prizeDesc}</li>`;
        });
        $("#my-prize-list").html(html);
      }
    });

    // 绘制海报
    // setTimeout(()=>{
    //   
      
    // },1000)
  });

  // 显示参与人数
  getPeoples(act_id).then(res => {
    if (res) {
      $("#peoples").text(res);
    } else {
      $("#peoples").text(1007);
    }
  });

  // 显示中奖名单
  showRecod();
  function showRecod() {
    getRecord(act_id).then(res => {
      if (res.length > 0) {
        res = res.splice(0, 10);
        let first = "";
        let html = "";
        res.forEach((item,index) => {
          if (index == 0) {
            first = `<li>
                  <div class="user">
                    <img src="${item.headImg}" alt="" /> <span>${
              item.nickname
            }</span>
                  </div>
                  <div class="prize">
                    <p>获得${item.prizeDesc}</p>
                    <p class="best">
                      <img src="${best_png}" alt="" />手气最佳
                    </p>
                  </div>
                </li>`;
          } else {
            if (item.headImg) {
              html += ` <li>
            <div class="user">
              <img src="${item.headImg}" alt="" /> <span>${item.nickname}</span>
            </div>
            <div class="prize"><p>获得${item.prizeDesc}</p></div>
            </li>`;
            }
          }
        });
        $("#info-list").html(first + html);
      }
    });
  }

  // 海报显示隐藏
  $(".share").click(function() {
    $(".prize-mask").css("display", "none");
    $(".post-mask").css("display", "flex");
  });
  $(".post-mask").click(function() {
    $(this).css("display", "none");
    if(done){
      $(".lottery").css("display", "none");
      $(".prize-info").css("display", "flex");
    }
  });
  $('#invite-post').click(function() {
    $(".post-mask").css("display", "flex");
  });

  // 拒绝分享
  $(".reject").click(function() {
    $(".prize-mask").css("display", "none");
    $(".lottery").css("display", "none");
    $(".prize-info").css("display", "flex");
  });

  // 显示小程序二维码
  $(".gouse").click(function() {
    $(".miniCode-mask").css("display", "flex");
  });
  $(".miniCode-mask").click(function() {
    $(".miniCode-mask").css("display", "none");
  });

  // 查看我的奖品
  $("#check-prize").click(function(e) {
    $(".my-prize-mask").css("display", "flex");
  });
  $("#hide").click(function(e) {
    $(".my-prize-mask").css("display", "none");
  });

  // 规则显示隐藏
  $(".rule").click(function() {
    $(".rule-mask").css("display", "flex");
  });
  $(".rule-mask").click(function() {
    $(this).css("display", "none");
  });

  // 禁止模态框滚动
  let maskList=document.getElementsByClassName('mask')

  for(var i=0;i<maskList.length;i++){
    // console.log("4444",maskList[i])
    maskList[i].addEventListener('touchmove', function(e) { 
            e.preventDefault(); 
            e.stopPropagation();
           },false); 
  }
  

  function Lottery(prize) {
    let top = "-1000%";
    switch (prize) {
      case 2:
        top = "-1000%";
        break;
      case 3:
        top = "-1200%";
        break;
      case 4:
        top = "-1500%";
        break;
      default:
        top = "-1000%";
    }
    // console.log(top,parseInt(prize),prize)
    $(".lottery-card")
      .css("top", 0)
      .animate({ top: "-1500%" }, 1000, "linear", function() {
        $(this)
          .css("top", 0)
          .animate({ top: top }, 2000, "linear", function() {
            setTimeout(() => {
              $(".prize-mask").css("display", "flex");
              // 跟新中奖名单
              showRecod();
            }, 1000);
          });
      });
  }

  // 获取抽奖次数
  function getChance(openId, act_id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `http://uat.localhome.cn/api/weixin/act/chance?user_id=${openId}&act_id=${act_id}`,
        success: function(res) {
          if (res.success) {
            resolve(res.data.chance_left);
          } else {
            resolve(false);
          }
        },
        error: function(err) {
          console.log(err);
          reject(false);
        }
      });
    });
  }

  //开始抽奖奖品
  function getPrize(openid, act_id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `http://uat.localhome.cn/api/weixin/prize/req?open_id=${openid}&act_id=${act_id}`,
        success: function(res) {
          if (res.success) {
            resolve(res.data.prizeInfo);
          } else {
            resolve(false);
          }
        },
        error: function(err) {
          console.log(err);
          resolve(false);
        }
      });
    });
  }
  // 获取参与人数
  function getPeoples(act_id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `http://uat.localhome.cn/api/weixin/act/statistics?act_id=${act_id}`,
        success: function(res) {
          if (res.success) {
            resolve(res.data.count);
          } else {
            resolve(false);
          }
        },
        error: function(err) {
          console.log(err);
          resolve(false);
        }
      });
    });
  }
  // 获取中奖人详细信息
  function getRecord(act_id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `http://uat.localhome.cn/api/weixin/prize/record?act_id=${act_id}&except_id=7`,
        success: function(res) {
          if (res.success) {
            resolve(res.data.prizeInfo);
          } else {
            console.log(res);
            resolve(false);
          }
        },
        error: function(err) {
          console.log(err);
          resolve(false);
        }
      });
    });
  }

  // 查看个人奖品
  function getMyRecord(open_id, act_id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `http://uat.localhome.cn/api/weixin/prize/record?open_id=${open_id}&act_id=${act_id}&except_id=7`,
        success: function(res) {
          if (res.success) {
            resolve(res.data.prizeInfo);
          } else {
            resolve(false);
          }
        },
        error: function(err) {
          console.log(err);
          resolve(false);
        }
      });
    });
  }

  // 获取用户信息
  async function getUserInfo(params) {
    try {
      await getCode(); //获取token
      return new Promise((resolve, reject) => {
        $.ajax({
          type: "GET",
          headers: {
            "LOCALS-ACCESS-TOKEN": "Bearer " + sessionStorage.getItem("token")
          },
          url: api + "/platform/user/user-info",
          success: function(res) {
            if (res.success) {
              sessionStorage.setItem("userInfo", JSON.stringify(res.data));
              userInfo = res.data;
              open_id = res.data.appOpenId;
              mobile = res.data.mobile;
              userId = res.data.id;
              resolve(res.data);
            }else{
              myToast('请在微信重新打开!')
            }
          }
        });
      });
    } catch (err) {
      console.log(err);
      myToast("信息获取失败啦，请在微信重新打开一下");
    }
  }

  // 生成分享图片
  function drawPost(ctx) {
    let bgImg = document.getElementById("bg-img");
    let scaleBy = getDPR();

    //获取canva的宽高
    const dom = document.querySelector("#real-post");
    const box = window.getComputedStyle(dom);
    const width = parseInt(box.width);
    const height = parseInt(box.height);
    // 设置canvas的宽高为原来的DPR倍
    canvas.width = width * scaleBy;
    canvas.height = height * scaleBy;

    // 设定canva的css宽高为原来宽高
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    // 将所有绘制内容放大像素比倍
    const s = parseFloat(width / 350);
    ctx.scale(scaleBy * s, scaleBy * s);

    // 设置img的宽高
    $("#real-post").css("width", width);
    $("#real-post").css("height", height);

    // 清除画布
    ctx.clearRect(0, 0, 350, 580);

    // 画背景
    ctx.drawImage(bgImg, 0, 0, 350, 580);

    // 画二维码
    drawCode(ctx);
  }

  //画二维码
  function drawCode(ctx) {
    let qrCode = new Image();
    let canvas=document.getElementById('post')
    qrCode.crossOrigin = "anonymous";
    getQrCode(open_id, act_id)
      .then(res => {
        qrCode.src = res;
        qrCode.onload = function() {
          let imgUrl=''
          ctx.drawImage(qrCode, 140, 470, 70, 70);
          
          try {
            imgUrl = canvas.toDataURL('imgage/png');
          } catch (error) {
            console.log(error)
          }
         
          $("#real-post").attr("src", imgUrl);
        };
      })
      .catch(err => {
        console.log(err);
      });
  }

  
});
