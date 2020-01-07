Component({
  properties: {
    showType: {
      type: String,
      value: 'left-shaft' // center-shaft 时间轴在中间、left-shaft 时间轴在左边
    },
    timeLineList: {
      type: Array,
      value: []
    },
    currentStep: {
      type: Number,
      value: 0
    },
    activeStyle: {
      type: String,
      value: ''
    }
  }
})
