const { getGuaranteeSlipList, getOrderDetail, miniPay, refundPrice, refund, payByCash, cancelOrder, delTrip } = require('../../../server/order')
const { getHouseSimpleDetail, getHouseDetail, checkStock, fetchForeignRuleText } = require('../../../server/housing')
const { showLoading, catchLoading, getDiffDays, processFloat, gioTrack, switchNavigate } = require('../../../utils/util')
const { deleteBargainOrder } = require('../../../server/hd')
const { reportFormid } = require('../../../server/message')
const moment = require('../../../utils/dayjs.min.js')
const { specialList, orderStatusDictionary, memberCardInfo } = require('../../../utils/dictionary')
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')
const openDocument = require('../../../utils/open-document');
const app = getApp()

Page({
  data: {
    isFullScreen: app.globalData.isFullScreen,
    bookingId: null,
    barTitle: '',
    bookingDetail: {},
    houseDetail: {},
    displayPay: false,
    days: null,
    showFeedBackTips: true, //行李寄存提示
    markers: [],
    presentLongitude: 0, //地图显示的位置
    presentLatitude: 0,   //地图显示的位置,
    staticMap: '',
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
    isCurrentCheckIn: false,
    //投保人信息
    guaranteeSlipList: [], 
    showToastGridBtns: false
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
  onShow() {
    if(this.selectComponent("#auth-drawer-box")){
      this.selectComponent("#auth-drawer-box").checkRole()
    }else{
      this._cancelEventFn()
    }
  },
  onUnload() {
    clearInterval(this.overplusId)
  },
  // 获取token后执行的回调
  _cancelEventFn() {
    this.selectComponent("#im-message").imLogin()
    showLoading()
    this.getOrderDetailInfo()
  },
  async loadGuestStatusList(orderNo) {
    let { guaranteeSlipList } = this.data;
    const { data } = await getGuaranteeSlipList(orderNo);
    if (!data || !data.length) {
      wx.showToast({
        title: '查询入住人',
        icon: 'success', // loading
        duration: 1500,
        mask: true
      });
      return;
    }
    guaranteeSlipList.forEach(item => {
      data.forEach(slipItem => {
        if (slipItem.cardNo && slipItem.cardNo === item.cardNo) {
          item.policyNo = slipItem.policyNo
          item.downLoadUrl = slipItem.downLoadUrl
          item.message = slipItem.message
        }
      })
    })
    this.setData({
      guaranteeSlipList: guaranteeSlipList
    });
  },
  contactLoadlords() {
    gioTrack('order_detail_contact')
    wx.navigateTo({
      url: '/pages/im/content/content?bookingId=' + this.data.bookingId
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
      if (newTime - endTime < (15 * 60 * 1000)) {
        let time = ((15 * 60 * 1000) - (newTime - endTime)) / 1000;
        let day = parseInt(time / (60 * 60 * 24))
        let hou = parseInt(time % (60 * 60 * 24) / 3600)
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60)
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60)
        if (hou < 10) {
          hou = '0' + hou
        }
        if (min < 10) {
          min = '0' + min
        }
        if (sec < 10) {
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
      } else {
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
        });

        // 设置时间格式
        data['bookingDate'] = moment(data.bookingDate).format('YYYY/MM/DD HH:mm')
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
          // 订单待支付状态加个埋点
          gioTrack('order_detail_await_pay')
        }
        if (isRefunding) {
          refundPrice({ orderNo: this.data.bookingId })
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

        // 不计算保险金额
        let preferentialAmount = processFloat(data.discountAmount + data.couponAmount)

        // 存在购买会员
        if (data.memberBagPrice && data.memberBagId) {
          for (let cardCode in memberCardInfo) {
            if (memberCardInfo.hasOwnProperty(cardCode) && memberCardInfo[cardCode].buyId === data.memberBagId) {
              data.buyMemberBagText = `升级${memberCardInfo[cardCode]['memberCardName']}会员`
              data.buyMemberBagCode = cardCode;
              break
            }
          }
        }
        const currentDateTime = new Date().getTime();
        const startDate = moment(data.checkinDate).format('YYYY-MM-DD') + ' 00:00:00'
        // 判断当前日期是否在入住中的范围
        const isCurrentCheckIn = (moment(startDate).valueOf()) < currentDateTime && currentDateTime  < data.checkoutDate;
        const guaranteeSlipList = data.guestViews;

        this.setData({
          bookingDetail: data,
          address: data.address,
          orderStatus,
          days,
          displayPay,
          preferentialAmount,
          accidentAmountTotal,
          isUseStoredMoney: data.useCash,
          payTotalPrice: data.totalPrice,
          barTitle,
          isCurrentCheckIn, 
          guaranteeSlipList
        })
        // 获取投保人信息
        this.loadGuestStatusList(data.bookingNumber);
        Promise.all([getHouseDetail(res.data.houseSourceId), getHouseSimpleDetail(res.data.houseSourceId)])
          .then(values => {
            let houseInfo = values[0]
            let houseSimple = values[1]
            this.getHouseDictionary(houseInfo.data.facilities)
            this.setData({
              houseDetail: { ...houseInfo.data, ...houseSimple.data }
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
  onShowFeedBackTips: function () {
    if (this.data.showFeedBackTips) {
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
  onOpenMapPage: function () {
    let { houseDetail, address, isCurrentCheckIn } = this.data

    if (houseDetail['location']) {
      let locationArray = houseDetail['location'].split(',')
      houseDetail['latitude'] = locationArray[0]
      houseDetail['longitude'] = locationArray[1]
    }

    wx.openLocation({
      latitude: parseFloat(houseDetail.latitude),
      longitude: parseFloat(houseDetail.longitude),
      name: houseDetail.title,
      address: isCurrentCheckIn ? address : '', // 在入住时间里，才把地址传到地图上
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
      title: '确定取消?',
      content: '此房源很抢手，再考虑一下呗?',
      cancelText: '考虑一下',
      confirmText: '确认取消',
      cancelColor: '#333333',
      confirmColor: '#333333',
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
    const { bookingDetail } = this.data;
    showLoading()
    refundPrice(params)
      .then(res => {
        this.setData({
          refundPrice: res.data
        })
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
                  this.getOrderDetailInfo()
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
    } catch (e) {
      catchLoading(e)
    }
  },
  nowBooking(e) {
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
    // 上报formid
    const formId = e.detail.formId
    this.reportFormidFn(formId)
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
            this.reportFormidFn(res.data.pkg,2)
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
    gioTrack('order_detail_rule')
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
  getHouseDictionary(canSpecialList) {
    // 存在此设施数组说明能够做，例如设施中存在 容许做饭的code，则不用在此项前添加“不”
    const canSpecialArray = canSpecialList.map(item => item.code)
    const special = JSON.parse(JSON.stringify(specialList))
    let landlordRequest = []
    special.forEach(item => {
      let { code, name, mustExecuted } = item
      let consent = true;
      if (!mustExecuted && !canSpecialArray.includes(item.code)) {
        name = '不' + name
        consent = false;
      }
      landlordRequest.push({
        consent,
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
  },
  goToUnsubscribe() {
    gioTrack('order_detail_Unsubscribe')
    const { 
      bookingId,
      isShowCancelOrder,
      isShowRefundOrder, 
      currentStep, 
      bookingDetail
    } = this.data;
    if (bookingDetail.originalPrice === 0) {
      wx.showModal({
        icon: 'none',
        title: '退订政策',
        content: '本订单使用优惠券抵扣支付订单全款，订单不可修改，不可取消。',
        showCancel: false,
        confirmText: '知道了'
      });
      return;
    }
    // 当isShowRefundOrder为true,并且currentStep小于2时，扣50%房费取消订单
    const flagRefundOrder = isShowRefundOrder && currentStep < 2;
    const url = `/pages/tipspage/unsubscribe/index?bookingId=${bookingId}&isShowCancelOrder=${isShowCancelOrder}&isShowRefundOrder=${flagRefundOrder}`;
    wx.navigateTo({ url });
  },
  showDepositTip() {
    getApp().mtj.trackEvent('order_deposit_tip');
    wx.showModal({
      icon: 'none',
      title: '保证金',
      content: '由Locals路客暂时保管，如果管家在您退房后+1天内没有提出损坏赔偿，将立即原路返还。',
      showCancel: false,
      confirmText: '知道了'
    })
  },
  goToPriceDetail() {
    const {
      bookingDetail,
      accidentAmountTotal,
      selectCoupon,
      recommendBuy,
      payTotalPrice,
      userInfo
    } = this.data;
    // 封装费用明细参数
    wx.setStorageSync('locals_mini_order_price_detail', {
      nightPrices: bookingDetail.nightPriceViews,
      roomPrice: bookingDetail.roomPrice,
      clearPrice: bookingDetail.clearPrice,
      deposit: bookingDetail.deposit,
      memberBagCode: userInfo.memberCardCode, // 当前会员Code
      buyMemberBagPrice: bookingDetail.memberBagPrice,
      buyMemberBagText: bookingDetail.buyMemberBagText,
      buyMemberBagCode: bookingDetail.buyMemberBagCode, // 购买的会员code
      accidentAmountTotal,
      couponName: '优惠券',
      couponAmount: bookingDetail.couponAmount,
      discountAmount: bookingDetail.discountAmount,
      useCash: bookingDetail.useCash,
      useCashMoney: bookingDetail.useCashMoney,
      payTotalPrice
    });
    wx.navigateTo({
      url: '/pages/order/order-price/index'
    })
  },
  goToHelpPage(e){
    const query = e.target.dataset.query;
    // 退订政策
    if (query === 'q100') {
      this.goToUnsubscribe();
      return;
    }
    const url = `https://i.localhome.cn/v/1908201731317?qid=${query}`;
    const gourl = `/pages/h5/index?url=${encodeURIComponent(url)}&barTitle=常见问题`;
    wx.navigateTo({
      url: gourl
    })
  },
  goToComment(){
    gioTrack('order_detail_comment_coupon');
    wx.navigateTo({
      url: `/pages/order/evaluation/evaluation?bookingId=${this.data.bookingId}`
    })
  },
  handleCancelOrder(){
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
  // 跳转到入住人员信息页面
  goToGuestDetail(){
    const {bookingDetail, isForeignCity} = this.data;
    wx.navigateTo({
      url: `/pages/order/guest-details/index?orderId=${bookingDetail.bookingId}&isForeignCity=${isForeignCity}`
    })
  },
  // 打开生活馆小程序
  goToLifeMini() {
    gioTrack('order_detail_life')
    const url = 'appid=wx604ac28b988cd4bb&path=/pages/home/dashboard/index'
    switchNavigate(url);
  },
  handleFooterGirdBtnEvent(e){
    const type = e.currentTarget.dataset.type

    switch (type) {
      case 'onOpenMapPage':
        this.onOpenMapPage()
        break;
      case 'onOpenInvoice':
        wx.navigateTo({
          url: `/pages/mine/invoice/invoice`
        })
        break;
      case 'onOpenComment':
        this.goToComment();
        break;
      case 'onAgainBooking': 
        const { houseDetail } = this.data;
        const startDate = new Date().getTime();
        wx.navigateTo({
          url: `/pages/order/order-v2/index?houseSourceId=${houseDetail.houseSourceId}&checkinStartDate=${startDate}&checkinEndDate=${moment(startDate).add(1, 'day').valueOf()}`
        })
        break;
      case 'onOpenCheckinPassword':
        const { bookingDetail } = this.data;
        if (bookingDetail.doorPassword) {
          wx.showModal({
            icon: 'none',
            title: '本次入住密码',
            content: bookingDetail.doorPassword || '',
            showCancel: false,
            confirmText: '关闭弹窗'
          });
        }else {
          wx.showToast({
            title: '入住当天12点后可见',
            icon: 'none'
          })
        }
        break;
    }
    gioTrack(`order_detail_${type}`)
  },
  delTrip() {
    const bookingId = this.data.bookingId
    wx.showModal({
      title: '确认删除吗？',
      content: '删除后将无法找回此订单信息',
      success(res) {
        if (res.confirm) {
          delTrip(bookingId).then((res) => {
            if (res.success) {
              wx.showToast({
                title: '删除成功！',
                icon: 'success',
                duration: 2000
              })
              app.globalData.isRefreshOrderTrip = true;
              setTimeout(() => {
                wx.navigateBack()
              }, 800)
            }
          })
        }
      }
    })
    gioTrack('order_detail_delTrip')
  },
  openPolicy(e) {
    const { downloadUrl } = e.currentTarget.dataset;
    openDocument(downloadUrl);
  },
  switchToastGridBtns(){
    this.setData({
      showToastGridBtns: !this.data.showToastGridBtns
    })
  },
  gioFn(){ gioTrack('order_detail_invoice')},
  formSubmit(e) {
    const formId = e.detail.formId
    this.reportFormidFn(formId)
  },
  // 上报formid
  reportFormidFn(string,type = 1){
    let formId = string
    if(type === 2){
      const index = string.indexOf('=')
      if(index === -1) return
      formId = string.slice(index+1,string.length)
    }
    reportFormid({
      formId,
      type,
    })
  }
})