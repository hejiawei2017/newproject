// pages/activity/coupon29-201812/index.js
const app = getApp()
const { wxPay, waitPay } = require('../../../server/order')
const { joinShare, statisticsEvent } = require('../../../server/hd')
const {
  showLoading,
  shareDataFormat,
  gioTrack
} = require('../../../utils/util')
const { springRelation } = require('../../../server/index')
const request = require('../../../utils/request')

// --- 领卷的域名
// const BASE_API = 'http://127.0.0.1:7001/api/';
const BASE_API = 'https://i.localhome.cn/api/'
// const BASE_API = 'http://tp.localhome.cn:9999/api/';
// --- ---

const ACTIVITY_NAME = 'coupon59-201906'

let intervalName = null

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // banner index
    bannerCurrentIndex: 0,
    bannerData: [
      'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1560411655588banner1.png',
      'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1560411690988banner2.png',
      'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1560411704353banner3.png',
      'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1560411718061banner4.png'
    ],

    successPopup: false,
    failPopup: false,
    waitPopup: false,

    nameShow: '',
    usersMeta: {
      first: [
        'ceid',
        'kraken',
        'tedceil',
        'vvie',
        'mmk',
        'quil',
        'taro',
        'vick'
      ],
      name: [
        '456787',
        '876789',
        '378263',
        '907127',
        '076432',
        '763146',
        '1028',
        '0721'
      ]
    },

    // 是否有资格购买
    isAuthenticated: false,
    // 是否为新用户（新用户才有资格参加活动）
    isNew: true,
    // 是否是黑名单用户
    isBlackList: false,
    // 是否已经购买
    isHave: false,
    // 根据库存数量，判断是否还能购买
    over: true,
    // 渠道号
    channel: null,

    // 轮播图数据
    swiperData: [
      'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1560411731380banner5.png',
      'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1560411744547banner6.png'
    ],

    // 已领取人数
    haveCount: 10000,
    // 成功弹窗
    sucess: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let { sid, springRalationFromUserId, channel } = options
    // 记录渠道号
    channel && this.setData({ channel: channel })
    if (sid) {
      app.globalData.sid = sid
    }
    gioTrack('page59_load', { tag_name: channel })

    if (!!springRalationFromUserId) {
      app.globalData.taskList.push(userInfo => {
        springRelation({
          from_user_id: springRalationFromUserId,
          id: userInfo.id,
          city: 'miniprogram-city'
        })
      })
    }

    this.generateName()
  },

  onUnload() {
    clearInterval(intervalName)
  },

  generateName() {
    const len = this.data.usersMeta.first.length
    let nameShow =
      this.data.usersMeta.first[this.randomCount(len, 0)] +
      this.data.usersMeta.name[this.randomCount(len, 0)]
    nameShow =
      nameShow.substr(0, 3) +
      '***' +
      nameShow.substr(nameShow.length - 3, nameShow.length)
    this.setData({
      nameShow
    })

    intervalName = setInterval(() => {
      let nameShow = `${this.data.usersMeta.first[this.randomCount(len, 0)]}${
        this.data.usersMeta.name[this.randomCount(len, 0)]
      }`
      nameShow = `${nameShow.substr(0, 3)}***${nameShow.substr(
        nameShow.length - 3,
        nameShow.length
      )}`
      this.setData({
        nameShow
      })
    }, 2500)
  },

  // 获取随机数
  randomCount(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    request.get('/mall/item/931070414685876247').then(e => {
      if (e.success) {
        this.setData({
          // over:false
          over: !(parseInt(e.data.quantity, 10) > 1) //弹窗引导下一步
        })
      }
    })
  },

  // 自定义方法
  shareTimeline() {
    wx.navigateTo({
      url: '/pages/activity/coupon59-201906/poster'
    })
  },

  // 领券判断
  handleClick() {
    gioTrack('page59_buybtn', { tag_name: this.data.channel })
    this.selectComponent('#auth-drawer-box').checkRole()
  },

  // 登录成功后的回调函数
  _cancelEventFn() {
    let token = wx.getStorageSync('token')
    let openId = wx.getStorageSync('openId')
    this.checkCoupon(token, openId)

    const channel = wx.getStorageSync('from_channel')
    if (channel) {
      joinShare({
        ticket_id: ACTIVITY_NAME,
        share_user_id: channel
      })
    }
  },

  // 领券操作
  checkCoupon(token, openId) {
    wx.showLoading({
      title: '加载中..',
      mask: true
    })
    waitPay({ itemId: '931070414685876247' }).then(({ data }) => {
      wx.hideLoading()
      const orderInfo = data && data.orderInfo
      if (!data || !orderInfo || orderInfo.tradeStatus !== 0) {
        normalProcess()
        return
      }
      this.doPay(orderInfo)
    })

    const normalProcess = () => {
      if (this.data.over) {
        this.setData({
          failPopup: true //错误弹窗引导下一步
        })
        return
      }

      showLoading()

      request
        .post('mall/purchase-right/grant', {
          itemId: '931070414685876247',
          buyNum: '1'
        })
        .then(e => {
          wx.hideLoading()
          if (e.success) {
            // isAuthenticated为真有购买资格
            this.setData({
              isAuthenticated: e.data.isAuthenticated,
              isBlackList:
                e.data.itemPurchaseRights[0].isAuthenticated ||
                e.data.itemPurchaseRights[1].isAuthenticated,
              isNew: e.data.itemPurchaseRights[2].isAuthenticated,
              isHave: e.data.itemPurchaseRights[3].isAuthenticated
            })
            // 有资格购买
            if (e.data.isAuthenticated) {
              // 直接进行下单逻辑
              this.doOrder()
            } else {
              this.setData({
                failPopup: true //错误弹窗引导下一步
              })
            }
          } else {
            // 请求不成功的情况
            wx.showToast({
              title: '网络异常，请稍后再试！',
              icon: 'none',
              duration: 2000 //持续的时间
            })
          }
        })
        .catch(e => {
          wx.hideLoading()
          wx.showToast({
            title: '网络异常，请稍后再试！',
            icon: 'none',
            duration: 2000 //持续的时间
          })
        })
    }
  },

  doPay(orderInfo) {
    let openId = wx.getStorageSync('openId')
    // 订单创建后，调起微信支付
    let params = {
      accountId: 7,
      isInvoice: false,
      tradeType: 'JSAPI',
      outTradeNo: orderInfo.id,
      amount: orderInfo.payment / 100,
      currency: 'CNY',
      source: 'MALL', // 不能修改
      body: '小程序支付',
      openId: openId
    }

    wxPay(params)
      .then(res => {
        getApp().mtj.trackEvent('active_order', {
          channel: this.data.channel || 'natrue_origin',
          order_item: '59元劵'
        })

        statisticsEvent({
          event: 'attend',
          share_user: wx.getStorageSync('from_channel'),
          activity_name: ACTIVITY_NAME
        })
        this.send100RedPack()
        this.setData({
          successPopup: true
        })

        gioTrack('page59_dopay', { tag_name: this.data.channel })
      })
      .catch(e => {
        if (e.errMsg === 'requestPayment:fail cancel') {
          this.send100RedPack(true)
        }
        wx.redirectTo({
          url: './'
        })
      })
  },

  // 下单
  doOrder() {
    showLoading()
    request
      .post('mall/trade/item', {
        sourcePlatform: 'MP',
        trades: [
          {
            itemId: '931070414685876247',
            totalFee: '5900',
            buyNum: 1
          }
        ]
      })
      .then(e => {
        wx.hideLoading()
        if (e.success) {
          // isAuthenticated为真有购买资格
          console.log(e.data)
          gioTrack('page59_doOrder', { tag_name: this.data.channel })
          this.doPay(e.data.orderInfo)
        } else {
          // 请求不成功的情况
          wx.showToast({
            title: '网络异常，请稍后再试！',
            icon: 'none',
            duration: 2000 //持续的时间
          })
        }
      })
      .catch(e => {
        wx.hideLoading()
        console.log(e)
        wx.showToast({
          title: '网络异常，请稍后再试！',
          icon: 'none',
          duration: 2000 //持续的时间
        })
      })
  },

  // 发送100元红包
  send100RedPack(isShowWaitDailog = false) {
    const app = getApp()

    request
      .post(`${BASE_API}new_use_redpacket/index`, {
        phone: app.globalData.userInfo.mobile,
        userInfo: JSON.stringify(app.globalData.userInfo),
        traceId: app.globalData.sid,
        activity_id: '1906160002280'
      })
      .then(res => {
        if (isShowWaitDailog) {
          this.setData({ waitPopup: true })
        }
        statisticsEvent({
          event: 'attend',
          share_user: `${wx.getStorageSync('from_channel')}_100`,
          activity_name: ACTIVITY_NAME
        })
      })
      .catch((e = {}) => {
        if (e.errorMsg.indexOf('已存在')) {
          this.closePopup()
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: e.errorMsg || e.errorDetail || '服务器繁忙'
          })
        }
      })
  },

  //  跳转到我的优惠券
  jumpToCouponList() {
    wx.reLaunch({
      url: '/pages/coupon/index'
    })
  },

  // 跳回首页
  jumpToHomePage() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  // 关闭弹窗
  closePopup() {
    this.setData({
      failPopup: false,
      successPopup: false,
      waitPopup: false
    })
  },

  clearClick() {
    return
  },

  // 分享给好友的文案配置
  onShareAppMessage() {
    // 分享之前跳回首页
    // wx.reLaunch({
    //   url: '/pages/index/index'
    // })
    gioTrack('page59_share', { tag_name: this.data.channel })
    const { userInfo } = app.globalData
    // 用户点击右上角分享
    return shareDataFormat({
      title: '59元体验路客精品民宿，上万家房源随你选，赶紧来抢',
      path: `/pages/activity/coupon59-201906/index?springRalationFromUserId=${
        userInfo.id
      }`,
      imageUrl:
        'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1560412001828top-img.jpg'
    })
  },

  bannerChange(e) {
    this.setData({
      bannerCurrentIndex: e.detail.current
    })
  },

  // banner operation
  bannerIndexChange(e) {
    const index = e.target.dataset.index
    this.setData({
      bannerCurrentIndex: index
    })
  }
})
