Page({
  data: {
    options: {},
    url: '',
  },
  onLoad(options) {
    this.setData({
      options
    })
  },
  onShow () {
    this.selectComponent("#auth-drawer-box").checkRole()
  },
  _cancelEventFn() {
    let { options, isUseToken } = this.data
    let { url } = options
    // 使webview获取token
    url = decodeURIComponent(url)
    console.log(url, "url")
    if (isUseToken) {
      let token = wx.getStorageSync('token')
      let markIndex = url.indexOf('?')
      if (markIndex === -1) {
        url += `?token=${token}`
      } else {
        url += `&token=${token}`
      }
    }
    
    this.setData({
      url: url ? url : ''
    })
  }
})