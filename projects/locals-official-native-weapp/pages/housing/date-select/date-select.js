const app = getApp()
const { showLoading, catchLoading } = require('../../../utils/util')
const { getHouseCalendar } = require('../../../server/housing')
let moment = require("../../../utils/dayjs.min.js")

Page({
  data: {
    calendars: {},
    willFlash: false,
    houseId: ''
  },
  onLoad(options) {
    this.setData({
      houseId: options.houseId || '',
      willFlash: options.willFlash || ''
    })
  },
  onShow() {
    this.selectComponent("#im-message").imLogin()
    showLoading()
    this.getHouseCalendar()
  },
  getHouseCalendar() {
    getHouseCalendar(this.data.houseId)
      .then(res => {
        // 处理接口的房源日历数据结构
        let calendarObj = {}
        res.data.forEach(v => {
          let key = moment(v.date).format('YYYY-MM-DD')
          
          calendarObj[key] = {
            roomPrice: v.roomPrice,
            stock: v.stock,
            // 未定义是当开启
            isOpen: v.isOpen === undefined ? true : v.isOpen
          }
        })
        this.setData({
          calendars: calendarObj
        })
        wx.hideLoading()
      })
      .catch(e => {
        catchLoading(e.errorMsg)
      })
  },
  getRangeDate(res) {
    const { startDate: beginDate, endDate } = res.detail;
    const { searchParams } = app.globalData;
    searchParams.dateParams = {
      endDate,
      beginDate,
    }

    // 仅用于 IM 修改订单日期
    app.globalData.__im_order_date = {
      endDate,
      beginDate,
    };
  
    setTimeout(() => {
      if (this.data.willFlash) {
        this.nowBooking()
      } else {
        wx.navigateBack()
      }
    }, 800)
  
  },
  nowBooking () {
    let id = this.data.houseId
    wx.redirectTo({
      url: `/pages/order/order-v2/index?houseSourceId=${id}`
    })
  }
})