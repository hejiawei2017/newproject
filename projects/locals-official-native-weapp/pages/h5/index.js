/**
 * @props title 分享时的title
 * @props shareImage 分享时的图片
 */
const {shareDataFormat, gioTrack} = require('../../utils/util')
const {trackingConversionAd} = require('../../server/hd')
const app = getApp();
Page({
  data: {
    options: {},
    url: '',
    // 解决修改url时，web-view中的页面存在前后栈，保持一个页面，不容许前后进
    visiable: true,
    // 支付成功的回调信息
    payRes: null,
    shareUrl: '',
    shareData: null
  },
  onLoad(options) {
    // 禁止转发
    // wx.hideShareMenu()
    console.log(app.globalData.scene, "optionsoptionsoptions")
    this.setData({
      options
    })
  },
  onShow() {
    this.init()
  },
  getFromRoute () {
    const pages = getCurrentPages()
    const len = pages.length
    const prePage = pages[len - 2] || {} // 当前栈上一页
    const currentPage= pages[len - 1] || {} // 当前栈当前页
    // 首先看navigateBack有没有注入routeName，没有获取正常栈上一                                                           页，否则为空
    const from = currentPage.data && currentPage.data.from || prePage.route || ''
    return from
  },
  init() {
    let { options, payRes } = this.data;
    // 使用原始传入的url，重新拼接url
    let {url, barTitle, gdt_vid} = options;

    /**
     * gdt_vid：用户从H5落地页点击广告进入小程序，带的点击ID参数，做微信广告数据转化统计回传需要使用此参数
     * 微信广告数据回传上报
     * gio统计从广告进入小程序首页用户数
     */
    if (gdt_vid) {
        app.globalData.clickId = gdt_vid;
        gioTrack('from_ad_to_mini_program_user');
    }

    // 设置title
    if(barTitle) wx.setNavigationBarTitle({title:barTitle});
    // 使webview获取token
    url = decodeURIComponent(url)
    const matchStr = url.match(/@(\w+)@/) && url.match(/@(\w+)@/)[1] ? url.match(/@(\w+)@/)[1] : ''
    if (matchStr === "u") {
      url = url.replace(/@(\w+)@/, "https://i.localhome.cn/v/1904222209237/#/sharePage")
    }
    if (url.indexOf('act1908011111356') > -1) {
      url = url.replace('act1908011111356', 'https://i.localhome.cn/v/1908011111356/#/activity')
    }
    const getSign = () => {
      let markIndex = url.indexOf('?')
      return markIndex === -1 ? '?' : '&'
    }
    let token = wx.getStorageSync('token')
    let scene = app.globalData.scene;
    let isFullScreen = app.globalData.isFullScreen;
    let sid = app.globalData.sid;
    const from = this.getFromRoute()
    if (token) {
      url += `${getSign()}token=${token}`
    }
    if (payRes) {
      url += `${getSign()}pay_res=${encodeURIComponent(JSON.stringify(payRes))}`
    }
    if (scene) {
      url += `${getSign()}scene=${scene}`
    }
    if (isFullScreen) {
      url += `${getSign()}isFullScreen=${isFullScreen}`
    }
    if (sid) {
      url += `${getSign()}sid=${sid}`
    }
    if(from) { // 添加从什么页面跳入
      url += `${getSign()}from=${from}`
    }
    console.log(`h5:`,url)

    this.setData({
      visiable: true,
      url: url ? url : ''
    })
  },

  onShareAppMessage() {
    const { options, shareData } = this.data;
    // 如果h5页面有传入分享数据，使用分享数据
    if(shareData && shareData.path){
      return shareDataFormat({
        path: shareData.path,
        title: shareData.title || 'Locals路客精品民宿',
        imageUrl: shareData.imageUrl || '',
      });
    }
    // 未传入分享数据
    const { title, shareImage, shareOption, shareOptionUrl } = options;
    let path = `/pages/h5/index?`;

    if (shareOption === "1") { //特殊需求需要转发其他页面
      path = `${path}url=${shareOptionUrl}`
      return shareDataFormat({
        path,
        title: title || 'Locals路客精品民宿',
        imageUrl: shareImage || '',
      })
    }
    // 将所以options中的值分享出去
    Object.keys(options).forEach(key => {
      path += `${key}=${options[key]}&`
    })
    path = path.slice(0, -1);
    return shareDataFormat({
      path,
      title: title || 'Locals路客精品民宿',
      imageUrl: shareImage || '',
    });
  },
  bindmessage(e) {
    // 校验是否有data
    if(!e.detail.data || e.detail.data.length === 0) return
    const data = e.detail.data
    let shareData = null
    data.forEach(item => {
      item['data'] = typeof(item['data']) === 'string' ? JSON.parse(item['data']) : item['data']
      if(item['data'].type === 'shareData') shareData = item['data']
    })
    this.setData({shareData})
  }
})
