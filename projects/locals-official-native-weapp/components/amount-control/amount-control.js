Component({
  externalClasses: ['size-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    num: {
      type: Number,
      value: 2,
      observer: function (value) {
        this.triggerEvent('getNum', { value })
      }
    },
    text: {
      type: String,
      value: '默认'
    },
    min: {
      type: Number,
      value: 0
    },
    max: {
      type: Number,
      value: 99999
    },
    isEqZeroText: {
      type: String,
      value: ''
    }
  },

  ready: function () {
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 使用data数据对象设置样式名  
    minusStatus: 'minus-disabled',
    maxusStatus: 'plus-normal'
  },

  /**
   * 组件的方法列表
   */
  ready() {
    var { num, min, max } = this.data
    var minusStatus = num <= min ? 'minus-disabled' : 'minus-normal'; 
    var maxusStatus = num >= max ? 'plus-disabled' : 'plus-normal';  
    this.setData({
      num: min < num ? num : min,
      minusStatus,
      maxusStatus
    })
  },
  methods: {
    /* 点击减号 */  
    bindMinus: function() {  
      var { num, min, max } = this.data;  
      if (num > 0 && num > min) {  
          num--
      }  
      var maxusStatus = num >= max ? 'plus-disabled' : 'plus-normal';  
      var minusStatus = num <= min ? 'minus-disabled' : 'minus-normal';  
      // 将数值与状态写回  
      this.setData({  
          num: num,  
          minusStatus: minusStatus,
          maxusStatus: maxusStatus  
      });  
    },  
    /* 点击加号 */  
    bindPlus: function() {  
      var { num, max, min } = this.data  
      // 不作过多考虑自增1
      if (max && num < max) {
        num++
      }
      var maxusStatus = num >= max ? 'plus-disabled' : 'plus-normal';  
      var minusStatus = num <= min ? 'minus-disabled' : 'minus-normal'; 
      // 将数值与状态写回  
      this.setData({  
          num: num,  
          maxusStatus: maxusStatus,
          minusStatus: minusStatus
      });  
    },  
    /* 输入框事件 */  
    bindManual: function(e) {  
      var num = e.detail.value;  
      if (/\d/.test(num)) {
        // 将数值与状态写回  
        this.setData({  
            num: num  
        }); 
      } 
    }  
  }
})
