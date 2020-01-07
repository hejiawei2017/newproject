const app = getApp()
const { getOrderDetail, miniPay } = require('../../../server/order')
const { reportFormid } = require('../../../server/message')
const { catchLoading } = require('../../../utils/util')
const moment = require("../../../utils/dayjs.min.js")

// 是否已经返回
let backed = false;

Page({
  data: {
    isFullScreen: app.globalData.isFullScreen,
    bookingId: '',
    startData: Date.now(),
    orderDetail: {}
  },
  onUnload() {
    this.onWillBack()
    backed = false;
  },
  onLoad (options) {
    this.setData({
      bookingId: options.bookingId,
      startData: options.startData,
    })
  },
  onShow(){
    this.selectComponent("#im-message").imLogin()
  },
  pay(e) {
    getApp().mtj.trackEvent('fail_pay_keep_pay');
    this.getOrderDetail()
  },

  onWillBack(cb = f => f) {
    if (backed) {
      cb();
      return
    }
    const currentMoment = moment()
    const checkinBeforeFiveDays = moment(Number(this.data.startData)).add(-5, 'day')
    const checkinDate = moment(this.data.startData)

    const message = moment(checkinBeforeFiveDays.format('YYYY-MM-DD 15:00:00')).isBefore(currentMoment)
      ? '支付成功后为你保留房间\r\n' + checkinBeforeFiveDays.format('YYYY年MM月DD日 15:00')+'前可免费取消'
      : '该民宿很抢手，快完成支付抢先一步！';

    wx.showModal({
      title: '提示',
      content: message,
      showCancel: true,
      cancelText: '去意已决',
      confirmText: '继续支付',
      success: ({ confirm }) => {
        if (confirm) {
          this.pay()
          return
        }
        backed = true;
        cb()
      },
    })
  },
  
  getOrderDetail () {
    wx.showLoading({
      title: '支付中...',
    })
    getOrderDetail(this.data.bookingId)
      .then(res => {
        this.setData({
          orderDetail: res.data
        })
        this.weixinPay()
      })
      .catch(e => {
        catchLoading(e)
      })
  },
  weixinPay () {
    let openId = wx.getStorageSync('openId')
    let params = {
      accountId: 7,
      isInvoice: this.data.orderDetail.isNeedInvoice == '1' ? true : false,
      amount: this.data.orderDetail.totalPrice,
      outTradeNo: this.data.orderDetail.bookingId,
      tradeType: 'JSAPI',
      currency: 'CNY',
      source: 'MINI', // 不能修改
      body: '小程序支付',
      openId: openId
    }
    miniPay(params)
      .then(res => {
        wx.hideLoading()
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.pkg,
          signType: res.data.signType,
          paySign: res.data.sign,
          success: res => {
            getApp().mtj.trackEvent('fail_pay_go_ahead_pay_success');
            wx.redirectTo({
              url: '../book-pay-success/index?bookingId=' + this.data.bookingId,
            })
          },
          fail: e => {
            wx.showToast({
              title: '支付失败',
              icon: 'none'
            })
          }
        })
      })
      .catch(e => {
        catchLoading(e)
      })
  },
  goToIndex() {
    getApp().mtj.trackEvent('fail_pay_return_index');
    this.onWillBack(() => {
      wx.switchTab({
        url: '/pages/index/index'
      })
    })
  },
  goToOrderDetail() {
    getApp().mtj.trackEvent('fail_pay_check_order_detail');
    backed = true;
    wx.redirectTo({
      url: '/pages/trip/detail-v2/index?bookingId=' + this.data.bookingId
    })
  },
  formSubmit(e) {
    const formId = e.detail.formId
    reportFormid({
      formId,
      type:1,
    })
  }
})