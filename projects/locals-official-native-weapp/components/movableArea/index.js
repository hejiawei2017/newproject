let startX = 0
let startY = 0

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 传入数据
    listData: {
      type: Object,
      value: ''
    },
    // 传入index
    index: {
      type: Number,
      value: -1
    },
    // 移动距离
    removing: {
      type: Number,
      value: -200
    },
    x: {
      type: Number,
      value: 0
    },
    AreaWidth: {
      type: String,
      value: '690rpx'
    },
    AreaHeight: {
      type: String,
      value: '100rpx'
    },
    ViewWidth: {
      type: String,
      value: '915rpx'
    },
    ViewHeight: {
      type: String,
      value: '100rpx'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 滑动滑块事件
    touchstart(e){
      startX = e.changedTouches[0].clientX
      startY = e.changedTouches[0].clientY
    },
    touchend(e){
      const difference = startX-e.changedTouches[0].clientX
      const differenceY = startY-e.changedTouches[0].clientY
      if(Math.abs(differenceY) > 40 || Math.abs(difference) < 5) return
      const index = e.currentTarget.dataset.index
      const item = this.data.listData
      if(difference > 0) {
        item['x'] = this.data.removing
        this.triggerEvent('updataMovable', {item,index})
      } else {
        item['x'] = 0
        this.triggerEvent('updataMovable', {item,index})
      }
    },
  }
})
