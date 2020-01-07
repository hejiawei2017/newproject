// pages/mall/index.js
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
    this.selectComponent("#auth-drawer-box").checkRole()
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
  },

  nav() {
    wx.navigateTo({
      url : `/pages/mall/item/item?id=1`
    })
  },
  nav1() {
    wx.navigateTo({
      url : `/pages/mall/item/item?id=2`
    })
  },
  nav2() {
    wx.navigateTo({
      url : `/pages/mall/item/item?id=3`
    })
  },
  nav4() {
    wx.navigateTo({
      url : `/pages/mall/my-order/my-order`
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