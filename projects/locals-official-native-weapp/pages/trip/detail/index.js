const { getOrderDetail, miniPay, refundPrice, refund, payByCash, cancelOrder } = require('../../../server/order')
const { getHouseSimpleDetail, getHouseDetail, checkStock, fetchForeignRuleText } = require('../../../server/housing')
const { showLoading, catchLoading, getDiffDays, processFloat,gioTrack } = require('../../../utils/util')
const { deleteBargainOrder } = require('../../../server/hd')
const moment = require('../../../utils/dayjs.min.js')
const { specialList, orderStatusDictionary, memberCardInfo } = require('../../../utils/dictionary')
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')
const app = getApp()

Page({
  data: {
    isFullScreen: app.globalData.isFullScreen,
    bookingId: null,
    bookingDetail: {},
    houseDetail: {},
    displayPay: false,
    days: null,
    showFeedBackTips: true, //行李寄存提示
    markers: [],
    presentLongitude: 0, //地图显示的位置
    presentLatitude: 0,   //地图显示的位置,
    staticMap: '',
    timeLineList: [],
    currentStep: 0,
    refundPrice: 0,
    isShowCancelOrder: false,
    overplusTime: null,
    // 已优惠金额
    preferentialAmount: 0,
    // 意外险单人金额
    accidentAmount: 12,
    accidentAmountTotal: 0,
    specialInfoList: [], //特殊设施信息,
    // 是否使用储值支付
    isUseStoredMoney: false,
    payTotalPrice: 0,
    userInfo: null,
    isCanContactLoadlord: false,
    address: '',
    isForeignCity: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      bookingId: options.bookingId || ''
    })
  },
  onReady() {
    this.selectComponent("#im-message").imLogin()
    showLoading()
    this.getOrderDetailInfo()
  },
  onUnload() {
    clearInterval(this.overplusId)
  },
  contactLoadlords() {
    wx.navigateTo({
      url: '/pages/im/content/content?bookingId=' + this.data.bookingId
    })
  },
  setTimeLineList() {
    let { bookingDetail } = this.data
    let currentMoment = moment()
    let bookingDate = moment(bookingDetail.bookingDate)
    let checkinBeforeFiveDays = moment(bookingDetail.checkinDate).add(-5, 'day')
    let checkinDate = moment(bookingDetail.checkinDate)
    let checkinDate12clock = checkinDate.format('YYYY-MM-DD 12:00:00')
    let checkoutDate = moment(bookingDetail.checkoutDate)

    let step1 = moment(checkinBeforeFiveDays.format('YYYY-MM-DD 15:00:00')).isBefore(currentMoment)
    let step2 = moment(checkinDate12clock).isBefore(currentMoment)
    let step3 = currentMoment.isAfter(checkoutDate)

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
    if (step3) {
      this.setData({
        currentStep: 3
      })
    }

    let timeLineList = [
      {
        id: 0,
        success: true,
        lineDescript: '取消订单退房费100%',
        timeDescript: '预订成功',
        date: bookingDate.format('YYYY.MM.DD')
      },
      {
        id: 1,
        success: step1,
        lineDescript: '取消订单退房费50%',
        timeDescript: '入住前5天',
        date: checkinBeforeFiveDays.format('YYYY.MM.DD 15:00')
      },
      {
        id: 2,
        success: step2,
        lineDescript: '退订后24小时\n未住天数退50%房费',
        timeDescript: '入住当天',
        date: checkinDate.format('YYYY.MM.DD 15:00')
      },
      {
        id: 3,
        success: step3,
        timeDescript: '离店当天',
        date: checkoutDate.format('YYYY.MM.DD')
      }
    ]
    this.setData({
      timeLineList
    })
  },
  onPullDownRefresh() {
    this.getOrderDetailInfo()
  },
  loopOverplusTime(endTime) {
    return () => {
      let currentDate = new Date()
      let newTime = currentDate.getTime()
      let obj = null
      if (newTime - endTime < (15*60*1000)){
        let time = ((15*60*1000) -(newTime - endTime)) / 1000;
        let day = parseInt(time / (60 * 60 * 24))
        let hou = parseInt(time % (60 * 60 * 24) / 3600)
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60)
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60)
        if(hou < 10){
          hou = '0' + hou
        }
        if(min < 10){
          min = '0' + min
        }
        if(sec < 10){
          sec = '0' + sec
        }
        obj = {
          day: day,
          hou: hou,
          min: min,
          sec: sec
        }
        this.setData({
          overplusTime: obj
        })
      }else{
        clearInterval(this.overplusId)
      }
    }
  },
  doLoopOverplusTime(time) {
    this.overplusId = setInterval(this.loopOverplusTime(time), 1000)
  },
  getOrderDetailInfo() {
    getOrderDetail(this.data.bookingId)
      .then(res => {
        let { data } = res
        let days = getDiffDays(data.checkinDate, data.checkoutDate)
        let displayPay = false
        let orderStatus = data.orderStatus.toString()
        let isRefunding = data.refundStatus == '6'
        let barTitle = orderStatusDictionary[orderStatus]
        wx.setNavigationBarTitle({
          title: barTitle
        })
        // 设置时间格式
        data['bookingDate'] = moment(data.bookingDate).format('YYYY/MM/DD HH:mm:ss')
        // 待入住和已入住时显示取消订单或在线客服
        let refundOrderArray = ['1107', '1207', '1208']
        // 待付款 同意预订 拒绝预订
        let cancelOrderArray = ['1102', '1201', '1210']
        // 已支付 和 同意预订显示联系管家
        let canContactLoadlordArray = ['1101', '1201', '1210', '1207', '1208']
        this.setData({
          isShowCancelOrder: cancelOrderArray.indexOf(orderStatus) > -1,
          isCanContactLoadlord: canContactLoadlordArray.indexOf(orderStatus) > -1,
          isShowRefundOrder: refundOrderArray.indexOf(orderStatus) > -1
        })
        if (orderStatus === '1101' || orderStatus === '1102' || orderStatus === '1201') {
          displayPay = true
        }
        if (isRefunding) {
          refundPrice({orderNo: this.data.bookingId})
            .then(res => {
              this.setData({
                refundPrice: res.data
              })
            })
        }
        if (!data.guestViews) {
          data.guestViews = []
        }
        if (!data.nightPriceViews) {
          data.nightPriceViews = []
        }
        let accidentAmountTotal = processFloat(this.data.accidentAmount * data.guestViews.length * data.nightPriceViews.length)
        accidentAmountTotal = accidentAmountTotal ? accidentAmountTotal : 0
         
        let preferentialAmount = processFloat(data.discountAmount + data.couponAmount + accidentAmountTotal)

        // 存在购买会员
        if (data.memberBagPrice && data.memberBagId) {
          for (let cardCode in memberCardInfo) {
            if (memberCardInfo.hasOwnProperty(cardCode) && memberCardInfo[cardCode].buyId === data.memberBagId) {
              data.buyMemberBagText = `购买${memberCardInfo[cardCode]['memberCardName']}会员`
              break
            }
          }
        }

        this.setData({
          bookingDetail: data,
          address: data.address,
          orderStatus,
          days,
          displayPay,
          preferentialAmount,
          accidentAmountTotal,
          isUseStoredMoney: data.useCash,
          payTotalPrice: data.totalPrice
        })
        Promise.all([getHouseDetail(res.data.houseSourceId), getHouseSimpleDetail(res.data.houseSourceId)])
          .then(values => {
            let houseInfo = values[0]
            let houseSimple = values[1]
            this.getHouseDictionary(houseInfo.data.facilities)
            this.setData({
              houseDetail: {...houseInfo.data, ...houseSimple.data}
            })
            // 设置退订政策时间轴
            this.setTimeLineList()
            wx.hideLoading()
            wx.stopPullDownRefresh()
            // 通过是否有海外房源标签判断是否海外房源
            const allTags = houseInfo.data.allTag || []
            const tag = allTags.filter(item => item.tagName === "海外民宿")
            this.setData({
              isForeignCity: tag.length !== 0 ? true : false
            })
            // 获取国外详情的入住须知和规则文案
            if (tag.length !== 0) {
              this.getForeignRuleText();
            }
          })
          .catch(e => {
            console.log(e)
            wx.stopPullDownRefresh()
            catchLoading(e)
          })
      })
      .catch(e => {
        console.log(e)
        catchLoading(e)
      })
  },
  //显示隐藏提示语
  onShowFeedBackTips: function(){
    if (this.data.showFeedBackTips){
      this.setData({
        showFeedBackTips: false
      });
      setTimeout(() => {
        this.setData({
          showFeedBackTips: true
        });
      }, 5000)
    } 
  },
  //打开地图层
  onOpenMapPage: function(){
    let { houseDetail, address } = this.data

    if (houseDetail['location']) {
      let locationArray = houseDetail['location'].split(',')
      houseDetail['latitude'] = locationArray[0]
      houseDetail['longitude'] = locationArray[1]
    }

    wx.openLocation({
      latitude: parseFloat(houseDetail.latitude),
      longitude: parseFloat(houseDetail.longitude),
      name: houseDetail.title,
      address,
      scale: 15
    })
  },
  callPhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone
    })
  },
  // 取消订单
  bookingCancel() {
    let params = {
      orderNo: this.data.bookingId
    }
    wx.showModal({
      title: '提示',
      content: '是否取消订单?',
      success: res => {
        if (res.confirm) {
          showLoading()
          cancelOrder(params)
            .then(_ => {
              app.globalData.isRefreshOrderTrip = true
              wx.hideLoading()
              this.getOrderDetailInfo()
              wx.showToast({
                icon: 'success',
                title: '取消成功!'
              })
              gioTrack('trip_cancel_order');
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
    let params = {
      orderNo: this.data.bookingId
    }
    showLoading()
    refundPrice(params)
      .then(res => {
        this.setData({
          refundPrice: res.data
        })
        wx.showModal({
          title: '确定取消订单吗？',
          content: `现在取消订单可获￥${res.data}退款`,
          cancelText: '放弃',
          confirmText: '确定取消',
          success: res => {
            if (res.confirm) {
              refund(params)
                .then(res => {
                  showLoading()
                  // 退款成功，删除砍价活动数据
                  deleteBargainOrder(params.orderNo)
                  // 退款成功, 刷新页面
                  this.getOrderDetailInfo()
                  app.globalData.isRefreshOrderTrip = true
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
  async payByCash(bookingId) {
    showLoading()
    try {
      let result = await payByCash(bookingId)
      if (result && result.success) {
        wx.hideLoading()
        wx.redirectTo({
          url: '/pages/order/book-pay-success/index?&bookingId=' + bookingId
        })
      }
    } catch(e) {
      catchLoading(e)
    }
  },
  nowBooking() {
    let { bookingDetail, bookingId } = this.data
    let { houseSourceId, checkinDate, checkoutDate } = bookingDetail
    let params = {
      checkInDate: moment(checkinDate).format('YYYY-MM-DD'),
      checkOutDate: moment(checkoutDate).format('YYYY-MM-DD')
    };
    
    // 房东已同意跳转闪订页
    if (bookingDetail.orderStatus === "1201") {
      wx.redirectTo({
        url: `/pages/order/order-v2/index?bookingId=${bookingId}&houseSourceId=${houseSourceId}&checkinStartDate=${checkinDate}&checkinEndDate=${checkoutDate}&from=consulting`
      })
    } else {
      checkStock(houseSourceId, params)
        .then(res => {
          if (res.data) {
            wx.showLoading({
              title: '支付中...',
            })
            this.weixinPay()
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '亲，手慢了，漂亮的房子已被订走。下次看好了尽快支付确认订单哦！',
              confirmText: '知道了',
              showCancel: false,
              success: () => {
                // TODO: 前往相同城市日期的房源列表。
              }
            })
          }
        })
        .catch(e => {
          catchLoading(e.errorDetail || e)
        })
    }
  },
  weixinPay() {
    let { isUseStoredMoney, payTotalPrice, bookingDetail } = this.data
    // 如果是完全储值支付，则调用接口
    if (isUseStoredMoney && payTotalPrice === 0) {
      this.payByCash(bookingDetail.bookingId)
      return false
    }
    let openId = wx.getStorageSync('openId')
    let params = {
      accountId: 7,
      isInvoice: bookingDetail.isNeedInvoice == '1' ? true : false,
      amount: bookingDetail.totalPrice,
      outTradeNo: bookingDetail.bookingId,
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
            getApp().mtj.trackEvent('pending_pay_success');
            wx.redirectTo({
              url: '/pages/order/book-pay-success/index?bookingId=' + this.data.bookingDetail.bookingId
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
  goToHouseDetail() {
    wx.navigateTo({
      url: '/pages/housing/detail/index?houseId=' + this.data.bookingDetail.houseSourceId
    })
  },
  goToRule() {
    wx.navigateTo({
      url: '/pages/tipspage/rules/index'
    })
  },
  showInvoiceTip() {
    wx.showModal({
      icon: 'none',
      title: '发票服务费',
      content: '开票金额6%',
      showCancel: false,
      confirmText: '知道了'
    })
  },
  showServiceTip() {
    wx.showModal({
      icon: 'none',
      title: '预订服务费',
      content: '（房费+清洁费) * 5%，最低10元',
      showCancel: false,
      confirmText: '知道了'
    })
  },
  showDepositTip() {
    wx.showModal({
      icon: 'none',
      title: '保证金',
      content: '由Locals路客暂时保管，如果管家在您退房后+1天内没有提出损坏赔偿，将立即原路返还。',
      showCancel: false,
      confirmText: '知道了'
    })
  },
  //封装特殊功能信息
  getHouseDictionary(canSpecialList){
    // 存在此设施数组说明能够做，例如设施中存在 容许做饭的code，则不用在此项前添加“不”
    const canSpecialArray = canSpecialList.map(item => item.code)
    const special = JSON.parse(JSON.stringify(specialList))
    let landlordRequest = []
    special.forEach(item => {
      let { code, name, mustExecuted } = item
      if (!mustExecuted && !canSpecialArray.includes(item.code)) {
        name = '不' + name
      }
      landlordRequest.push({
        code,
        name,
      })
    })
    this.setData({
      specialInfoList: landlordRequest
    })
  },
  // 获取外国房源规则须知
  async getForeignRuleText() {
    const { data } = await fetchForeignRuleText();
    const { OrderCheckInRules, OrderTradingRules } = (data || {});
    this.setData({
      OrderTradingRules,
      OrderCheckInRules,
    })
  },
  goToUnsubscribe() {
    const { bookingId, isShowCancelOrder, isShowRefundOrder, currentStep } = this.data;
    // 当isShowRefundOrder为true,并且currentStep小于2时，扣50%房费取消订单
    const flagRefundOrder = isShowRefundOrder && currentStep < 2;
    const url = `/pages/tipspage/unsubscribe/index?bookingId=${bookingId}&isShowCancelOrder=${isShowCancelOrder}&isShowRefundOrder=${flagRefundOrder}`;
    wx.navigateTo({ url });
  }
})
