const app = getApp();
const { sortList } = require('../../../utils/dictionary');

Page({
  data: {
    selected: null,
    list: [],
  },
  onLoad(options) {
    this.selectComponent("#im-message").imLogin()
    const { searchParams } = app.globalData;
    const { sortParams, isForeignCity } = searchParams;
    const key = Object.keys(sortParams)[0];
    // 判断是否有经纬度，没有则把距离优先隐藏
    const { longitude, latitude } = searchParams.locationParams;
    let list = [ ...sortList ];
    if (!latitude && !longitude) {
      list = list.filter(item => item.key !== 'distanceSort');
    }
    // 选择国外时，过滤国外才显示的排序
    if (isForeignCity) {
      list = list.filter(item => item.isShowForgeignCity);
    }
    this.setData({
      list,
      selected: {
        key,
        value: sortParams[key],
      },
    })
  },
  selected(e) {
    let { item } = e.currentTarget.dataset
    const { key, value } = item;
    this.setData({
      selected: item
    })
    app.globalData.searchParams.sortParams = {
      [key]: value,
    }
    wx.navigateBack()
  }
})