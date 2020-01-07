// components/search/search.js
/**
 * 搜索框
 * @prop placeholder 占位符
 * @prop keywords: input 的 value
 * @prop input: e inpu事件
 * @prop confirm: e confirm事件
 * @prop longitude: 经度
 * @prop latitude: 纬度
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '请输入'
    },
    showSearchButton: {
      type: Boolean,
      value: false
    },
    value: {
      type:String,
      value:''
    },
    isShowMap: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    },
    focus: {
      type: Boolean,
      value: false
    },
    longitude: {
      type: Number,
      value: 0
    },
    latitude: {
      type: Number,
      value: 0
    },
    poiName: {
      type: String,
      value: ''
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindinput (e) {
      this.triggerEvent('input', e.detail)
    },
    bindconfirm (e) {
      this.triggerEvent('confirm', e.detail)
    },
    bindblur (e) {
      this.triggerEvent('blur', e.detail)
    },
    clean() {{
      this.triggerEvent('clean')
    }},
    goToHouseMap() {
      let { latitude, longitude, poiName } = this.data
      wx.navigateTo({
        url: `/pages/housing/map/index?type=remote&latitude=${latitude}&longitude=${longitude}&poiName=${poiName}`
      })
    }
  }
})
