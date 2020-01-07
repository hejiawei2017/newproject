const app = getApp();

Page({
  data: {
    isShowBtn: false,
    isFullScreen: app.globalData.isFullScreen,
  },
  onLoad(options) {
    this.setData({
      bookingId: options.openInvoiceBtn || false,
    })
  },
  goToInvoiceManage(){
    wx.navigateTo({ url: '/pages/mine/invoice/invoice' });
  },
  onShow: function () {
    this.selectComponent("#im-message").imLogin()
  }
})