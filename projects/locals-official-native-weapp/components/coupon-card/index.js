/**
 * 优惠券卡片
 */
const moment = require('../../utils/dayjs.min.js')
const { processFloat } = require('../../utils/util')

Component({
  properties: {
    item: {
      type: Object,
      value: null,
      observer(newValue) {
        if (!newValue.updated) {
          this.updateItem()
        }
      }
    },
    backgroundColor: {
      type: String,
      value: 'white'
    },
    isShowCouponStateText: {
      type: Boolean,
      value: false
    },
    isGray: {
      type: Boolean,
      value: false
    },
    isOrder: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    updateItem() {
      let { item } = this.data

      if (item) {
        let couponStateInfo = this.processCouponInfo(item.couponState)
      
        if (  
          parseInt(item.couponState) === 0
        ) {
          item.isCanUse = true
        } else {
          item.isCanUse = false
        }

        item.couponType = parseInt(item.coupon.couponRules.couponType)

        if (item.couponType === 2) {
          // 折扣
          item.money = processFloat(item.coupon.couponRules[this.valueKey(item.couponType)] * 10, 1);
        } else {
          item.money = item.coupon.couponRules[this.valueKey(item.couponType)]
        }
        
        item.couponTypeName = this.getCouponTypeName(item.couponType)

        item = {
          ...item,
          ...couponStateInfo,
          // 用于observer判断是否更新
          updated: true,
          endTime: moment(item.endTime).format('YYYY.MM.DD'),
          startTime: moment(item.startTime).format('YYYY.MM.DD') 
        }
        this.setData({
          item
        })
      }
    },
    getCouponTypeName(couponType) {
      // 优惠券类型 1-立减券 2-折扣券 3-满减券
      switch(parseInt(couponType)) {
        case 1:
          return '立减券'
        case 2:
          return '折扣券'
        case 3:
          return '满减券'
      }
    },
    valueKey(couponType) {
      // 优惠券类型 1-立减券 2-折扣券 3-满减券
      switch(parseInt(couponType)) {
        case 1:
          return 'faceValue'
        case 2:
          return 'discount'
        case 3:
          return 'reduceValue'
      }
    },
    processCouponInfo(couponState) {
      let result = {}
      switch(couponState) {
        case -1:
          result = {
            couponStateText: '已作废',
            imageState: 'jiao3'
          }
          break
        case 0:
          result = {
            couponStateText: '可使用',
            imageState: 'jiao1'
          }
          break;
        case 1:
          result = {
            couponStateText: '已使用',
            imageState: 'jiao2'
          }
          break
        case 2:
          result = {
            couponStateText: '已过期',
            imageState: 'jiao3'
          }
          break
        case 3:
          result = {
            couponStateText: '可使用',
            imageState: 'jiao2'
          }
          break
        default:
          result = {
            couponStateText: '',
            imageState: 'jiao1'
          }
          break
      }
      return result
    },
    useCoupon() {
      let { id: couponId, isCanUse } = this.data.item
      if (isCanUse) {
        this.triggerEvent('useCoupon', { 
          couponId 
        })
      }
    },
    goToUseRules() {
      let { item } = this.data
      let { description } = item.coupon
      
      wx.navigateTo({
        url: `/pages/tipspage/useCouponRules/index?extendTips=${description}`
      })
    },
    skipTo(e) {
      const { item } = this.data
      const { couponJumpAddressList } = item.coupon
      let url = '/pages/index/index'
      console.log(couponJumpAddressList)
      if(couponJumpAddressList && couponJumpAddressList.jumpAddress) {
        url = couponJumpAddressList.jumpAddress
        if(url.indexOf('/pages/index/index') === -1) {
          wx.navigateTo({ 
            url,
            fail: () => { wx.switchTab({ url: '/pages/index/index' }) }
          })
          return
        }
      }
      wx.switchTab({ url })
    }
  }
})
