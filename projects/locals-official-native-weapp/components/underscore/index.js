/**
 * 组件：我的有底线的
 * 当出现在没有滚动的情况下会自动定位到底部或隐藏
 * 假如页面存在异步请求，则需要利用if获取数据后再渲染此组件
 */
Component({
  properties: {
    // 当为true时，当底线在没有滑动的页面里出现时会隐藏掉
    overflow: {
      type: Boolean,
      value: false
    },
    bgStyle: {
      type: String,
      value: ''
    }
  },
  data: {
    visible: true,
    style: ''
  },
  ready() {
    const query = wx.createSelectorQuery().in(this)
    const { windowHeight } = wx.getSystemInfoSync()
    query.select('.weui-loadmore').boundingClientRect()
    query.exec(res => {
      if (res && res[0] && res[0]['bottom'] <= windowHeight) {
        this.setData({
          visible: this.data.overflow ? false : true,
          style: 'position: absolute; bottom: 0; left: 0; right: 0;'
        })
      }
    })
  },
  methods: {

  }
})
