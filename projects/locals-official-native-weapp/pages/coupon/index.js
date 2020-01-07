const { getWallte, receiveCoupon } = require('../../server/mine')
const { catchLoading, showLoading } = require('../../utils/util')
const regeneratorRuntime = require('../../libs/regenerator-runtime.js')
const app = getApp();

// 对应tabs数组的索引
const AVAILABLE_STATUS = 0
const EXPIRED_STATUS = 1
const USED_STATUS = 2

Page({
  data: {
    isFullScreen: app.globalData.isFullScreen,
    options: {},
    isFixed: false,
    isLoading: false,
    activeIndex: 0,
    usedData: null,
    expiredData: null,
    availableData: null,
    pageNumArray: [1, 1, 1],
    hasNextPageArray: [true, true, true],
    pageSize: 50,
    tabs: ['可使用', '已过期', '已使用']
  },
  onLoad(options) {
    this.setData(options)
    this.selectComponent("#auth-drawer-box").checkRole()
    this.selectComponent("#im-message").imLogin()
  },
  async signInCallback() {
    // 判断是否有传入couponCode,有则领取优惠券再获取优惠券列表,领取成功后清空couponCode避免重复领取
    const { couponCode } = this.data
    showLoading()
    if (couponCode) {
      await this.receiveCoupon()
    }
    this.getCoupons()
  },
  onPageScroll({ scrollTop }) {
    let isFixed = false
    if (scrollTop > 1) {
      isFixed = true
    }
    this.setData({
      isFixed
    })
  },
  onPullDownRefresh() {
    let { activeIndex } = this.data
    let couponState = this.getCurrentCouponState(activeIndex)
    this.setData({
      [`pageNumArray[${activeIndex}]`]: 1,
      [`hasNextPageArray[${activeIndex}]`]: true
    })
    this.getCoupons(couponState)
  },
  onReachBottom() {
    let { activeIndex, pageNumArray, hasNextPageArray } = this.data
    let couponState = this.getCurrentCouponState(activeIndex)
    let isHasNextPage = hasNextPageArray[activeIndex]
    
    if (!isHasNextPage) {
      return false
    }

    this.setData({
      isLoading: true,
      [`pageNumArray[${activeIndex}]`]: pageNumArray[activeIndex] + 1
    })
    this.getCoupons(couponState)
  },
  async receiveCoupon() {
    try {
      getApp().mtj.trackEvent('receive_coupon');
      const userInfo = wx.getStorageSync('userInfo')
      const { mobile } = userInfo
      const { couponCode } = this.data
      const params = {
        mobile,
        code: couponCode,
        platform: 'MINI_PROGRAM'
      }
      const response = await receiveCoupon(params)
      if (response.data) {
        this.setData({
          couponCode: ''
        })
        wx.showToast({
          title: '领取优惠券成功~'
        })
      }
    } catch(e) {
      setTimeout(() => {
        if (e && e.errorCode === "21102") {
          catchLoading('超过该优惠券的领取次数', 3000)
        } else {
          catchLoading(e, 3000)
        }
      }, 1000)
    }
  },
  getCoupons(couponState = 0) {
    let { activeIndex, pageNumArray, pageSize } = this.data
    let params = {
      pageSize,
      couponState,
      pageNum: pageNumArray[activeIndex] || 1
    }
    getWallte(params)
      .then(res => {
        let arrayName = this.getArrayName(couponState)
        let { list, hasNextPage } = res.data

        // data 排序（临时方案）
        if(couponState === 0) {
          list = this.getNewList(list,params.pageNum)
        }

        if (arrayName) {
          this.setData({
            isLoading: false,
            [arrayName]: pageNumArray[activeIndex] === 1 ? list : [].concat(this.data[arrayName], list),
            [`hasNextPageArray[${activeIndex}]`]: hasNextPage
          })
        }
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
      .catch(e => {
        this.setData({
          isLoading: false
        })
        catchLoading(e)
      })
  },
  getNewList(list,pageNum) {
    let oldList = Array.from(list)
    let newList = Array.from(list)
    const todayTime = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime()
    for (let i = 0; i < oldList.length; i++) {
      const couponJumpAddressList = oldList[i].coupon.couponJumpAddressList
      if(couponJumpAddressList && couponJumpAddressList.length > 0){
        const newCouponJumpAddressList = couponJumpAddressList.filter(item => item.channelType === 1)
        oldList[i].coupon.couponJumpAddressList = newCouponJumpAddressList[0]
      }
      const timeDiffer = parseInt(oldList[i].createTime) - todayTime
      if(timeDiffer > 0 && timeDiffer < 86400000){
        newList[i].isNewCoupon = true
        if(pageNum === 1 ){
          newList.unshift(newList.splice(i,1)[0])
        }
      }
    }
    return newList
  },
  tabClick(e) {
    let { activeIndex } = e.detail

    this.setData({
      activeIndex
    })
    
    let couponState = this.getCurrentCouponState(activeIndex)
    let arrayName =  this.getArrayName(couponState)
    let targetArray = this.data[arrayName]
    if (targetArray === null) {
      showLoading()
      this.getCoupons(couponState)
    }
  },
  getCurrentCouponState(activeIndex = 0) {
    let couponState = 0

    switch(activeIndex) {
      case AVAILABLE_STATUS:
        couponState = 0
        break
      case EXPIRED_STATUS:
        couponState = 2
        break
      case USED_STATUS:
        couponState = 1
        break
    }
    return couponState
  },
  getArrayName(couponState) {
    switch(couponState) {
      case AVAILABLE_STATUS:
        return 'availableData'
      case EXPIRED_STATUS:
        return 'expiredData'
      case USED_STATUS:
        return 'usedData'
      default:
        return 'availableData'
    }
  },
  skipTo(e) {
    const { type } = e.currentTarget.dataset
    let url = ''
    let methods = 'navigateTo'
    switch(type) {
      case 'useCoupon':
        methods = 'switchTab'
        url += '/pages/index/index'
        break;
    }
    if (url) {
      wx[methods]({ url })
    }
  }
})