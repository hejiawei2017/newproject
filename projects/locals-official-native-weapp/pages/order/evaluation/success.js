const app = getApp()

Page({
  data: {
    isFullScreen: app.globalData.isFullScreen
  },
  onShow() {
    this.selectComponent("#im-message").imLogin()
  },
  navigateToPath(e) {
    let { path } = e.currentTarget.dataset
    switch(path) {
      case 'index':
        wx.switchTab({ url: '/pages/index/index' })
        break;
      case 'coupon':
        wx.redirectTo({ url: '/pages/coupon/index' })
        break;
    }
  }
})