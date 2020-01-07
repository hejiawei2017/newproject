const { miniPay,  waitPay, getOrderDetail } = require("../../../server/order");
const app = getApp()
let isPay = false

Page({
  data: {
    isFullScreen: app.globalData.isFullScreen,
    outTradeNo: '',
    invoiceData: {},
    successModal: false,
    invoiceServicePrice: 0,
    nowDate: Date.parse(new Date())
  },

  onLoad: function(options) {
    const outTradeNo = options.outTradeNo
    const invoiceData = options.invoiceData
    const invoiceServicePrice = options.invoiceServicePrice
    if (invoiceData) {
      this.setData({
        outTradeNo,
        invoiceServicePrice,
        invoiceData: JSON.parse(invoiceData)
      })
    }
  },

  jumpToList() {
    wx.redirectTo({
      url: '../invoice/invoice'
    })
  },

  doPay() {
    if (isPay) return
    isPay = true
    const openId = wx.getStorageSync('openId')
    // 订单创建后，调起微信支付
    const params = {
      accountId: 7,
      isInvoice: false,
      tradeType: 'JSAPI',
      outTradeNo: this.data.outTradeNo,
      amount: this.data.invoiceServicePrice,
      currency: 'CNY',
      source: 'INVOICE', // 不能修改
      body: '小程序支付',
      openId: openId
    }
    miniPay(params)
      .then(res => {
        const payParams = {
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.pkg,
          signType: res.data.signType,
          paySign: res.data.sign,
          success: () => {
            this.setData({
              successModal: true
            })
          },
          fail: () => {
            isPay = false
            wx.showToast({
              title: '支付失败！',
              icon: 'none',
              duration: 2000
            })
          }
        }
        // 调起微信支付
        wx.requestPayment(payParams)
      })
      .catch(e => {
        isPay = false
      })
  }
})