const { weekNumToCN, maskPhone, stringifyURL } = require('../../../utils/util')
const dayjs = require('../../../utils/dayjs.min.js');
const { mallTempConfig } = require('../../../server/mall')


const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { type = 'normal', isGiven = 0, num, orderId, itemId,picurl,payment,title} = options;
    let params = {
      type,
      isGiven: 0 === parseInt(isGiven) ? false : true
    }
    if ('normal' === type) {
      params = {
        ...params,
        num,
        payment,
        title
      }
    }
    if (isGiven) {
      //为了分享的参数
      params = {
        ...params,
        itemId,
        orderId,
        picurl
      }
    }
    this.setData(params)
    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getStorageAddress();
    // this.getDeliveryDate();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTempConfig();
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

  getTempConfig() {
    mallTempConfig().then(res => {
      this.setData({
        config:res
      })
    })
  },

  navToOrder() {
    const { type } = this.data
    wx.navigateTo({
      url: `../my-order/my-order?activeIndex=${type === 'normal' ? 0 : 1}`,
    })
  },

  navToMallIndex() {
    const pages = getCurrentPages()
    if (1 === pages.length) {
      wx.redirectTo({
        url: '../index'
      })
    } else {
      wx.navigateBack();
    }
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

  //物流送达预计
  getDeliveryDate() {
    let deliveryInfo = ''
    let afterDate
    if (dayjs().hour() > 17) {
      afterDate = dayjs().add(4, 'day')
    } else {
      afterDate = dayjs().add(3, 'day')
    }
    deliveryInfo = `预计${(dayjs(afterDate).month() + 1)}月${dayjs(afterDate).date()}日(周${weekNumToCN(dayjs(afterDate).day())})送达，请注意查收`
    this.setData({
      deliveryInfo
    })
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
    if (this.data.isGiven) {
      const params = {
        orderId:this.data.orderId,
        itemId: this.data.itemId,
        num: this.data.num,
        userId: app.globalData.userInfo.id,
        avatar: app.globalData.userInfo.avatar,
        nickName: app.globalData.userInfo.nickName
      }
      return {
        title: `您的好友发福利啦`,
        path: stringifyURL('/pages/mall/claim/claim',params),
        imageUrl:
          this.data.picurl
      }
    } else
      return {};
  }
})