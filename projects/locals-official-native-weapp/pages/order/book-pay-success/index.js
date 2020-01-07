const { receiveCoupon, getOrderDetail } = require('../../../server/order')
const { getUserDetail, getCashVip } = require('../../../server/mine')
const { showLoading, catchLoading, getDiffDays, gioTrack } = require('../../../utils/util')
const { reportFormid } = require('../../../server/message')
const {createBargain, getBargainStatus} = require('../../../server/hd')
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

const app = getApp()

Page({
  data: {
    isFullScreen: app.globalData.isFullScreen,
    bookingId: '',
    orderDetail: {},
    isHasReceive50Coupon: true,
    orderInfo: null,
    user: null,
    // 是否商务会员
    isCashVip: false,
    receiveNumber: 1,
    isShowLayer: false,
    visibleBargain: false
  },
  async onLoad(options) {
    app.globalData.isRefreshOrderTrip = true
    this.setData({
      bookingId: options.bookingId
    })
    showLoading()
    await this.init()
  },
  async init() {
    try {
      let userInfo = await getUserDetail()
      let orderInfo = await getOrderDetail(this.data.bookingId)
      let cashVip = await getCashVip({
        userId: userInfo.data.platformUser.id
      })
      let isCashVip = false
      if (cashVip && cashVip.data && parseInt(cashVip.data.isVip, 10) === 1) {
        isCashVip = true
      }

      /**
       * 订单实际支付金额大于0，且活动未结束，允许打开砍价活动弹窗
       */
      let visibleBargain = false
      if (orderInfo.data.totalPrice - orderInfo.data.depositPrice > 0) {
        const bargainStatusRes = await getBargainStatus({
          orderId: orderInfo.data.bookingId,
          createrId: userInfo.data.platformUser.id
        })
        const {isEnd, isHousekeeper} = bargainStatusRes.data
        if (!isEnd && !isHousekeeper) {// 活动进行中且用户不是管家，提供砍价活动按钮
          visibleBargain = true
        }
      }

      wx.hideLoading()
      this.setData({
        isCashVip,
        visibleBargain,
        orderInfo: orderInfo.data,
        user: userInfo.data.platformUser
      })
    } catch (e) {
      console.log(e)
      catchLoading(e)
    }
  },
  onShow(){
    this.selectComponent("#im-message").imLogin()
  },
  /**
   * 跳转商务出行
   */
  goToBizVip () {
    wx.redirectTo({
      url: '/pages/business-trip/index/index'
    })
  },
  goToTrip() {
    wx.redirectTo({
      url: '/pages/trip/detail-v2/index?bookingId=' + this.data.bookingId
    })
  },
  keepContact() {
    wx.navigateTo({
      url: '/pages/im/content/content?bookingId=' + this.data.bookingId
    })
  },
  goToRegisterCashVip() {
    gioTrack('booking_success_business');
    wx.navigateTo({
      url: "/pages/web-view/business-trip/index",
    })
  },
  skipToHandInHand(){
    gioTrack('booking_success_hand_in_hand');
    wx.navigateTo({
      url: "/pages/activity/invite-friends-201908/home/index",
    })
  },
  goToPoster(){
    gioTrack('booking_success_modal_poster')
    wx.navigateTo({
      url: "/pages/activity/hand-in-hand-201901/poster/index",
    })
  },
  closeLayer() {
    this.setData({ isShowLayer: false})
    gioTrack('booking_success_modal_close')
  },
  /**
   * 点击参与按钮，就对该订单创建砍价活动
   * @param e
   */
  startBargain(e) {
    gioTrack('book_pay_success_page_start_bargain')
    this.setData({
      visibleBargain: false
    })

    const userInfo = wx.getStorageSync('userInfo');
    const createrId = userInfo.id
    const orderId = this.data.orderInfo.bookingId
    createBargain({orderId, createrId, createrInfo: userInfo}).then(data => {
      if (!data.success) {
        wx.showToast({
          title: data.errorMsg,
          duration: 2000
        })
        return
      }
      const url = `https://i.localhome.cn/v/1908011111356/#/activity?o=${orderId}`;
      const page = `/pages/h5/index?url=${encodeURIComponent(url)}`;
      wx.navigateTo({
        url: page
      })
    })
  },
  closeBargainDialog() {
    this.setData({
      visibleBargain: false
    })
  },
  gioTrack() {
    gioTrack('booking_success_modal_friend')
  },
  formSubmit(e) {
    const formId = e.detail.formId
    reportFormid({
      formId,
      type:1,
    })
  }
})
