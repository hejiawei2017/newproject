const { getGoods, checkTradepresent } = require('../../../server/mall')
const { miniPay } = require('../../../server/order')
const { showLoading, catchLoading, validator, isHasLogin, weekNumToCN } = require('../../../utils/util')
const dayjs = require('../../../utils/dayjs.min.js');
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
    const { avatar, 
      userId = '', 
      nickName, 
      orderId, 
      itemId = '',
      payment,
      num } = options
    this.setData({
      itemId,
      avatar,
      userId,
      nickName,
      orderId,
      num,
      payment
    })
    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (isHasLogin())
      this.getGoodsInfo()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.selectComponent('#auth-drawer-box').checkRole();
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

  _cancelEventFn() {
    this.getGoodsInfo()
  },

  getGoodsInfo() {
    getGoods(this.data.itemId)
      .then(res => {
        if (res.success) {
          this.setData({
            goods: res.data
          })
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

  claim() {
    const that = this
    checkTradepresent({
      tradeId: this.data.orderId
    })
      .then(res => {
        if (res.success) {
          if (!res.data.receive) {
            wx.showToast({
              title: '该赠品已经被领取',
              icon: 'none'
            })
          } else {
            wx.navigateTo({
              url: `../order/order?sourcefrom=claim&num=${that.data.num}&itemId=${that.data.itemId}`
            })
          }
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