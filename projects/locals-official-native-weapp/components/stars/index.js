Component({
  properties: {
    value: {
      type: Number,
      value: 0,
      observer(newValue) {
        this.setData({
          value: Math.round(newValue)
        })
      }
    },
    // 默认1:红色星星，2:紫色星星
    type: {
      type: Number,
      value: 1
    },
    size: {
      type: Number,
      value: 18
    }
  },
  data: {
    defaultImage: 'https://oss.localhome.cn/new_icon/star.png',
    purpleImage: 'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/upload/190313/PUXQB190313170627425.png',
    maxStars: 5,
    iconImage: ''
  },
  ready() {
    let { type, defaultImage, purpleImage } = this.data
    let iconImage = ''
    switch(type) {
      case 1:
        iconImage = defaultImage
        break;
      case 2:
        iconImage = purpleImage
        break;
    }
    this.setData({
      iconImage
    })
  },
})
