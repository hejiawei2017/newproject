const app = getApp()
const moment = require('../../../utils/util');

Page({
  data:{
    checkInDate: null,
    checkOutDate: null
  },
  onShow () {
    this.selectComponent("#im-message").imLogin()
    const { searchParams } = app.globalData;
    const { beginDate, endDate } = searchParams.dateParams;
    this.setData({
      checkInDate: moment(beginDate).format('YYYY-MM-DD'),
      checkOutDate: moment(endDate).format('YYYY-MM-DD'),
    })
  },
  getRangeDate (res) {
    const { startDate: beginDate, endDate } = res.detail;
    const { searchParams } = app.globalData;
    searchParams.dateParams = {
      endDate,
      beginDate,
    }
    setTimeout(() => {
      wx.navigateBack()
    }, 800)
  }
})