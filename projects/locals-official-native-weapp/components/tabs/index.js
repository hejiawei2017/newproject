/**
 * tab 组件
 * @param {Array} tabs 标题数组
 * @param {Boolean} isFixed tabs是否变成fixed
 * @param {Function} tabClick 点击tab回调
 * 用slot来传入每个tabs的内容从0开始，<view slot="0"></view>, slot的数量与tabs的长度一致
 **/
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    tabs: {
      type: Array,
      value: []
    },
    isFixed: {
      type: Boolean,
      value: true
    },
    activeIndex: {
      type: Number,
      value: 0,
    },
  },
  data: {
    sliderLeft: 0,
    wordCount: 0
  },
  ready() {
    this.moveNavBarSlider()
  },
  methods: {
    tabClick (e) {
      this.setData({
        activeIndex: parseInt(e.currentTarget.id)
      });
      this.moveNavBarSlider()
      this.triggerEvent('tabClick', {
        activeIndex: parseInt(e.currentTarget.id)
      })
    },
    moveNavBarSlider() {
      let { tabs } = this.data
      if (tabs.length) {
        let activeIndex = parseInt(this.data.activeIndex)
        const query = wx.createSelectorQuery().in(this)
        query.selectAll('.weui-navbar__title').boundingClientRect()
        query.exec(res => {
          let values = res[0]
          let rect = values[activeIndex]
          this.setData({
            wordCount: tabs[activeIndex]['length'],
            sliderLeft: rect.left,
            tabsRect: values
          })
        })
      }
    }
  }
})
