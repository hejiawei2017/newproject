import Config from "@js/config.js";
import OSS from 'ali-oss'

// 只容许2到15位中文名和英文名
const nameRegExp = /^(?:[\u4e00-\u9fa5]{2,15})(?:●[\u4e00-\u9fa5]+)*$|^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$/;

const telRegExp = /^1[3-9]\d{9}/;

const cardRegExp = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;

const emailRegExp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;

const SocialCreditCodeRegExp = /[^_IOZSVa-z]{2}\d{6}[^_IOZSVa-z]{10}$/;

const companyRegExp = /^(([\u4e00-\u9fff]{2,20})|([a-z\.\s\,]{2,50}))$/i;

const authCodeRegExp = /^[0-9]{4}$/;

window.alert = function(name) {
  //alert弹框 去掉域名
  const iframe = document.createElement("IFRAME");
  iframe.style.display = "none";
  iframe.setAttribute("src", "data:text/plain,");
  document.documentElement.appendChild(iframe);
  window.frames[0].window.alert(name);
  iframe.parentNode.removeChild(iframe);
};

const getUrlArg = function() {
  //将url的值转为JSON。通过data.id获取
  var data = {};
  var argStr = window.location.search;
  var re = new RegExp("([^&?]*)=([^&?]*)", "g");
  var temp = null;
  while ((temp = re.exec(argStr))) {
    data[temp[1]] = temp[2];
  }
  return data;  
};
const getParam = function(key) {
  // 获取参数
  var url = window.location.search;
  // 正则筛选地址栏
  var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
  // 匹配目标参数
  var result = url.substr(1).match(reg);
  //返回参数值
  return result ? decodeURIComponent(result[2]) : "";
};

// 获取当前用户关注公众号的openid
function getOpenId() {
  let ua = navigator.userAgent;
  let isWechat = ua.toLowerCase().indexOf("micromessenger") > -1;

  if (isWechat) {
    let code;

    let search = window.location.search;
    if (search) {
      let reg = new RegExp("(^|&)" + "code" + "=([^&]*)(&|$)", "i");
      // 匹配目标参数
      let result = search.substr(1).match(reg);
      //返回参数值

      code = result ? decodeURIComponent(result[2]) : "";

      let codeObj = {
        code
      };

      return new Promise((resolve, reject) => {
        $.ajax({
          url: Config.api + "/wechat/wechat/auth/wx-user",
          headers: {
            "Content-type": "application/json"
          },
          method: "POST",
          data: JSON.stringify(codeObj),
          dataType: "json",
          success(res) {
            resolve(res);
          },
          error(e) {
            reject(e);
          }
        });
      });
    }
  }
}

/** 授权登录 */
function authUrl(url) {
  let path='/wechat/wechat/auth-url';
  if(url.indexOf('authType')!==-1){
    path='/wechat/wechat/static/auth-url'
  }
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "POST", 
      headers: {
        "Content-type": "application/json"
      },
      dataType: "json",
      url: Config.api + path,
      data: JSON.stringify({
        url
      }),
      success: function(res) {
        if (res.success) {
          resolve(res);
        } else {
          resolve(false);
        }
      },
      error: function() {
        reject(false);
      }
    });
  });
}

// 获取微信code和userInfo
function getCode(type) {
  let ua = navigator.userAgent;
  let isWechat = ua.toLowerCase().indexOf("micromessenger") > -1;

  if (isWechat) {
    let code = null;

    let search = window.location.search;
    if (search) {
      let reg = new RegExp("(^|&)" + "code" + "=([^&]*)(&|$)", "i");
      // 匹配目标参数
      let result = search.substr(1).match(reg);
      //返回参数值

      code = result ? decodeURIComponent(result[2]) : "";
    }
    
    // 如果没有code
    if (!code) {
      let { href } = location;
      href = encodeURIComponent(href);
      let url=`https://f.localhome.cn/authorization/index.html?url=${href}&env=${MY_ENV}`
      if(type==="base"){
        if (href.indexOf('?') === -1) {
          href += "?authType=base";
        } else {
          href += "&authType=base";
        }
      }
      
      return new Promise(resolve => {
        location.replace(url);
        resolve(false)
      })
    } else {
      return new Promise((resolve, reject) => {
        let data = {
          code: code,
          app: 3
        };
        $.ajax({
          method: "POST",
          url: Config.api + `/wechat/wechat/auth/wx-user`,
          headers: {
            "Content-type": "application/json"
          },
          dataType: "json",
          data: JSON.stringify(data),
          success: function(res, textStatus, request) {
            if (res.success) {
              let { token, openId } = res.data;
              sessionStorage.setItem("token", token);
              sessionStorage.setItem("openId", openId);
              resolve(true);
            } else {
              let { errorCode } = res
              // code已被使用 无效的code
              if (errorCode === '40163'  || errorCode === '40029') {
                 // 清空code重新授权登录, code参数必须是在最后一个参数
                let { href } = location
                let codeIndex = href.indexOf('code=')
                href = href.slice(0, codeIndex - 1)
                location.replace(href)
                resolve(false)
              } else {
                let traceid = request.getResponseHeader('x-b3-traceid')
                res.traceid = traceid.slice(0, 6)
                reject(res);
              }
            }
          },
          error: function(err) {
            reject(err);
          }
        });
      });
    }
  }
}
// 获取验证码
function getAuthCode(api, mobile) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      url: api + "/platform/auth/auth-code/send",
      data: JSON.stringify({ mobile: mobile }),
      success: function(res) {
        if (res.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      error: function(err) {
        reject(err);
      }
    });
  });
}

// 验证码登录注册
function codeSignIn(api, mobile, authCode, traceId, traceInfo) {
  let params = {
    mobile: mobile,
    authCode: authCode,
    authType: 1,
    appId: "4",
    platform: "ACT",
    traceId: traceId,
    traceInfo: traceInfo
  };
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      url: api + "/platform/auth/auth-code/sign-in",
      data: JSON.stringify(params),
      success: function(res) {
        if (res.success) {
          // 存token
          sessionStorage.token = res.data;
          localStorage.token = res.data;
          resolve(res.data);
        } else {
          if (res.errorMsg) {
            alert(res.errorMsg);
            reject(res);
          }
        }
      },
      error: function(err) {
        reject(err);
      }
    });
  }).then(res => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        headers: {
          "LOCALS-ACCESS-TOKEN": "Bearer " + res
        },
        url: api + "/platform/user/user-info",
        success: function(res) {
          sessionStorage.setItem("userInfo", JSON.stringify(res.data));
          localStorage.setItem("userInfo", JSON.stringify(res.data));
          resolve(res.data);
        }
      });
    });
  });
}
// 修改手机号码传入traceId 和 traceInfo
function bindMobile(api, mobile, authCode, traceId, traceInfo) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "PUT",
      headers: {
        "LOCALS-ACCESS-TOKEN": "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json; charset=UTF-8"
      },
      data: JSON.stringify({
        mobile: mobile,
        code: authCode,
        traceId: traceId,
        traceInfo: traceInfo
      }),
      timeout: 5000,
      url: api + "/platform/user/user-info-mobile",
      success: function(res) {
        if (res.success) {
          sessionStorage.setItem("token", res.data);
          localStorage.setItem("token", res.data);
          // 获取userInfo
          $.ajax({
            type: "GET",
            headers: {
              "LOCALS-ACCESS-TOKEN": "Bearer " + sessionStorage.getItem("token")
            },
            timeout: 5000,
            url: api + "/platform/user/user-info",
            success: function(res) {
              resolve(res.data);
            },
            complete: function(xhr, status) {
              if (status == "timeout") {
                //超时,status还有success,error等值的情况
                // 　　　　　 ajaxTimeoutTest.abort();
                reject("网络超时002,请重新尝试");
              }
            }
          });
        } else {
          resolve(res);
          // if(res.errorMsg&&res.errorDetail.indexOf('已绑定')==-1){
          //   alert(res.errorMsg)
          //   reject(res);
          // }
          // else if(res.errorDetail.indexOf('已绑定')>-1){
          //   resolve('已绑定')
          // }else{
          //   reject(res)
          // }
        }
      },
      complete: function(xhr, status) {
        if (status == "timeout") {
          //超时,status还有success,error等值的情况
          // 　　　　　 ajaxTimeoutTest.abort();
          reject("网络超时001,请重新尝试");
        }
      }
    });
  });
}
// 获取小程序微信环境
function getMiniprogramEnv() {
  return new Promise((resolve, reject) => {
    if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
      // document.addEventListener("WeixinJSBridgeReady", ready, false);
      ready();
    } else {
      ready();
    }

    function ready() {
      console.log(
        "验证小程序环境",
        window.__wxjs_environment === "miniprogram"
      ); // true
      if (window.__wxjs_environment === "miniprogram") {
        resolve(true);
      } else {
        resolve(false);
      }
    }
  });
}

// 延迟显示
const showBody = function showBody(time = 500) {
  setTimeout(() => {
    document
      .getElementsByTagName("body")[0]
      .setAttribute("style", "display: block");
  }, time);
};

//身份证号合法性验证
//支持15位和18位身份证号
//支持地址编码、出生日期、校验位验证
function checkID(code) {
  var city = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外 "
  };
  var tip = "";
  var pass = true;

  if (
    !code ||
    !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
      code
    )
  ) {
    tip = "身份证号格式错误!";
    pass = false;
  } else if (!city[code.substr(0, 2)]) {
    tip = "身份证地址编码错误!";
    pass = false;
  } else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split("");
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if (last != code[17]) {
        tip = "身份证校验位错误!";
        pass = false;
      }
    }
  }

  return { success: pass, errorMsg: tip };
}

function isIOS() {
  let u = navigator.userAgent;
  let result = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if (result) {
    return true;
  } else {
    return false;
  }
}

function isAndroid() {
  let u = navigator.userAgent;
  let result = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
  if (result) {
    return true;
  } else {
    return false;
  }
}

function isWechat() {
  let ua = navigator.userAgent;
  let result = ua.toLowerCase().indexOf("micromessenger") > -1;
  if (result) {
    return true;
  } else {
    return false;
  }
}

function validator(val, type, normalMessage) {
  var phoneExp = new RegExp(/^1[3-9]\d{9}$/),
    hasNumber = new RegExp(/\d/),
    emailExp = new RegExp(
      /^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i
    ),
    passwordExp = new RegExp(/^[\S]{6,16}$/),
    codeExp = new RegExp(/\d{6}/),
    priceExp = new RegExp(/^(-?\d+)(\.\d+)?$/),
    idCardExp = new RegExp(
      /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
    ),
    passportExp = new RegExp(/^[A-Z].[0-9]{7}$/),
    compatriotsExp = new RegExp(/^3\d{7}$/),
    trafficExp = new RegExp(/^[HMhm]{1}([0-9]{10}|[0-9]{8})$/),
    // 只容许2到30位中文名和英文名
    nameRegExp = /^(?:[\u4e00-\u9fa5]{2,30})(?:●[\u4e00-\u9fa5]+)*$|^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$/,
    // dateExp = /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/, //时间格式验证，允许2018-08-22格式
    dateExp = /^(?:(19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/,
    errorMsg = {
      phone: normalMessage || "请填写有效的手机号",
      email: normalMessage || "请填写有效的邮箱",
      password: normalMessage || "请填写6-16位字符，不能包含空格",
      code: normalMessage || "请填写6位数字",
      price: normalMessage || "请输入数字",
      normal: normalMessage || "",
      select: normalMessage || "",
      idCard: "请填写正确的身份证号格式",
      passport: "请填写正确的护照信息",
      compatriots: "请填写正确的台胞证信息",
      traffic: "请填写正确的港澳通行证信息",
      realname: "请输入正确的名字",
      date: normalMessage || "请填写正确日期格式"
    },
    error = [];
  switch (type) {
    case "realname":
      // 不能为空 不容许有数字 大于1一个字节
      if (!val || hasNumber.test(val) || val.length <= 1) {
        error.push(errorMsg.realname);
      }
      break;
    case "date":
      if (!dateExp.test(val)) {
        error.push(errorMsg.date);
      }
      break;
    case "idCard":
      let { success, errorMsg: msg } = checkID(val);
      if (!success) {
        error.push(msg);
      }
      break;
    case "passport":
      if (!passportExp.test(val)) {
        error.push(errorMsg.passport);
      }
      break;
    case "compatriots":
      if (!compatriotsExp.test(val)) {
        error.push(errorMsg.compatriots);
      }
      break;
    case "traffic":
      if (!trafficExp.test(val)) {
        error.push(errorMsg.traffic);
      }
      break;
    case "phone":
      if (!phoneExp.test(val)) {
        error.push(errorMsg.phone);
      }
      break;
    case "email":
      if (!!val && !emailExp.test(val)) {
        error.push(errorMsg.email);
      }
      break;
    case "normal":
      if (!val && val !== 0) {
        error.push(errorMsg.normal);
      }
      break;
    case "password":
      if (!passwordExp.test(val)) {
        error.push(errorMsg.password);
      }
      break;
    case "code":
      if (!codeExp.test(val)) {
        error.push(errorMsg.code);
      }
      break;
    case "price":
      if (!priceExp.test(val)) {
        error.push(errorMsg.price);
      }
      break;
  }

  if (error.length > 0) {
    layer.msg(error[0]);
    return false;
  }
  return true;
}

// 获取优惠劵
function getCoupon(mobile, couponCode, api) {
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
          console.log("领取成功");
          resolve(true);
        } else {
          resolve(false);
        }
      },
      error: function(err) {
        reject(err);
      }
    });
  });
}

// 升级等级
function memberCardUp(card, userId, api) {
  let validTimeStart = new Date().getTime();
  let now = new Date();
  let end = now.setFullYear(now.getFullYear() + 1);
  let validTimeEnd = now.getTime();

  let params = {
    userId: userId,
    memberCardCode: card,
    validTimeStart: validTimeStart,
    validTimeEnd: validTimeEnd
  };
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
        } else {
          resolve(false);
        }
      },
      error: function(err) {
        console.log(err);
        reject(err);
      }
    });
  });
}

// 获取用户二维码
function getQrCode(openId, actId) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: `http://uat.localhome.cn/api/weixin/qrcode/image?ticket_id=${actId}&creator_id=${openId}`,
      success: function(res) {
        if (res.success) {
          resolve(res.data);
        }
      }
    });
  });
}

// 获取设备DPR
function getDPR() {
  if (window.devicePixelRatio && window.devicePixelRatio > 1) {
    return window.devicePixelRatio;
  }
  return 1;
}

// 微信分享代码
function weShare(shareUrl, title, desc, shareImg) {
  var appId,
    timestamp,
    nonceStr,
    signature = "";

  shareUrl = encodeURI(shareUrl);

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
        error: function() {
          console.log("服务器连接error", "bottom");
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
        "downloadImage",
        "updateTimelineShareData",
        "updateAppMessageShareData"
      ] // 必填，需要使用的JS接口列表
    });
    wx.ready(function() {
      wx.updateTimelineShareData({
        title: title,
        link: shareUrl,
        imgUrl: shareImg,
        success: function() {}
      });
      wx.updateAppMessageShareData({
        title: title,
        desc: desc,
        link: shareUrl,
        imgUrl: shareImg, // 分享图标
        // type: "",
        // dataUrl: "",
        success: function() {}
      });
    });
  }
}
// 自定义toast方法
function myToast(msg, time) {
  let delay = time ? time : 2000;
  let toastTag = $(".toast-wrap");
  if (toastTag[0]) {
    $(".toast-msg").text(msg);
    toastTag.fadeIn().delay(delay).fadeOut();
  } else {
    $(`<div class="toast-wrap">
    <p class="toast-msg"></p>
 </div>`).appendTo($(document.body));
 $(".toast-msg").text(msg);
 $('.toast-wrap').fadeIn().delay(delay).fadeOut();
  }
}


function createUUID (t = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',ary = 16){
  var d = new Date().getTime()
  var uuid = t.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * ary) % ary | 0
      d = Math.floor(d / ary)
      return (c === 'x' ? r : ((r && 0x7) || 0x8)).toString(ary)
  })
  return uuid
}

//client
const client = new OSS({
  region: 'oss-cn-shenzhen',
  accessKeyId: 'LTAI51rz55fhjUzU',
  accessKeySecret: 'QETpJ124TfYfP801ZA5Mco0djKvXtx',
  bucket: (Config.getEnv === 'pre' || Config.getEnv === 'prod') ? 'locals-house-prod' : 'locals-house-test', //locals-house-prod(生产) locals-house-test(测试)
  secure: true // https访问
});


function upload(path,name,file,fun){
    client.put(`${path}/${name}`, file).then(function (result) {
      fun && fun(result.url)
    }).catch(function (err) {
      console.log(err)
        fun && fun({errorMsg: '上传失败'})
    });

}


function equar(a, b) {
  let _a = a.sort()
  let _b = b.sort()
  // 判断数组的长度
  if (_a.length !== _b.length) {
      return false
  } else {
      // 循环遍历数组的值进行比较
      for (let i = 0; i < _a.length; i++) {
          if (_a[i] !== _b[i]) {
              return false
          }
      }
      return true;
  }
}

function wxScrollSolve(scrollWrapObj) {//Scrollobj要滚动的内容外部包裹的容器对象
  if(scrollWrapObj==""||scrollWrapObj==undefined||scrollWrapObj==null){
      return
  }
  var overscroll = function (el) {
      el.addEventListener('touchstart', function () {
          var top = el.scrollTop
              , totalScroll = el.scrollHeight
              , currentScroll = top + el.offsetHeight;
          if (top === 0) {
              el.scrollTop = 1;
          } else if (currentScroll === totalScroll) {
              el.scrollTop = top - 1;
          }
      });
      el.addEventListener('touchmove', function (evt) {
          if (el.offsetHeight < el.scrollHeight)
              evt._isScroller = true;
      })
  };
  overscroll(scrollWrapObj);    /*document.querySelector('.MainCon')*/
  document.body.addEventListener('touchmove', function (evt) {
      if (!evt._isScroller) {
          evt.preventDefault();
      }
  });
}

module.exports = {
  nameRegExp,
  telRegExp,
  cardRegExp,
  emailRegExp,
  SocialCreditCodeRegExp,
  companyRegExp,
  authCodeRegExp,
  getUrlArg,
  getParam,
  getCode,
  showBody,
  getAuthCode,
  codeSignIn,
  bindMobile,
  getMiniprogramEnv,
  isIOS,
  isAndroid,
  checkID,
  isWechat,
  validator,
  getOpenId,
  authUrl,
  getCoupon,
  memberCardUp,
  getQrCode,
  getDPR,
  weShare,
  myToast,
  upload,
  createUUID,
  equar,
  wxScrollSolve
};
