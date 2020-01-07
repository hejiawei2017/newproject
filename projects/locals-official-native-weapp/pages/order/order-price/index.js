// pages/order/order-price/index.js
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
    const data = wx.getStorageSync('locals_mini_order_price_detail');
    if(data) {
      console.log(data)
      this.setData(data);
    }
  },
  onUnload(){
    wx.setStorageSync('locals_mini_order_price_detail', null);
  },
  toInsurance() {
    getApp().mtj.trackEvent('order_insurance_tip');
    wx.navigateTo({
      url: '/pages/tipspage/insurance/index'
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
  showClearTip() {
    wx.showModal({
      icon: 'none',
      title: '清洁费',
      content: `为保障客房的清洁质量，房东会外聘专业团队进行打扫，每单仅收一笔清洁费。`,
      showCancel: false,
      confirmText: '知道了'
    })
  },
})