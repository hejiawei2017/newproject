const { createMallOrder, getGoods, claim, closeTrade,mallTempConfig } = require('../../../server/mall')
const { miniPay } = require('../../../server/order')
const { showLoading, catchLoading, maskPhone, weekNumToCN, stringifyURL } = require('../../../utils/util')
const dayjs = require('../../../utils/dayjs.min.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: {
      title: '',
      standard: '8个',
      unit: '盒',
      price: 10,
      delivery: '快递包邮',
      acitve: '老板放假大放送',
      offer: '20.00',
    },
    isGiven: false,
    orderNum: 1,
    isFullScreen: app.globalData.isFullScreen
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { sourcefrom, itemId = '',num = '',plusdesc } = options;
    const nowTime = Date.now();
    this.setData({
      sourcefrom,
      itemId,
      nowTime,
      num,
      plusdesc
    })
    this.getStorageAddress();
    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getGoodsInfo()
    this.getTempConfig()
  },

  getTempConfig() {
    mallTempConfig().then(res => {
      this.setData({
        config:res
      })
    })
  },

  getGoodsInfo() {
    getGoods(this.data.itemId)
      .then(res => {
        if (res.success) {
          this.setData({
            goods: res.data
          })
          this.totalFee();
          // this.getDeliveryDate();
        } else {
          wx.showToast({
            title: res.errorMsg,
            icon: 'none'
          })
        }
      })
      .catch(e => {
        catchLoading(e)
      })
  },

  //物流送达预计
  getDeliveryDate() {
    let deliveryInfo = ''
    if (dayjs().hour() > 17) {
      const afterDate = dayjs().add(4, 'day')
      deliveryInfo = `预计${(dayjs(afterDate).month() + 1)}月${dayjs(afterDate).date()}日(周${weekNumToCN(dayjs(afterDate).day())})送达`
    } else {
      const afterDate = dayjs().add(3, 'day')
      deliveryInfo = `17:00前完成支付，预计${(dayjs(afterDate).month() + 1)}月${dayjs(afterDate).date()}日(周${weekNumToCN(dayjs(afterDate).day())})送达`
    }
    this.setData({
      deliveryInfo
    })
  },

  //
  psInput({ detail: { value } }) {
    this.setData({
      psInputValue: value
    })
  },

  // 获取本地存过的地址
  getStorageAddress() {
    const userwxAddress = wx.getStorageSync('userwxAddress')
    if (userwxAddress) {
      this.setData({
        address: { ...userwxAddress, maskPhone: maskPhone(userwxAddress.telNumber) }
      })
    }
  },

  // 获取微信地址
  getWxAddress() {
    const that = this
    wx.chooseAddress({
      success(res) {
        wx.setStorageSync('userwxAddress', res);
        that.setData({
          address: { ...res, maskPhone: maskPhone(res.telNumber) }
        })
      },
      fail(e) {
        if (e.errMsg.toString().search('cancel') === -1) {
          that.setData({
            showPermissonDialog: true
          })
        }
      }
    })
  },

  //数量加一
  numMinus() {
    if (!this.data.goods.isCombination) {
      let orderNum = this.data.orderNum
      if (orderNum > 1) {
        orderNum--;
        this.setData({
          orderNum
        })
        this.totalFee();
      }
    }
  },

  //数量减一
  numAdd() {
    if (!this.data.goods.isCombination) {
      let orderNum = this.data.orderNum
      orderNum++;
      this.setData({
        orderNum
      })
      this.totalFee();
    }
  },

  //计算总价
  totalFee() {
    this.setData({
      totalFee: this.data.orderNum * this.data.goods.price
    })
  },

  //组合下单参数
  getOrderParmas() {
    const inviteCode = wx.getStorageSync('inviteCode')
    const address = this.data.address
    let parmas = {
      sourcePlatform: "MP",
      trades: [
        {
          itemId: this.data.goods.id,
          totalFee: this.data.orderNum * this.data.goods.price,
          buyNum: this.data.orderNum
        }
      ],
      sid: app.globalData.sid,
      inviteCode: inviteCode,
      isGivenTrade: this.data.isGiven ? 1 : 0,

    }
    if (!this.data.isGiven) {
      parmas = {
        ...parmas, userAddress: `${address.provinceName}${address.cityName}${address.countyName}${address.detailInfo}`,
        userName: address.userName,
        userMobile: address.telNumber,
        buyerMessages: this.data.psInputValue,
        remarks: this.data.plusdesc || ''
      }
    }
    return parmas
  },

  //下单
  sendOrder() {
    if (this.data.isGiven) {
      this.callsendOrder()
    } else {
      if (this.data.address) {
        this.callsendOrder()
      } else {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none'
        })
      }
    }
  },

  callsendOrder() {
    showLoading();
    console.info(this.data.goods)
    createMallOrder(this.getOrderParmas())
      .then(res => {
        this.setData({
          orderDetail: res.data.orderInfo
        })
        this.weixinPay()
      })
      .catch(e => {
        wx.hideLoading();
        catchLoading(e)
      })
  },

  weixinPay() {
    const that = this
    let openId = wx.getStorageSync('openId')
    let params = {
      accountId: 7,
      isInvoice: false,
      amount: this.data.orderDetail.payment / 100,
      outTradeNo: this.data.orderDetail.id,
      tradeType: 'JSAPI',
      currency: 'CNY',
      source: 'MALL-V2', // 不能修改
      body: '小程序支付',
      openId: openId
    }
    miniPay(params)
      .then(res => {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.pkg,
          signType: res.data.signType,
          paySign: res.data.sign,
          success: res => {
            // getApp().mtj.trackEvent('fail_pay_go_ahead_pay_success');
            let params = {
              isGiven: that.data.isGiven ? 1 : 0,
              num:that.data.orderNum,
              payment: that.data.orderDetail.payment,
              title: that.data.goods.specification + ' ' + that.data.plusdesc,
              // specification: that.data.goods.specification,
            }
            if (that.data.isGiven) {
              params = {... params, 
                itemId: that.data.itemId,
                orderId: that.data.orderDetail.id,
                picurl: that.data.goods.picUrl,
              }
            }
            wx.redirectTo({
              url: stringifyURL(`../pay-success/pay-success`,params),
            })
          },
          fail: e => {
            wx.hideLoading();
            wx.showToast({
              title: '支付失败',
              icon: 'none'
            })
            this.closeOrder();
          }
        })
      })
      .catch(e => {
        catchLoading(e)
      })
  },

  closeOrder() {
    closeTrade({
      id: this.data.orderDetail.id
    })
    .then(res => {
      
    })
  },

  self() {
    this.setData({
      isGiven: false
    })
  },
  give() {
    this.setData({
      isGiven: true,
      showPermissonDialog: false
    })
  },

  //提取赠送货品
  claimOrder() {
    if (this.data.address) {
      showLoading();
      claim(this.getClaimParmas())
        .then(res => {
          if (res.success) {
            wx.reLaunch({
              url: '../pay-success/pay-success?type=claim'
            })
          }
        })
        .catch(e => {
          wx.hideLoading();
          catchLoading(e)
        })
    } else {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
    }
  },

  getClaimParmas() {
    const pages = getCurrentPages()
    const lastPage = pages[pages.length - 2]
    const address = this.data.address
    const parmas = {
      tradeUserId: lastPage.data.userId,
      tradeOrderId: lastPage.data.orderId,
      receiverUserId: app.globalData.userInfo.id,
      receiverName: address.userName,
      receiverMobile: address.telNumber,
      receiverAddress: `${address.provinceName}${address.cityName}${address.countyName}${address.detailInfo}`,
      receiveTime: (Date.now() * 1000).toString()
    }
    return parmas
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})