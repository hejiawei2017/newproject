const { wxPay } = require('../../../server/order')
const { showLoading, catchLoading } = require('../../../utils/util')

Page({
  onLoad: function (options) {
    // 禁止转发
    wx.hideShareMenu()
    let pages = getCurrentPages()
    let lastPages = pages[pages.length - 2]
    let openId = wx.getStorageSync('openId')
    if (!openId) {
      catchLoading('支付前请登录~', 3000, wx.navigateBack)
      return 
    }
    let { orderId, money } = options
    console.log(options)
    if (!orderId) {
      catchLoading('orderId is not null', 3000, wx.navigateBack)
      return
    }
    if (!money) {
      catchLoading('money is not null', 3000, wx.navigateBack)
      return
    }
    let params = {
      accountId: 7,
      tradeType: 'JSAPI',
      outTradeNo: orderId,
      amount: money,
      currency: 'CNY',
      source: 'MINI', // 不能修改
      body: '小程序支付',
      openId
    }
    showLoading('支付中...')
    wxPay(params)
      .then(res => {
        wx.hideLoading()
        lastPages.setData({
          visiable: false,
          payRes: {
            success: res
          }
        }, wx.navigateBack)
      })
      .catch(e => {
        wx.hideLoading()
        lastPages.setData({
          visiable: false,
          payRes: {
            fail: e
          }
        }, wx.navigateBack)
      })
  }
})