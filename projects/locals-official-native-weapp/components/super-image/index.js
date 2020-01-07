/**
 * 超级image组件
 * 解决: 图片失败重新加载
 * 参数与官方一致
 */

Component({
  options: {
    // 基础库版本 2.2.3
    addGlobalClass: true
  },
  properties: {
    src: {
      type: String,
      value: null
    },
    mode: {
      type: String,
      value: 'aspectFit'
    },
    style: {
      type: String,
      value: ''
    },
    isReloadImage: {
      type: Boolean,
      value: true
    },
    errorReloadCount: {
      type: Number,
      value: 3
    },
    lazyLoad: {
      type: Boolean,
      value: true
    },
    propClass: {
      type: String,
      value: ''
    },
    defaultImage: {
      type: String,
      value: ''
    }
  },
  data: {
    loadedCount: 1
  },
  ready() {
    let { src, defaultImage } = this.data
      
    if (!src && defaultImage) {
      this.setData({
        src: defaultImage
      })
    }
  },
  methods: {
    binderror(e) {
      let { src, isReloadImage, loadedCount, errorReloadCount, defaultImage } = this.data
      
      if (defaultImage) {
        this.setData({
          src: defaultImage
        })
      }

      if (isReloadImage && loadedCount < errorReloadCount) {
        this.setData({
          src: src + ' ',
          loadedCount: loadedCount + 1
        })
      } 

      if (loadedCount >= errorReloadCount) {
        if (defaultImage) {
          this.setData({
            src: defaultImage
          })
        }
      }
        
      this.triggerEvent('error', e)
    },
    bindload(e) {
      this.triggerEvent('load', e)
    }
  }
})