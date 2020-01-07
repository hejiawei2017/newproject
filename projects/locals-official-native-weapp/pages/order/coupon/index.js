const { getAvailableCoupons, getInvalidCoupons } = require('../../../server/order')
const { catchLoading, showLoading } = require('../../../utils/util')
const moment = require('../../../utils/dayjs.min.js')
const app = getApp()
const AVAILABEL_STATUS = 0
const INVALID_STATUS = 1

Page({
  data: {
    availableData: null,
    invalidData: null,
    pageSize: 200,
    checkInDate: '',
    checkOutDate: '',
    tabs: ['可用优惠券', '不可用优惠券']
  },
  onLoad(options) {
    let { checkInDate, checkOutDate, houseSourceId } = options
    
    // 传来的格式是： 2019-02-12
    if (checkInDate && checkOutDate) {
      // 入住是 14:00 离店是 12:00
      checkInDate = this.setHourOfDate(checkInDate, 'in')
      checkOutDate = this.setHourOfDate(checkOutDate, 'out')
      this.setData({
        params: {
          houseSourceId,
          nightPrices: wx.getStorageSync('nightPrices'),
          checkInDate: moment(checkInDate).valueOf(),
          checkOutDate: moment(checkOutDate).valueOf()
        }
      })
    } else {
      throw new Error('请输入 checkInDate && checkOutDate')
    }
  },
  onShow() {
    this.selectComponent("#im-message").imLogin()
  },
  onReady() {
    this.getAvailableCoupons()
  },
  setHourOfDate(date, type) {
    const dateTemp = moment(parseInt(date, 10)).format('YYYY-MM-DD');
    switch(type) {
      case 'in':
        return `${dateTemp} 14:00:00`
      case 'out':
        return `${dateTemp} 12:00:00`
    }
  },
  tabClick(e) {
    let { activeIndex } = e.detail
    let { availableData, invalidData } = this.data
    
    switch(activeIndex) {
      case AVAILABEL_STATUS:
        if (availableData === null) {
          this.getAvailableCoupons()
        }
        break
      case INVALID_STATUS:
        if (invalidData === null) {
          this.getInvalidCoupons()
        }
        break
    }
  },
  getAvailableCoupons() {
    showLoading()
    let { params } = this.data 
    params['available'] = 1
    getAvailableCoupons(params)
      .then(res => {
        let list = res.data

        this.setData({
          availableData: list
        })

        wx.hideLoading()
      })
      .catch(e => {
        catchLoading(e)
      })
  },
  getInvalidCoupons() {
    showLoading()
    let { params } = this.data 
    params['available'] = 0
    getAvailableCoupons(params)
      .then(res => {
        let list = res.data

        this.setData({
          invalidData: list
        })

        wx.hideLoading()
      })
      .catch(e => {
        catchLoading(e)
      })
  },
  unUseCoupon() {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    if (prevPage) {
      prevPage.setData({
        selectCoupon: null,
        clickedNotUseCoupoon: true
      })
    }
    wx.navigateBack()
  },
  useCoupon(e) {
    let { couponId } = e.detail
    let { availableData } = this.data
    let selectItem = null

    availableData.some(v => {
      if (v.id === couponId) {
        selectItem = v
        return true
      }
    })

    if (selectItem) {
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      if (prevPage) {
        prevPage.setData({
          clickedNotUseCoupoon: false,
          selectCoupon: selectItem
        })
      }
      wx.navigateBack()
    } else {
      console.log('选择无效优惠券')
    }
  }
})