const { getOrderDetail, refundPrice, refund, cancelOrder } = require('../../../server/order')
const { showLoading, catchLoading, gioTrack } = require('../../../utils/util')
const moment = require('../../../utils/dayjs.min.js')
const { deleteBargainOrder } = require('../../../server/hd')
const app = getApp();
Page({
  data:{
    isFullScreen: app.globalData.isFullScreen,
    bookingId: '',
    isShowCancelOrder: false,
    isShowRefundOrder: false,
    timeLineList: [],
    bookingDetail: null,
    searchStartDate: null
  },
  onLoad(options) {
    this.setData({
      bookingId: options.bookingId || '',
      searchStartDate: options.searchStartDate || null,
      isShowCancelOrder: options.isShowCancelOrder || false,
      isShowRefundOrder: options.isShowRefundOrder || false,
    });
  },
  onReady() {
    this.getOrderDetailInfo();
    this.setTimeLineList();
  },
  onShow() {
    this.selectComponent("#im-message").imLogin();
  },
  handleCancelOrder() {
    const { isShowCancelOrder, isShowRefundOrder } = this.data; 
    // 全额退款
    if (isShowCancelOrder) {
      this.bookingCancel()
      return;
    }
    // 退款50%
    if (isShowRefundOrder) {
      this.bookingRefund();
      return;
    }
  },
  // 取消订单
  bookingCancel() {
    wx.showModal({
      title: '确定取消?',
      content: '此房源很抢手，再考虑一下呗?',
      cancelText: '考虑一下',
      confirmText: '确认取消',
      cancelColor: '#333333',
      confirmColor: '#333333',
      success: res => {
        if (res.confirm) {
          showLoading()
          cancelOrder({ orderNo: this.data.bookingId})
            .then(_ => {
              app.globalData.isRefreshOrderTrip = true
              wx.hideLoading()
              wx.showToast({
                icon: 'success',
                title: '取消成功!'
              })
              gioTrack('trip_cancel_order')
              wx.navigateBack({ delta: 1 })
            })
            .catch(e => {
              catchLoading(e)
            })
        }
      }
    })
  },
  // 退款
  bookingRefund() {
    showLoading();
    let params = {
      orderNo: this.data.bookingId
    }
    const { bookingDetail } = this.data; 
    refundPrice(params).then(res => {
        wx.showModal({
          title: '确定取消?',
          content: `现在取消订单可获￥${res.data}退款`,
          cancelText: '考虑一下',
          confirmText: '确认取消',
          cancelColor: '#333333',
          confirmColor: '#333333',
          success: res => {
            if (res.confirm) {
              refund(params)
                .then(res => {
                  showLoading()
                  // 退款成功，删除砍价活动数据
                  deleteBargainOrder(params.orderNo)
                  // 退款成功, 刷新页面
                  app.globalData.isRefreshOrderTrip = true
                  wx.navigateBack({ delta: 1 })
                })
                .catch(e => {
                  catchLoading(e)
                })
            }
          }
        })
        wx.hideLoading()
      })
      .catch(e => {
        catchLoading(e)
      })
  },
  getOrderDetailInfo() {
    if (!this.data.bookingId) {
      return;
    }
    getOrderDetail(this.data.bookingId)
      .then(res => {
        let { data } = res
        this.setData({
          bookingDetail: data
        })
        this.setTimeLineList();
      })
      .catch(e => {
        console.log(e)
        catchLoading(e)
      })
  },
  setTimeLineList() {
    let { bookingId, bookingDetail, searchStartDate } = this.data
    let startDate = bookingDetail ? bookingDetail.checkinDate : Number(searchStartDate);
    if (!startDate) {
      return;
    }
    let bookingDate = moment()
    let currentMoment = moment()
    let checkinBeforeFiveDays = moment(startDate).add(-5, 'day')
    console.log(checkinBeforeFiveDays)
    let checkinDate = moment(startDate)
    let checkinDate12clock = checkinDate.format('YYYY-MM-DD 12:00:00')

    let step1 = moment(checkinBeforeFiveDays.format('YYYY-MM-DD 15:00:00')).isBefore(currentMoment)
    let step2 = moment(checkinDate12clock).isBefore(currentMoment)

    if (step1) {
      this.setData({
        currentStep: 1
      })
    }
    if (step2) {
      this.setData({
        currentStep: 2
      })
    }

    const timeDescript1 = checkinBeforeFiveDays !== '' ? `${checkinBeforeFiveDays.format('YYYY.MM.DD 15:00')}` : '';
    const timeDescript2 = checkinDate !== '' ? `${checkinDate.format('YYYY.MM.DD 15:00')}` : '';
    let timeLineList = [{
      id: 0,
      success: true,
      success: !!searchStartDate,
      lineDescript: '免费取消',
      timeDescript: `距离入住≥5天取消`,
      timehint: `（${timeDescript1}前）`
    },
    {
      id: 1,
      success: step1,
      lineDescript: '退全部房费的50%',
      timeDescript: `距离入住＜5天取消`,
      timehint: `（${timeDescript1}～${timeDescript2.substring(5,timeDescript2.length)}）`
    },
    {
      id: 2,
      success: step2,
      lineDescript: '退发生退订24小时后未住房费的50%',
      timeDescript: `入住当天取消或提前退房`,
      timehint: `（${timeDescript2}后）`
    }
    ]
    this.setData({
      timeLineList,
    })
  },
})