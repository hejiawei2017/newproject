const { catchLoading } = require('../../../utils/util')

Page({
  onLoad(options) {
    // 禁止转发
    wx.hideShareMenu()
    this.type = options.type
  },
  onShow() {
    let types = {
      signin: () => {
        wx.showLoading({
          title: '登录中...'
        })
        this.selectComponent("#auth-drawer-box").signInSuccessCallback()
      },
      signout: () => {
        wx.showLoading({
          title: '退出登录中...'
        })
        wx.clearStorageSync()
        catchLoading(`退出成功~`, 1500, wx.navigateBack)
      }
    }
    if (types[this.type]) {
      let pages = getCurrentPages()
      let lastPages = pages[pages.length - 2]
      lastPages.setData({
        visiable: false
      })
      types[this.type].call()
    } else {
      catchLoading(`type <string>: [signin, signout],没有此${this.type}类型的执行函数`, 2000, wx.navigateBack)
    }
  },
  signInCallback() {
    const pages = getCurrentPages()
    const len = pages.length
    const currentPageName = pages[len - 1].route || ''
    const prePage = pages[len - 2]
    prePage.setData({
      from: currentPageName // 为页面添加标志，表示登录后返回的
    })
    wx.navigateBack()
  }
})