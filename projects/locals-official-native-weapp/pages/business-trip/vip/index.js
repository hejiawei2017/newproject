const { showLoading, catchLoading, gioTrack } = require('../../../utils/util')
const { wxPay, waitPay } = require('../../../server/order')
const request = require('../../../utils/request')
const { getBuinessStatus, fetchAvailableServiceOrder } = require('../util')

const app = getApp()
const { env } = require('../../../config/env-config')

// 根据环境区分888Vip的商品id
const itemId = env === 'prod' ? '931070414685876255' : '931070414685876255' // 商品id

Page({
  data: {
    isBusinssVip: false, // 是否是vip
    serviceMap: {},
    serviceNames: []
  },

  onLoad() {
    // 如果是vip，初始化页面vip标志位
    if (app.globalData.isVip && app.globalData.vipType) {
      this.setData({
        isBusinssVip: app.globalData.vipType === 3 ? true : false
        // isBusinssVip: true
      })
    } else {
      this.getVipStatus()
    }

    fetchAvailableServiceOrder.call(this)
  },

  activePay() {
    gioTrack('tap_vip_btn')
    this.selectComponent('#auth-drawer-box').checkRole()
  },

  // 登录成功后的回调函数
  _cancelEventFn() {
    let token = wx.getStorageSync('token')
    let openId = wx.getStorageSync('openId')
    this.checkCoupon(token, openId)
  },

  getBuinessStatus() {
    return getBuinessStatus.call(this)
  },

  getVipStatus() {
    this.getBuinessStatus().then(() => {
      this.setData({
        isBusinssVip: app.globalData.vipType === '商务VIP' ? true : false
        // isBusinssVip: true
      })
    })
  },

  // 领券操作
  checkCoupon(token, openId) {
    wx.showLoading({
      title: '加载中..',
      mask: true
    })
    waitPay({
      itemId: itemId
    }).then(({ data }) => {
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
          itemId: itemId,
          buyNum: '1'
        })
        .then(e => {
          wx.hideLoading()
          if (e.success) {
            // isAuthenticated为真有购买资格
            this.setData({
              isAuthenticated: e.data.isAuthenticated,
              isLimit:
                e.data.itemPurchaseRights ||
                e.data.itemPurchaseRights[0].isAuthenticated ||
                false,
              isBlackList:
                e.data.itemPurchaseRights ||
                e.data.itemPurchaseRights[1].isAuthenticated ||
                false,
              isNew:
                e.data.itemPurchaseRights ||
                e.data.itemPurchaseRights[2].isAuthenticated ||
                false,
              isHave:
                e.data.itemPurchaseRights ||
                e.data.itemPurchaseRights[3].isAuthenticated ||
                false
            })
            // 有资格购买
            if (e.data.isAuthenticated) {
              // 直接进行下单逻辑
              this.doOrder()
            } else {
              let title = '您没有权限激活'
              if (this.data.isLimit) title = '您已激活'
              wx.showToast({
                title: title,
                icon: 'none',
                duration: 2000 //持续的时间
              })
            }
          } else {
            // 请求不成功的情况
            wx.showToast({
              title: e.errorMsg,
              icon: 'none',
              duration: 2000 //持续的时间
            })
          }
        })
        .catch(e => {
          wx.hideLoading()
          wx.showToast({
            title: e.errorMsg,
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
        gioTrack('buy_vip_success')
        wx.showToast({
          title: '支付成功!',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          isBusinssVip: true
          // isBusinssVip: true
        })
      })
      .catch(e => {
        // catchLoading(e)
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
            itemId: itemId,
            totalFee: '888',
            buyNum: 1
          }
        ]
      })
      .then(e => {
        wx.hideLoading()
        if (e.success) {
          // isAuthenticated为真有购买资格
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
        wx.showToast({
          title: '网络异常，请稍后再试！',
          icon: 'none',
          duration: 2000 //持续的时间
        })
      })
  },

  routeToTradeLog() {
    wx.navigateTo({
      url: '/pages/business-trip/trade-log/index'
    })
  },

  routeToTrade() {
    gioTrack('tap_to_order_list')
    wx.navigateTo({
      url: '/pages/business-trip/order-list/index'
    })
  },
  routeToMine() {
    wx.reLaunch({
      url: '/pages/mine/mine'
    })
  }
})
