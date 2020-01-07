// components/flexible-text/index.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isOpenRowsTitle: { //开启多行title
      type: Boolean,
      value: false
    },
    height: {//显示高度
      type: Number,
      value: 65
    },
    lineClamp: {//省略号在哪一行
      type: Number,
      value: 3
    },
    // 显示文字的样式
    showMoreStyle: {
      type: String,
      value: ''
    },
    // 关闭按钮样式
    closeBtnStyle: {
      type: String,
      value: ''
    },
    // 显示更多的文字
    showMoreText: {
      type: String,
      value: '了解更多'
    },
    isCanClose: {
      type: Boolean,
      value: true
    },
    closeText: {
      type: String,
      value: '收起'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hideText: false,
    isShowBtn: true

  },
  ready(){
    setTimeout(()=> {
      wx.createSelectorQuery().in(this).select('#component-content').fields({
        size: true,
        computedStyle: ['line-height', 'font-size']
      }, (res) => {
        if (res && res.height) {
          let height = res.height
          let lineHeightIndex = res['line-height'].indexOf('p')
          let lineHeightNum = res['line-height'].substring(0, lineHeightIndex)
          let rowCount = Math.ceil(height / lineHeightNum)
          if (rowCount > 3) {
            this.setData({
              isShowBtn: true,
              hideText: true
            })
          } else {
            this.setData({
              isShowBtn: false,
              hideText: false
            })
          }
        }
      }).exec()
    },1000)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _onOpenShowText: function(){
      this.setData({
        hideText: !this.data.hideText
      })
    }
  }
})
