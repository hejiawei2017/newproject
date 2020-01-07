const { getMemberCard } = require('../../../server/mine')
const { processFloat } = require('../../../utils/util')
const { page: detailPage } = require('./index.js')
const app = getApp()

Page({
  blackCharImage: 'https://oss.localhome.cn/new_icon/chart2.png',
  whiteCharImage: 'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/upload/190322/V4CHO190322103219014.png',
  hasGetCardInfo: false,
  data: {
    ...detailPage.data,
    discountedPrices: 0
  },
  // 引入./index.js的方法
  ...detailPage,
  onLoad(options) {
    if (!options.houseId) {
      throw new Error('houseId is null')
    }
    let { houseId } = options
    this.setData({
      houseId,
      charImage: this.whiteCharImage
    })
  },
  onShow () {
    this.selectComponent("#im-message").imLogin()

    let { dateParams } = app.globalData.searchParams;

    const { beginDate: searchStartDate, endDate: searchEndDate } = dateParams;

    if (searchStartDate !== this.data.searchStartDate || searchEndDate !== this.data.searchEndDate) {
      //转化日期，（预订日期使用）
      let startDate = new Date(searchStartDate)
      this.data.drawDate.startDate.date = (startDate.getMonth() + 1) + '月' + startDate.getDate() + '日'
      this.data.drawDate.startDate.week = detailPage.getWeekCn(startDate.getDay())
      let endDate = new Date(searchEndDate)
      this.data.drawDate.endDate.date = (endDate.getMonth() + 1) + '月' + endDate.getDate() + '日'
      this.data.drawDate.endDate.week = detailPage.getWeekCn(endDate.getDay())
      //-------end---------
      this.setData({
        searchStartDate,
        searchEndDate,
        drawDate: this.data.drawDate
      })
      //获取预订须知信息
      this.getHouseData(this.setDiscountedPrices)
      this.setTimeLineList()
    } else {
      this.setDiscountedPrices()
    }
  },
  setDiscountedPrices() {
    if (!this.hasGetCardInfo && this.data.houseInfo && this.data.houseInfo.id) {
      app.getUserInfoDetail(this.getMemberCardInfo)
    }
  },
  onPageScroll({ scrollTop }) {
    this.throttle(this.setIsScrollStatus, scrollTop)
    if (scrollTop < 1) {
      this.setData({ 
        isScroll: false,
        charImage: this.whiteCharImage
      })
    }
  },
  throttle(fn, context) {
    // 毫秒
    let delay = 500
    let currentTimestamp = (new Date()).valueOf()
    if (!this.lastTimestamp) {
      this.lastTimestamp = 0
    }
    if (currentTimestamp - this.lastTimestamp > delay) {
      this.lastTimestamp = (new Date()).valueOf()
      fn.call(null, context)
    }
  },
  setIsScrollStatus(scrollTop) {
    if (scrollTop > 0) {
      // fixed view 变化颜色
      this.setData({ 
        isScroll: true,
        charImage: this.blackCharImage
      })
    } else {
      // 还原为黑色
      this.setData({ 
        isScroll: false,
        charImage: this.whiteCharImage
      })
    }
  },
  getMemberCardInfo() {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      let params = {
        code: userInfo.memberCardCode
      }
      getMemberCard(params)
        .then(res => {
          let { data: memberCardInfo } = res
          if (memberCardInfo) {
            this.hasGetCardInfo = true
            let { standardPrice } = this.data.houseInfo
            let discountedPrices = processFloat(standardPrice - standardPrice * memberCardInfo.discount, 0)
            this.setData({
              discountedPrices
            })
          }
        })
        .catch(e => {
          console.log('getMemberCard', e)
        })
    }
  },
})