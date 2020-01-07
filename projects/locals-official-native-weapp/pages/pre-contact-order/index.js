const { getDiffDays, showLoading, catchLoading } = require('../../utils/util')
const { orderCalculate, newConsulting } = require('../../server/order')
const { getHouseCalendarDetail } = require('../../server/housing')
const { getImOrderDetail } = require('../../server/im')
const { getHouseDetail } = require('../../server/housing');
const moment = require('../../utils/dayjs.min.js');
const app = getApp()

Page({
  data: {
    isFullScreen: app.globalData.isFullScreen,
    bookingRequest: null,
    houseInfo: null,
    payTotalPrice: '',
    houseSourceId: '',
    personCount: 1,
    checkinStartDate: null,
    checkinEndDate: null,
    checkinDays: null,
    textareaValue: '',
    submitLoading: false,
    isShowTextarea: false,
    displayButton: true
  },
  onLoad (options) {
    this.setData({
      houseSourceId: options.houseSourceId || '',
      isFromLotel: options.from === 'lotel'
    })
  },
  _cancelEventFn() {
    // 解决areatext原生组件层级问题
    this.setData({
      displayButton: false,
      isShowTextarea: true
    })
    this.getHouseData()
  },
  onShow () {
    showLoading('等待中...')
    this.selectComponent("#auth-drawer-box").checkRole()
    this.selectComponent("#im-message").imLogin()
    let { beginDate: searchStartDate, endDate: searchEndDate } = app.globalData.searchParams.dateParams;
    let checkinDays = getDiffDays(searchStartDate, searchEndDate)
    
    this.setData({
      checkinStartDate: searchStartDate,
      checkinEndDate: searchEndDate,
      checkinDays
    })
  },
  //获取房源详情信息
  getHouseData() {
    showLoading()
    getHouseDetail(this.data.houseSourceId)
      .then(res => {
        wx.hideLoading();
        let houseInfo = res.data;
        const isForeignCity = (houseInfo.allTag || []).some(i => i.tagName === '海外民宿');
        this.setData({
          houseInfo,
          isForeignCity,
          // textareaValue: isForeignCity ? '您好，希望入住您的房源' : '房东您好，希望入住您的房源'
        })
        wx.setNavigationBarTitle({
          title: isForeignCity ? '联系预订' : '联系管家'
        })
      })
      .catch((e) => {
        catchLoading(e)
      })
  },
  getCheckinPersons (e) {
    this.setData({
      personCount: e.detail.value
    })
  },
  submit () {
    if (this.data.submitLoading) {
      return false
    }
    this.calculateOrder()
  },
  calculateOrder () {
    let { beginDate: searchStartDate, endDate: searchEndDate } = app.globalData.searchParams.dateParams;
    let bookingCriteria = {
        checkinDate: moment(searchStartDate).format('YYYY-MM-DD'),
        checkoutDate: moment(searchEndDate).format('YYYY-MM-DD'),
    }
    // 将按钮disabled
    this.setData({
      submitLoading: true
    })

    // 获取房源价格详情 (每晚价格，清洁费等)
    getHouseCalendarDetail(this.data.houseSourceId, bookingCriteria)
      .then(response => {
        const param = {
          "nightPrices": response.data.nightPrices,
          "clearPrice": response.data.clearPrice || 0,
          "deposit": response.data.deposit || 0,
          "houseSourceId": response.data.houseId,
          "checkinDate": searchStartDate,
          "checkoutDate": searchEndDate,
          "currency": "CNY"
        }
        return {response, param}
      })
      .then(res => {
        let { response, param } = res

        // 计算总价
        orderCalculate(param)
          .then(res => {
            let bookingDetail = res.data
            response.data.clearPrice = bookingDetail.clearPrice
            response.data.servicePrice = bookingDetail.servicePrice
            response.data.totalPrice = bookingDetail.totalPrice
            response.data.roomPrice = bookingDetail.roomPrice
            response.data.deposit = bookingDetail.deposit
            response.data.discountAmount = bookingDetail.discountAmount
            response.data.couponAmount = bookingDetail.couponAmount
            // 设置data后执行创建咨询单
            this.setData({
              bookingRequest: response.data,
              payTotalPrice: response.data.totalPrice
            })
            this.newConsulting()
            wx.hideLoading()
          })
          .catch((e) => {
            this.setData({
              submitLoading: false
            })
            catchLoading(e)
          })
      })
      .catch((e) => {
        catchLoading(e.errorDetail + ',请重新选择日期~')
        setTimeout(this.bindDateSelectTap, 1000)
      })
  },
  newConsulting() {
    const { bookingRequest, houseSourceId, checkinStartDate, checkinEndDate, personCount, houseInfo } = this.data
    let userInfo = app.globalData.userInfo

    let bookingInfoPlus = {
      bookingMemberId: userInfo.id,
      bookingMemberName: userInfo.nickName,
      bookingMemberMobile: userInfo.mobile,
      bookingMemberEmail: userInfo.email,
      nightPrices: bookingRequest.nightPrices,
      roomPrice: bookingRequest.roomPrice,
      clearPrice: bookingRequest.clearPrice,
      servicePrice: bookingRequest.servicePrice,
      deposit: bookingRequest.deposit,
      totalPrice: bookingRequest.totalPrice,
      houseSourceId: houseSourceId,
      title: bookingRequest.title,
      checkinDate: checkinStartDate,
      checkoutDate: checkinEndDate,
      houseImage: bookingRequest.houseImage || '无',
      assistId: bookingRequest.assistId,
      source: 'MINI_PROGRAM',
      houseType: bookingRequest.houseType || '无',
      bedNumber: houseInfo.bedNumber,
      roomNumber: houseInfo.roomNumber,
      toiletNumber: houseInfo.toiletNumber,
      publicToiletNumber: houseInfo.publicToiletNumber,
      houseTenantNumber: bookingRequest.tenantNumber,
      cityCode: bookingRequest.cityCode || '无',
      cityName: bookingRequest.cityName || '无',
      countryName: bookingRequest.countryName || '无',
      buId: bookingRequest.buId,
      buName: bookingRequest.buName,
      buPhone: bookingRequest.buPhone,
      cityEnName: bookingRequest.cityEnName || '无',
      countryCode: bookingRequest.countryCode || '无',
      houseManagerId: bookingRequest.houseManagerId,
      consultingMessage: this.data.textareaValue || '您好，希望入住您的房源',
      tenantNumber: personCount,
      memberLabel: bookingRequest.memberLabel || '无',
      address: bookingRequest.address || '无',
      houseNo: bookingRequest.houseNo
    }

    // 创建新订单
    newConsulting(bookingInfoPlus)
      .then(res => {
        wx.hideLoading()
        let bookingId = res.data
        // 轮训获取咨询订单后再跳转至IM
        this.loopTimes = 0
        this.interId = null
        this.loopGetImOrderDetail(bookingId)
      })
      .catch(e => {
        catchLoading(e)
        this.setData({
          submitLoading: false
        })
      })
  },

  loopGetImOrderDetail (bookingId) {
    // 轮训失败5次抛出错误并停止轮训

    // 根据订单换取 sessionID
    this.interId = setInterval(() => {
      getImOrderDetail(bookingId)
          .then(res => {
            let { assistantId, houseSourceId, orderId } = res.data
            this.setData({
              submitLoading: false
            })
            // 使im列表页面进入时刷新
            app.globalData.isReloadConversations = true 
            wx.redirectTo({
              url: `../im/content/content?assistId=${assistantId}&houseSourceId=${houseSourceId}&bookingId=${orderId}`
            })
            clearInterval(this.interId)
          })
          .catch(e => {
            this.loopTimes++
            if (this.loopTimes === 10) {
              this.setData({
                submitLoading: false
              })
              catchLoading(`网络不稳定,[${bookingId}]`)
              clearInterval(this.interId)
            }
          })
    }, 1000)
  },
  bindinput(e) {
    this.setData({
      textareaValue: e.detail.value
    })
  },
  bindDateSelectTap() {
    this.setData({
      submitLoading: false
    })
    wx.navigateTo({
      url: '/pages/housing/date-select/date-select?houseId=' + this.data.houseInfo.id
    })
  },
})