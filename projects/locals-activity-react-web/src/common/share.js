/**
 * 此插件主要作用是在UC和QQ两个主流浏览器
 * 上面触发微信分享到朋友圈或发送给朋友的功能
 */
/*
调用方式


//在微信下默认配置下面就可以了
 let share = new mShare({
    title: '测试分享',
    url: window.location.href,
    desc: '要好好学习天天向上',
    img:
        'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/aai/9373603451125774.png'
  })

  在qq和uc浏览器下面需要调用方法触发分享事件
  share.triggerShare(1)   //// 1 ==> 朋友圈  2 ==> 朋友  0 ==> 直接弹出原生


*/

import { post, put, get, getByOptions } from './request'
var wxApi = require('weixin-js-sdk')
var UA = navigator.appVersion

/**
 * 是否是 UC 浏览器
 */
var uc = UA.split('UCBrowser/').length > 1 ? 1 : 0

/**
 * 判断 qq 浏览器
 * 然而qq浏览器分高低版本
 * 2 代表高版本
 * 1 代表低版本
 */
var qq = UA.split('MQQBrowser/').length > 1 ? 2 : 0

/**
 * 是否是微信
 */
var wx = /micromessenger/i.test(UA)

/**
 * 浏览器版本
 */
var qqVs = qq ? parseFloat(UA.split('MQQBrowser/')[1]) : 0
var ucVs = uc ? parseFloat(UA.split('UCBrowser/')[1]) : 0

/**
 * 获取操作系统信息  iPhone(1)  Android(2)
 */
var os = (function () {
  var ua = navigator.userAgent

  if (/iphone|ipod/i.test(ua)) {
    return 1
  } else if (/android/i.test(ua)) {
    return 2
  } else {
    return 0
  }
})()

/**
 * qq浏览器下面 是否加载好了相应的api文件
 */
var qqBridgeLoaded = false

// 进一步细化版本和平台判断
if ((qq && qqVs < 5.4 && os === 1) || (qq && qqVs < 5.3 && os === 1)) {
  qq = 0
} else {
  if (qq && qqVs < 5.4 && os === 2) {
    qq = 1
  } else {
    if (uc && ((ucVs < 10.2 && os === 1) || (ucVs < 9.7 && os === 2))) {
      uc = 0
    }
  }
}
/**
 * qq浏览器下面 根据不同版本 加载对应的bridge
 * @method loadqqApi
 * @param  {Function} cb 回调函数
 */
function loadqqApi (cb) {
  // qq == 0
  if (!qq) {
    return cb && cb()
  }
  var script = document.createElement('script')
  script.src =
    +qq === 1
      ? '//3gimg.qq.com/html5/js/qb.js'
      : '//jsapi.qq.com/get?api=app.share'
  /**
   * 需要等加载过 qq 的 bridge 脚本之后
   * 再去初始化分享组件
   */
  script.onload = function () {
    cb && cb()
  }
  document.body.appendChild(script)
}
/**
 * UC浏览器分享
 * @method ucShare
 */
function ucShare (config) {
  // ['title', 'content', 'url', 'platform', 'disablePlatform', 'source', 'htmlID']
  // 关于platform
  // ios: kWeixin || kWeixinFriend;
  // android: WechatFriends || WechatTimeline
  // uc 分享会直接使用截图
  var platform = ''
  var shareInfo = null
  // 指定了分享类型
  if (config.type) {
    if (os === 2) {
      platform = config.type === 1 ? 'WechatTimeline' : 'WechatFriends'
    } else if (os === 1) {
      platform = config.type === 1 ? 'kWeixinFriend' : 'kWeixin'
    }
  }
  shareInfo = [config.title, config.desc, config.url, platform, '', '', '']
  // android
  if (window.ucweb) {
    window.ucweb.startRequest &&
      window.ucweb.startRequest('shell.page_share', shareInfo)
    return
  }
  if (window.ucbrowser) {
    window.ucbrowser.web_share &&
      window.ucbrowser.web_share.apply(null, shareInfo)
    return
  }
}
/**
 * qq 浏览器分享函数
 * @method qqShare
 */
function qqShare (config) {
  var type = config.type
  //微信好友 1, 微信朋友圈 8
  type = type ? (type === 1 ? 8 : 1) : ''
  var share = function () {
    var shareInfo = {
      url: config.url,
      title: config.title,
      description: config.desc,
      img_url: config.img,
      img_title: config.title,
      to_app: type,
      cus_txt: ''
    }
    if (window.browser) {
      window.browser.app && window.browser.app.share(shareInfo)
    } else if (window.qb) {
      window.qb.share && window.qb.share(shareInfo)
    }
  }
  if (qqBridgeLoaded) {
    share()
  } else {
    loadqqApi(share)
  }
}
/**
 * 对外暴露的接口函数
 * @method mShare
 * @param  {Object} config 配置对象
 */
function mShare (config) {
  this.config = config
  let vm = this
  this.triggerShare = function (type) {
    if (typeof type !== 'undefined') this.config.type = type
    try {
      if (uc) {
        ucShare(this.config)
      } else if (qq && !wx) {
        qqShare(this.config)
      }
    } catch (e) {}
  }
  let ua = navigator.userAgent
  if (/micromessenger/i.test(ua) || /_sq_/i.test(ua)) {
    //在微信浏览器里面
    post(
      'https://ms.localhome.cn/api/wechat/five-plus/config?url=' +
        encodeURIComponent(window.location.href.split('#')[0].toString())
    )
      .then(res => {
        wxApi.config({
          debug: false,
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: [
            // 所有要调用的 API 都要加到这个列表中
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'
          ]
        })
        wxApi.ready(function () {
          // 微信分享的数据
          var shareData = {
            imgUrl: vm.config.img,
            link: vm.config.url,
            desc: vm.config.desc,
            title: vm.config.title,
            success: function () {
              vm.config.wxShareSuccess && vm.config.wxShareSuccess()
            }
          }
          //分享微信朋友圈
          wxApi.onMenuShareTimeline(shareData)
          //分享给朋友
          wxApi.onMenuShareAppMessage({
            title: vm.config.title, // 分享标题
            desc: vm.config.desc, // 分享描述
            link: vm.config.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: vm.config.img, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
              // 用户点击了分享后执行的回调函数
              vm.config.wxShareSuccess && vm.config.wxShareSuccess()
            }
          })
          //分享到qq
          wxApi.onMenuShareQQ(shareData)
          //分享到微博
          wxApi.onMenuShareWeibo(shareData)
          //分享到qq空间
          wxApi.onMenuShareQZone(shareData)
        })
      })
      .catch(e => {
        alert(JSON.stringify(e))
      })
  }
}
// 预加载 qq bridge
loadqqApi(function () {
  qqBridgeLoaded = true
})
export default mShare
