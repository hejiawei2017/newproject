Component({
  properties: {
    key: {
      type: String,
      value: ''
    },
    visible: {
      type: Boolean,
      value: false,
      observer(value) {
        if (value) {
          this.setData({
            delayStyle: `transform: translateX(0)`
          })
        } else {
          setTimeout(() => {
            this.setData({
              delayStyle: `transform: translateX(100%)`
            })
          }, 400)
        }
      }
    }
  },
  data: {
    maskAnimation: null
  },
  ready() {
    
  },
  methods: {
    _bindcancel() {
      const { key } = this.data
      this.triggerEvent('cancel', { key })
    },
    maskTouchMove() {
      return false
    }
  }
})
