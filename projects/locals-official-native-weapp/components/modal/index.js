Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    // 控制显示
    visible: {
      type: Boolean,
      value: false,
      observer(value) {
        if (this.data.animation) {
          let animation = wx.createAnimation({
            duration: 400,
            timingFunction: 'ease'
          })
          if (value) {
            animation.opacity(1).step()
          } else {
            animation.opacity(0).step()
          }
          this.setData({
            animationData: animation.export()
          })
        }
      }
    },
    // 是否使用cover-view
    isUsingCover: {
      type: Boolean,
      value: false
    },
    hideCancel: {
      type: Boolean,
      value: false
    },
    // modal容器样式
    frameStyle: {
      type: String,
      value: ''
    },
    hideOk: {
      type: Boolean,
      value: false
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    okText: {
      type: String,
      value: '确定'
    },
    animation: {
      type: Boolean,
      value: false
    }
  },
  data: {
    animationData: {}
  },
  methods: {
    // 禁止mask滑动
    maskTouchMove() {
      return false
    },
    // 点击取消
    _bindcancel() {
      this.triggerEvent('cancel')
    },
    // 点击确定
    _bindconfirm() {
      this.triggerEvent('confirm')
    }
  }
})
