const app = getApp();

Page({
  data: {
    houses: []
  },
  onLoad: function(options) {
    // 生命周期函数--监听页面加载
    const houses = (app.globalData.__current_location_houses || []).map(item => ({
      ...item,
      _price: item.booked ? 99999999 + item.standardPrice : item.standardPrice,
      originPrice: Math.round(item.standardPrice)
    }))

    this.setData({
      houses: houses.sort((a, b) => {
        if (a._price > b._price) return 1;
        return -1;
      })
    });
  },

  tapHouse(event) {
    const houseDetail = event.currentTarget.dataset.item;
    // TODO
    wx.navigateTo({
      url: `/pages/housing/detail/index?houseId=${houseDetail.id}`
    });
  }
});