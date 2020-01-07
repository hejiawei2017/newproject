Page({
  data: {
    defaultTips: []
  },
  onLoad(options) {
    if (options.extendTips) {
      let { defaultTips } = this.data
      let extendTips = options.extendTips.split('\n').filter(item => {
        return item && item.trim()
      })
      defaultTips = [].concat(defaultTips, extendTips)
      this.setData({
        defaultTips
      })
    }
  }
})