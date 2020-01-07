const { getDiffDays, showLoading, catchLoading, processFloat, isHasLogin, getCurrentPageUrl, gioTrack } = require('../../utils/util')
const { orderCalculate, createOrder, miniPay, getAvailableCoupons, payByCash, getBuyVipList } = require('../../server/order')
const { getGuests, getUserDetail, getCashVip, getMemberCard } = require('../../server/mine')
const { getHouseCalendarDetail } = require('../../server/housing')
const { memberCardInfo } = require('../../utils/dictionary')
const regeneratorRuntime = require('../../libs/regenerator-runtime.js')
const moment = require('../../utils/dayjs.min.js')
const { trackingConversionAd } = require('../../server/hd')
const app = getApp()

Page({
  isFirstTimeEntry: false,
  data: {
    isFullScreen: app.globalData.isFullScreen,
    houseCalendarDetail: null,
    bookingRequest: null,
    payTotalPrice: 0,
    houseSourceId: '',
    personCount: 1,
    guestList: [],
    checkinStartDate: null,
    checkinEndDate: null,
    checkinDays: null,
    isHasCoupon: true,
    selectCoupon: null,
    memberCard: null,
    selectInvoice: null,
    isPayPage: false,
    isNeedInvoice: false,
    // 储值支付相关
    isUseStoredMoney: false,
    isCanUseStoredMoney: true,
    // 商务出行
    selectBusiness: false,
    // 默认使用 是否使用会员折扣
    useDiscount: true,
    // 优惠券数量
    couponList: [],
    // 意外险单人金额
    accidentAmount: 12,
    accidentAmountTotal: 0,
    // 已优惠金额:优惠券+保险+折扣
    preferentialAmount: 0,
    // 点击了不使用优惠券
    clickedNotUseCoupoon: false,
    // 控制页面显示
    isShowView: false,
    // 是否来自咨询订单进来的
    isFromConsulting: false,
    // 是否已经选择了优惠券
    isHasSelectBestCoupon: false,
    // 是否已经获取了用户信息
    hasUserInfo: false,
    isShowPrivileges: false,
    // 是否能反现，判断显示“此预订入住退房后反现订单金额1%”
    consumptionOfGold: false,
    isShowUseCashTip: false,
    isShowPriceDetail: false,
    // 按钮等待状态
    loading: false,
    // 是否有房东特别优惠
    specialRoomPriceFlag: false,
    reducePrice: 0,
    isShowBuyVip: false,
    isShowBuyVipList: false,
  },
  onUnload() {
    if (!this.data.isPayPage && this.data.isFromHouseDetail) {
      getApp().mtj.trackEvent('order_back');
      let self = this
      wx.showModal({
        title: '',
        content: '现在预订可以实时确认，如想了解更多也可以联系管家咨询。',
        cancelText: '返回',
        confirmText: '联系管家',
        success(res) {
          if (res.confirm) {
            getApp().mtj.trackEvent('back_contact_landlord');
            gioTrack('order_modal_contact');
            wx.navigateTo({
              url: `/pages/pre-contact-order/index?houseSourceId=${self.options.houseSourceId}`
            })
          }else{
            gioTrack('order_modal_back');
          }
        }
      })
    }
  },
  onLoad(options) {
    // 联系管家进来会有checkinStartDate和checkinEndDate
    let { checkinStartDate, checkinEndDate } = options

    this.setData({
      bookingId: options.bookingId || '',
      houseSourceId: options.houseSourceId || '',
      checkinStartDate: checkinStartDate ? parseInt(checkinStartDate, 10) : '',
      checkinEndDate: checkinEndDate ? parseInt(checkinEndDate, 10) : '',
      isFromConsulting: options.from === 'consulting',
      isFromHouseDetail: options.from === "houseDetail"
    })
    // 每次进来都清空，onshow会自动选择首位入住人,避免用户在创建订单时选择了8人，换一个房屋时限制是4人，此时导致入住人长度大于房屋人数最大值
    app.globalData.selectGuest = []
    showLoading()
    this.selectComponent("#auth-drawer-box").checkRole()
    this.selectComponent("#im-message").imLogin()
  },
  onShow() {
    // 首次进来onLoad已触发,优化除了onLoad进来需要判断是否登录，其他操作不触发登录
    if (this.isFirstTimeEntry) {
      this.signInCallback()
    } else {
      this.isFirstTimeEntry = true
    }
  },
  signInCallback() {
    // isPayPage解决在手机支付时会出现新页面，点击完成返回创建订单页面会触发onShow
    if (isHasLogin() && !this.data.isPayPage) {
      this.setCheckinDate()
      this.init()
    }
  },
  async init() {
    showLoading()
    let { selectGuest, selectInvoice } = app.globalData
    this.setData({
      loading: true,
      guestList: selectGuest
    })
    if (!selectGuest.length) {
      // 长度为空时，获取一位租客
      this.getGuests()
    } else {
      // 设置意外险金额
      this.setAccident()
    }
    let errorStatus = false
    try {
      await this.setUserInfo()
      await this.getHouseCalendarDetail()
    } catch(e) {
      errorStatus = true
      catchLoading(e)
      this.navigateBack()
    }
    if (!errorStatus) {
       // 优惠券和calc接口都需要房晚(nightPrices)数组
      await this.getCoupons()
      await this.calculateOrder()
    }
  },
  async getHouseCalendarDetail() {
    const { checkinStartDate, checkinEndDate, houseSourceId, houseCalendarDetail } = this.data
    const bookingCriteria = {
      checkinDate: moment(checkinStartDate).format('YYYY-MM-DD'),
      checkoutDate: moment(checkinEndDate).format('YYYY-MM-DD'),
    }

    const { data } = await getHouseCalendarDetail(houseSourceId, bookingCriteria)
    this.setData({
      houseCalendarDetail: data
    })
  },
  async calculateOrder() {
    let { checkinStartDate, checkinEndDate, isNeedInvoice, selectInvoice, selectCoupon, bookingId, isUseStoredMoney, houseCalendarDetail, selectedBuyVipId, clickedNotUseCoupoon } = this.data

    const param = {
      nightPrices: houseCalendarDetail.nightPrices,
      clearPrice: houseCalendarDetail.clearPrice,
      deposit: houseCalendarDetail.deposit,
      houseSourceId: houseCalendarDetail.houseId,
      checkinDate: moment(checkinStartDate).format('YYYY-MM-DD'),
      checkoutDate: moment(checkinEndDate).format('YYYY-MM-DD'),
      currency: "CNY",
      memberBagId: selectedBuyVipId || ''
    }
    if (bookingId) {
      param['bookingId'] = bookingId
    }
    if (selectCoupon) {
      param['couponId'] = selectCoupon.id
    }
    if(isNeedInvoice && selectInvoice){
      param['isNeedInvoice'] = isNeedInvoice ? 1 : 0
      param['invoiceTitleId'] = selectInvoice.id
    }
    if (isUseStoredMoney) {
      param['useCash'] = true
      // 订单使用消费金
      param['useCashMoney'] = this.data.canUseCashMoneyForOrder
    }
    showLoading()
    this.setData({
      loading: true
    })
    try {
      const { data: bookingDetail } = await orderCalculate(param)
      // 合并数据
      let bookingRequest = { ...houseCalendarDetail, ...bookingDetail }
      // 暂时：当选择优惠券后响应中并没有优惠折扣，说明优惠券不适合此订单使用
      if (
          selectCoupon
          && (!bookingDetail.couponAmount || parseFloat(bookingDetail.couponAmount) === 0)
        ) {
        wx.showToast({
          title: '订单不适合用此优惠券',
          icon: 'none'
        })
        // 清空优惠券内容
        this.setData({
          selectCoupon: null
        })
      }
      const { roomPrice = 0, clearPrice = 0, discountAmount = 0, couponAmount = 0 } = bookingRequest
      bookingRequest.totalRoomPrice = processFloat(roomPrice + clearPrice)
      // 已优惠
      const preferentialAmount = processFloat(discountAmount + couponAmount)
      const preferentialAmountTotal = processFloat(discountAmount + couponAmount + this.data.accidentAmountTotal);
      bookingRequest.preferentialAmount = preferentialAmount;
      bookingRequest.preferentialAmountTotal = preferentialAmountTotal;

      // 是否与会员折扣排斥
      const isExcludeMemberDiscount = !clickedNotUseCoupoon && bookingRequest.couponAmount > 0 && selectCoupon && selectCoupon.coupon.useRestrictionType == 1

      this.setData({
        // 是否与会员折扣排斥
        isExcludeMemberDiscount,
        bookingRequest,
        payTotalPrice: bookingRequest.totalPrice,
        useDiscount: bookingDetail.discountAmount > 0,
        // 为"1"是不能选择优惠券
        specialRoomPriceFlag: bookingDetail.specialRoomPriceFlag === "1",
        // 是否能反现，判断显示“此预订入住退房后反现订单金额1%”
        consumptionOfGold: parseInt(bookingDetail.consumptionOfGold) === 1,
        canUseCash: bookingDetail.canUseCash,
        // 订单使用消费金
        canUseCashMoneyForOrder: bookingDetail.canUseCashMoneyForOrder,
        preferentialAmount,
        isShowView: true,
        loading: false
      })
      // 房东没有给特别优惠和没有点击不适用优惠券和未自动选择优惠券时
      if (!this.data.specialRoomPriceFlag && !this.data.clickedNotUseCoupoon && !this.data.isHasSelectBestCoupon) {
        this.selectBestCoupon(this.data.couponList)
        this.setData({
          isHasSelectBestCoupon: true
        })
      }

      await this.setBuyVipData()
      wx.hideLoading()
    } catch(e) {
      this.setData({
        loading: false
      })
      catchLoading(e)
    }
  },
  async setUserInfo() {
    const { hasUserInfo } = this.data
    if (!hasUserInfo) {
      const { data } = await getUserDetail({ additionalFields: 'isNew' })
      const { isNew, platformUser = {}, platformUserDetail = {}, userOpenIds } = data
      const userInfo = {
        ...platformUser,
        ...platformUserDetail,
        isNew
      }
      wx.setStorageSync('userInfo', userInfo)
      const { data: memberCard } = await getMemberCard({ code: userInfo.memberCardCode })
      memberCard.discountText = this.setDiscountText(memberCard)
      this.setData({
        memberCard,
        hasUserInfo: true,
      })
    }
  },
  async setBuyVipData() {
    let { memberCard, recommendBuy } = this.data
    const { memberCardName, memberCardCode, discount } = memberCard
    /**
     * 推荐逻辑：
     * 当前普卡、银卡、推荐金卡
     * 当前金卡推荐黑卡
     * 当前黑卡不推荐
     * [x]有购买记录不再推荐
     */
    let buyVipList = []
    const recommendBuyGlod = ['SILVER', 'NORMAL']
    const notRecommend = ['BLACK']
    let vipList = []
    let data = {
      isShowBuyVip: true,
    }
    if (memberCardCode && !notRecommend.includes(memberCardCode)) {
      const buyMemberCardMap = new Map()
      if (!this.buyMemberCardResponse) {
        const response = await getBuyVipList()
        this.buyMemberCardResponse = response.data
        vipList = response.data
      } else {
        vipList = this.buyMemberCardResponse
      }
      vipList && vipList.forEach(item => {
        const { image } =  memberCardInfo[item.memberCardCode]
        item.image = image
        item.memberDiscounts = this.calculateMemberDiscounts(item.discount)
        buyMemberCardMap.set(item.memberCardCode, item)
      })
      data.buyMemberCardMap = buyMemberCardMap
      data.buyVipList = this.getBuyVipData(memberCardCode, buyMemberCardMap)
      if (recommendBuy) {
        // 重新计算后更新推会员的折扣
        data.recommendBuy = buyMemberCardMap.get(recommendBuy.memberCardCode)
      } else {
        if (recommendBuyGlod.includes(memberCardCode)) {
          data.recommendBuy = buyMemberCardMap.get('GOLD')
        } else {
          data.recommendBuy = buyMemberCardMap.get('BLACK')
        }
      }

      this.setData(data)
    }
  },
  selectBuyVip(e) {
    let { buyId, memberCardCode } = e.currentTarget.dataset
    const { selectedBuyVipId, recommendBuy, buyMemberCardMap } = this.data
    let data = {
      isShowBuyVipList: false
    }
    if (memberCardCode !== recommendBuy.memberCardCode) {
      const recommendBuy = buyMemberCardMap.get(memberCardCode)
      getApp().mtj.trackEvent('order_select_member', {
        member_level: recommendBuy.memberCardName,
      });
      data.recommendBuy = recommendBuy
    }
    data.selectedBuyVipId = selectedBuyVipId === buyId ? '' : buyId
    this.setData(data, this.calculateOrder)
  },
  switchBuyVip(e) {
    const { value: isBuyVip } = e.detail
    const { recommendBuy } = this.data
    if (isBuyVip) {
      getApp().mtj.trackEvent('order_toggle_buy_vip');
      gioTrack('order_toggle_buy_vip');
    }
    this.setData({
      selectedBuyVipId: !isBuyVip ? '' : recommendBuy.buyId
    }, this.calculateOrder)
  },
  getBuyVipData(memberCardCode, buyMemberCardMap) {
    const SILVER = buyMemberCardMap.get('SILVER')
    const GOLD = buyMemberCardMap.get('GOLD')
    const BLACK = buyMemberCardMap.get('BLACK')
    switch(memberCardCode) {
      case 'NORMAL':
        return [ SILVER, GOLD, BLACK ]
      case 'SILVER':
        return [ GOLD, BLACK ]
      case 'GOLD':
        return [ BLACK ]
    }
  },
  calculateMemberDiscounts(discount) {
    const { bookingRequest } = this.data
    const { roomPrice, couponAmount } = bookingRequest
    return Math.round((roomPrice - couponAmount) - ((roomPrice - couponAmount) * discount))
  },
  setDiscountText(memberCard) {
    const { memberCardName, memberCardCode, discount } = memberCard
    let text = `您是${memberCardName}会员`;
    if (memberCardCode === 'NORMAL') {
      text += '无折扣';
    } else {
      const discountValue = processFloat(discount * 10, 1)
      text += `房费${discountValue}折`
    }
    return text
  },
  async getCoupons() {
    try {
      if (!this.data.couponList.length) {
        let { checkinStartDate, checkinEndDate, houseCalendarDetail, houseSourceId } = this.data
        let checkInDate = this.setHourOfDate(checkinStartDate, 'in')
        let checkOutDate = this.setHourOfDate(checkinEndDate, 'out')
        let params = {
          available: 1,
          houseSourceId,
          nightPrices: houseCalendarDetail.nightPrices,
          checkInDate: moment(checkInDate).valueOf(),
          checkOutDate: moment(checkOutDate).valueOf(),
        }
        let couponList = await getAvailableCoupons(params)
        this.setData({
          couponList: couponList.data || []
        })
      }
    } catch(e) {
      catchLoading(e)
    }
  },
  setHourOfDate(date, type) {
    const dateTemp = moment(parseInt(date, 10)).format('YYYY-MM-DD');
    switch(type) {
      case 'in':
        return `${dateTemp} 14:00:00`
      case 'out':
        return `${dateTemp} 12:00:00`
    }
  },
  async payByCash(bookingId) {
    showLoading()
    try {
      let result = await payByCash(bookingId)
      if (result && result.success) {
        wx.hideLoading()
        this.setData({
          isPayPage: true
        })
        wx.redirectTo({
          url: './book-pay-success/index?&bookingId=' + bookingId
        })
      }
    } catch(e) {
      catchLoading(e)
    }
  },
  payAndBookingPlus() {
    let openId = wx.getStorageSync('openId')
    // 没有openId提示删除小程序重新登录
    if (!openId) {
      wx.showToast({
        title: '没有openId,请删除小程序重新登录!',
        icon: 'none'
      })
      return false
    }
    // 登录calculateOrder
    if (this.data.loading) {
      return false
    }
    // 判断入住人数与选择的入住人列表数量是否匹配
    const { guestList, personCount, bookingRequest, selectCoupon, houseSourceId, checkinStartDate, checkinEndDate, bookingId, isUseStoredMoney, selectedBuyVipId } = this.data

    if (!guestList || !guestList.length) {
      wx.showToast({
        title: '请添加入住人',
        icon: 'none'
      })
      return false
    }
    if (guestList.length > bookingRequest.tenantNumber) {
      wx.showToast({
        title: `当前民宿最大可住人数 ${bookingRequest.tenantNumber} 人`,
        icon: 'none'
      })
      return false
    }
    let guestId = guestList.map(item => item.guestId)

    let bookingInfoPlus = null

    try {
      const userInfo = wx.getStorageSync('userInfo')
      bookingInfoPlus = {
        bookingMemberId: userInfo.id,
        bookingMemberName: userInfo.nickName,
        bookingMemberMobile: userInfo.mobile,
        bookingMemberEmail: userInfo.email,
        bookingId: bookingId || '',
        nightPrices: bookingRequest.nightPrices,
        roomPrice: bookingRequest.roomPrice,
        clearPrice: bookingRequest.clearPrice,
        servicePrice: bookingRequest.servicePrice,
        deposit: bookingRequest.deposit,
        totalPrice: bookingRequest.totalPrice,
        houseSourceId: houseSourceId,
        title: bookingRequest.title,
        checkinDate: moment(checkinStartDate).format('YYYY-MM-DD'),
        checkoutDate: moment(checkinEndDate).format('YYYY-MM-DD'),
        tenantNumber: guestList.length,
        checkinGuestList: guestList,
        houseImage: bookingRequest.houseImage,
        guestId: guestId,
        assistId: bookingRequest.assistId,
        source: 'MINI_PROGRAM',
        houseType: bookingRequest.houseType,
        bedNumber: bookingRequest.bedNumber,
        roomNumber: bookingRequest.roomNumber,
        toiletNumber: bookingRequest.toiletNumber,
        publicToiletNumber: bookingRequest.publicToiletNumber,
        houseTenantNumber: bookingRequest.tenantNumber,
        cityCode: bookingRequest.cityCode,
        cityName: bookingRequest.cityName,
        countryName: bookingRequest.countryName,
        buId: bookingRequest.buId,
        buName: bookingRequest.buName,
        buPhone: bookingRequest.buPhone,
        cityEnName: bookingRequest.cityEnName,
        countryCode: bookingRequest.countryCode,
        houseManagerId: bookingRequest.houseManagerId,
        memberLabel: bookingRequest.memberLabel,
        address: bookingRequest.address,
        houseNo: bookingRequest.houseNo,
        traceId:app.globalData.sid,
        memberBagId: selectedBuyVipId || '',
        sid: selectedBuyVipId ? '4534' : undefined,
      }
      if (selectCoupon && selectCoupon.id) {
        bookingInfoPlus['couponId'] = selectCoupon.id
      }
      if (isUseStoredMoney) {
        bookingInfoPlus['useCash'] = true
        // 订单使用消费金
        bookingInfoPlus['useCashMoney'] = this.data.canUseCashMoneyForOrder
      }
    } catch(e) {
      catchLoading(e)
    }

    showLoading()
    this.setData({
      loading: true
    })
    createOrder(bookingInfoPlus)
      .then(res => {
        /**
         * 如果是点击广告进来的小程序，app.globalData会存有clickId，创建订单成功的时候，做广告数据转化统计回传
         * gio统计广告转化用户的下单操作
         */
        if (app.globalData.clickId !== null) {
          gioTrack('from_ad_to_mini_program_order');
          trackingConversionAd({
            clickId: app.globalData.clickId,
            url: 'http://www.qq.com',
            actionType: 'COMPLETE_ORDER',
            actionValue: bookingRequest.totalRoomPrice
          });
        }

        getApp().mtj.trackEvent('order_pay');
        gioTrack('order_pay');
        const bookingId = res.data.bookingId
        const openId = wx.getStorageSync('openId')
        const { payTotalPrice } = this.data
        const that = this

        console.log('res.data', this.data)

        // 如果是完全储值支付，则调用接口
        if (isUseStoredMoney && payTotalPrice === 0) {
          this.payByCash(bookingId)
          return false
        }

        // 0元支付
        if (payTotalPrice === 0) {
          wx.showModal({
            title: '温馨提示',
            content: '当前使用优惠券抵扣支付订单全款，点击【确认】即可完成订单,成功提交订单不可修改，取消订单优惠券不可退回。',
            confirmText: '确认',
            success({ confirm }) {
              if (confirm) {
                that.successPay(bookingId);
              }
            }
          })
          return;
        }

        const params = {
          accountId: 7,
          isInvoice: false,
          tradeType: 'JSAPI',
          outTradeNo: bookingId,
          amount: payTotalPrice,
          currency: 'CNY',
          source: 'MINI', // 不能修改
          body: '小程序支付',
          openId: openId
        }
        miniPay(params)
          .then(res => {
            let payParams = {
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.pkg,
              signType: res.data.signType,
              paySign: res.data.sign,
              success: () => {
                this.successPay(bookingId);
              },
              fail: () => {
                this.setData({
                  selectCoupon: null,
                  isPayPage: true,
                  loading: true
                })
                wx.redirectTo({
                  url: './book-pay-failed/index?bookingId=' + bookingId + '&startData=' + this.data.checkinStartDate
                })
              }
            }
            wx.requestPayment(payParams)
          })
          .catch(e => {
            catchLoading(e)
          })
      })
      .catch(e => {
        this.setData({
          loading: false
        })
        catchLoading(e)
      })
  },
  successPay(bookingId) {
    this.setData({
      selectCoupon: null,
      isPayPage: true,
      loading: true
    })
    getApp().mtj.trackEvent(this.data.isFromConsulting ? 'contact_landlord_pay_success' : 'flash_order_pay_success')
    wx.redirectTo({
      url: './book-pay-success/index?bookingId=' + bookingId
    })
  },
  setCheckinDate() {
    let { isFromConsulting, checkinStartDate, checkinEndDate } = this.data

    if (isFromConsulting) {
      // 如果是来自咨询单则获取onload获取的时间，并不能重新选择日期
      let checkinDays = getDiffDays(checkinStartDate, checkinEndDate)
      this.setData({
        checkinDays
      })
    } else {
      // 默认是获取全局中的日期，并可重新选择日期，例如用户从分享房源进来的时候可以选择日期
      const { dateParams } = app.globalData.searchParams;
      const { beginDate: searchStartDate, endDate: searchEndDate } = dateParams;

      let checkinDays = getDiffDays(searchStartDate, searchEndDate)
      this.setData({
        checkinStartDate: searchStartDate,
        checkinEndDate: searchEndDate,
        checkinDays
      })
    }
  },
  addGuest() {
    const { bookingRequest } = this.data
    wx.navigateTo({
      url: '/pages/settings/guestlist/guestlist?isOrder=1&maxCount=' + bookingRequest.tenantNumber
    })
  },
  setAccident() {
    let { accidentAmount, guestList, checkinDays } = this.data
    let accidentAmountTotal = processFloat(accidentAmount * guestList.length * checkinDays)
    this.setData({
      accidentAmountTotal: accidentAmountTotal ? accidentAmountTotal : 0
    })
  },
  async getGuests() {
    const { data } = await getGuests()
    const { list } = data
    if (list && list.length > 0) {
      let defaultSelectIndex = 0
      const userInfo = wx.getStorageSync('userInfo')
      // 默认选择一个与帐号手机一样的入住人信息, 如果没有则获取第一个
      const defaultGuest = []
      list.some(item => {
        if (item.phone === userInfo.mobile) {
          defaultGuest.push(item)
          return true
        }
        return false
      })
      if (defaultGuest && defaultGuest.length === 0) {
        defaultGuest.push(list[0])
      }
      app.globalData.selectGuest = defaultGuest
      this.setData({
        guestList: defaultGuest
      })
      this.setAccident()
    }
  },
  navigateBack() {
    setTimeout(() => {
      wx.navigateBack()
    }, 800)
  },
  removeGuest(e) {
    let id = e.target.dataset.id
    let newGuestList = this.data.guestList.filter( v => v.guestId !== id )
    app.globalData.selectGuest = newGuestList
    this.setData({
      guestList: newGuestList
    })
    this.setAccident()
    this.calculateOrder()
  },
  switchUseStoredMoney(e) {
    let isUseStoredMoney = e.detail.value
    this.setData({
      isUseStoredMoney
    }, this.calculateOrder)
  },
  selectDate() {
    wx.navigateTo({
      url: './checkin-date/checkin-date'
    })
  },
  toUnsubscribe() {
    getApp().mtj.trackEvent('order_unsubscribe_tip');
    wx.navigateTo({
      url: '/pages/tipspage/unsubscribe/index'
    })
  },
  toRules() {
    getApp().mtj.trackEvent('order_rule_tip');
    wx.navigateTo({
      url: '/pages/tipspage/rules/index'
    })
  },
  toService() {
    getApp().mtj.trackEvent('order_service_tip');
    wx.navigateTo({
      url: '/pages/tipspage/service/index'
    })
  },
  toInsurance() {
    getApp().mtj.trackEvent('order_insurance_tip');
    wx.navigateTo({
      url: '/pages/tipspage/insurance/index'
    })
  },
  toInterests() {
    getApp().mtj.trackEvent('order_member_interests');
    wx.navigateTo({
      url: '/pages/mine/interests/interests'
    })
  },
  getCheckinPersons(e) {
    this.setData({
      personCount: e.detail.value
    })
  },
  doSelectCoupon() {
    if (this.data.specialRoomPriceFlag) {
      wx.showToast({
        title: '管家特别优惠不能使用优惠券',
        icon: 'none'
      })
      return false
    }
    let { checkinStartDate, checkinEndDate, houseCalendarDetail, houseSourceId } = this.data
    // 优惠券列表需要nightPrices
    let { nightPrices } = houseCalendarDetail
    wx.setStorageSync('nightPrices', nightPrices)
    wx.navigateTo({
      url: `/pages/order/coupon/index?checkInDate=${checkinStartDate}&checkOutDate=${checkinEndDate}&houseSourceId=${houseSourceId}`
    })
  },
  onSelect(e) {
    switch(e.currentTarget.dataset.id) {
      case 'business':
        this.setData({
          selectBusiness: !this.data.selectBusiness
        })
        return
      case 'useDiscount':
        /*this.setData({
          useDiscount: !this.data.useDiscount
        })*/
        return
    }
  },
  // 自动选择一张优惠券
  selectBestCoupon(couponList = []) {
    if (!this.data.clickedNotUseCoupoon && couponList && couponList.length > 0) {
      let selectCoupon = null;
      couponList.forEach(item => {
        if (item.coupon.couponCode === '9842F2461') {
          selectCoupon = item;
        }
      })
      this.setData({
        selectCoupon: selectCoupon ? selectCoupon : couponList[0]
      })
      this.calculateOrder()
    }
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
    getApp().mtj.trackEvent('order_deposit_tip');
    wx.showModal({
      icon: 'none',
      title: '保证金',
      content: '由Locals路客暂时保管，如果管家在您退房后+1天内没有提出损坏赔偿，将立即原路返还。',
      showCancel: false,
      confirmText: '知道了'
    })
  },
  showStoredMoneyTip() {
    wx.showModal({
      icon: 'none',
      title: '储值支付',
      content: '购买商务大礼包的商务旅客可获得消费金额的1%返现，退房后自动存入您的储值账号，下次预订可用。',
      showCancel: false,
      confirmText: '知道了'
    })
  },
  toggleData(e) {
    let key = ''
    if (e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.key) {
      key = e.currentTarget.dataset.key
    } else if (e.detail && e.detail.key) {
      key = e.detail.key
    }
    const result = !this.data[key];
    if (key) {
      switch(key) {
        case 'isShowBuyVipList':
          if (result) {
            getApp().mtj.trackEvent('order_show_more_member');
          }
          break;
      }
      this.setData({
        [key]: result,
      })
      if(key === 'isShowBuyVip' && !result) gioTrack('order_close_vip');
    }
  },
  triggerPrivileges() {
    getApp().mtj.trackEvent('order_business_privilege');
    this.setData({
      isShowPrivileges: !this.data.isShowPrivileges
    })
  },
  bindDateSelectTap() {
    // 不是从咨询页面进来的可以选择时间
    if (!this.data.isFromConsulting) {
      this.setData({
        // 清除订单日历房晚数组，使重新请求房晚详情
        houseCalendarDetail: null,
        // 重新选择日期后需要重新获取优惠券数量，和情况已选择的优惠券
        couponList: [],
        selectCoupon: null,
        isHasSelectBestCoupon: false
      })
      wx.navigateTo({
        url: '/pages/housing/date-select/date-select?houseId=' + this.data.houseSourceId
      })
    }
  },
  navigateToUpgrade() {
    getApp().mtj.trackEvent('order_upgrade');
    this.setData({
      hasUserInfo: false,
      buyMemberCardMap: null,
    })
    wx.navigateTo({
      url: '/pages/activity/upgrade29-201812/index'
    })
  }
})
