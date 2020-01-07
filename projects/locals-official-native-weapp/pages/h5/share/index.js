const { shareDataFormat } =  require('../../../utils/util')

Page({
  onLoad(options) {
    // 禁止转发
    wx.hideShareMenu()
    let { title, path, imageUrl } = options
    this.setData({
      path: decodeURIComponent(path),
      title: decodeURIComponent(title),
      imageUrl: decodeURIComponent(imageUrl)
    })
  },
  onShareAppMessage() {
    let { path, title, imageUrl } = this.data
    return shareDataFormat({
      path: path || '',
      title: title || '',
      imageUrl: imageUrl || ''
    })
  }
})