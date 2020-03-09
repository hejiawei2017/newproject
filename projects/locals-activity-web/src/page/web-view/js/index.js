import 'babel-polyfill'
require("@js/flexible.min.js");
const adapter = require('@js/adapter.js')
require(`normalize.css`)

$(() => {
  const { getParam } = require(`@js/util.js`)
  wxInit()
  console.log('localStorage',localStorage)
  console.log(window.navigator)
  let token = getParam('token')
  console.log('getParam(token)', token)
  console.log(window.location)
  let payRes = getParam('pay_res')
  console.log('getParam(pay_res)', payRes)
  if (payRes) {
    let el = document.createElement('div');
    el.innerHTML = payRes
    document.body.appendChild(el)
    console.log(JSON.parse(decodeURIComponent(payRes)))
  }
  let login = document.createElement('botton')
  login.className = 'button signin'
  if (!token) {
    login.innerHTML = '登录'
    login.addEventListener('click', () => {
      adapter.signIn()
    })
  } else {
    login.innerHTML = '退出登录'
    login.addEventListener('click', () => {
      adapter.signOut()
    })
  }
  document.getElementsByClassName('box')[0].insertBefore(login, document.getElementsByClassName('box')[0].firstElementChild)
  let button = document.getElementsByClassName('button')[0]
  let send = document.getElementsByClassName('send')[0]
  let pay = document.getElementsByClassName('pay')[0]
  let share = document.getElementsByClassName('share')[0]
  let netWord = document.getElementsByClassName('getNetWord')[0]

  netWord.addEventListener('click', () => {
    wx.getNetworkType({
      success: function (res) {
        let { networkType } = res
        document.getElementById('netWordRes').innerHTML = networkType
      }
    });
  })

  send.addEventListener('click', () => {
    wx.miniProgram.postMessage({ data: 'foo' });
  })

  button.addEventListener('click', () => {
    adapter.navigate({ method: 'navigateBack' })
  })

  pay.addEventListener('click', () => {
    let orderId = (new Date()).valueOf()
    adapter.skipToOrder({
      money: 0.01,
      orderId
    })
  })

  share.addEventListener('click', () => {
    let handleShare = {
      title: `新活动`,
      path: `/pages/h5/index?url=http://192.168.0.100:3345`,
      imageUrl: `https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/valentine14201902/share.png`,
    }
    adapter.skipToShare(handleShare)
  })

  document.getElementsByClassName('take-a-picture')[0].addEventListener('click', () => {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log('res',res)
        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
      }
    });
  })

  document.getElementsByClassName('start-record')[0].addEventListener('click', () => {
    wx.startRecord();
  })
window.localId = null
  document.getElementsByClassName('stop-record')[0].addEventListener('click', () => {
    wx.stopRecord({
      success: function (res) {
        window.localId = res.localId;
      }
    });
  })
  document.getElementsByClassName('play-voice')[0].addEventListener('click', () => {
    wx.playVoice({
      localId: window.localId // 需要播放的音频的本地ID，由stopRecord接口获得
    });
  })
  document.getElementsByClassName('pause-voice')[0].addEventListener('click', () => {
    wx.pauseVoice({
      localId: window.localId // 需要暂停的音频的本地ID，由stopRecord接口获得
    });
  })
  document.getElementsByClassName('stop-voice')[0].addEventListener('click', () => {
    wx.stopVoice({
      localId: window.localId // 需要暂停的音频的本地ID，由stopRecord接口获得
    });
  })
  

  async function wxInit() {
    var appId, timestamp, nonceStr, signature
    function getParams() {
      return new Promise((resolve, reject) => {
        var url = encodeURIComponent(location.href.split("#")[0].toString());
        $.ajax({
          type: "POST",
          url: `https://ms.localhome.cn/api/wechat/five-plus/config?url=${url}`,
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
    await getParams()
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
        "updateAppMessageShareData",
        "openLocation",
        "startRecord",
        "stopRecord",
        "playVoice",
        "pauseVoice",
        "stopVoice"
      ] // 必填，需要使用的JS接口列表
    });
  }
})