const app = getApp();
const moment = require('../../utils/dayjs.min.js');

Page({
  data:{
    checkInDate: null,
    checkOutDate: null,
    from: ''
  },
  onLoad(options){
    this.setData({
      // 注册房东达人跳转选择城市页面，自带form=landlord参数
      from: options.from || ''
    })
  },
  onShow () {
    this.selectComponent("#im-message").imLogin();
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
      wx.navigateBack();
    }, 800);
  }
})