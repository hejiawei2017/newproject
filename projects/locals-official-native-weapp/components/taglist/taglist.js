/**
 * 标签列表
 * @prop list 标签列表
 * @prop title 标题
 * @slot name="right" 标题右侧插槽，可自定义事件
 * @prop getTag 点击事件
 **/
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    list: {
      type: Array,
      value: []
    },
    title: {
      type: String,
      value: ''
    },
    loadingText: {
      type: String,
      value: ''
    },
    loading: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    clickTag (e) {
        this.triggerEvent('getTag', e.target.dataset)
    }
  }
})
