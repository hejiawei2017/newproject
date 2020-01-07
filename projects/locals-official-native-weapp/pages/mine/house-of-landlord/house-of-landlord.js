const { getHouseLandlord, getHouseList, getUserDetail, getLandlordComment, followOwer } = require('../../../server/housing.js')
const { isHasLogin, showLoading, catchLoading } = require('../../../utils/util')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseList: [],
    hasNextPage:true,
    pageNum:1,
    pageSize:8,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const { landlordId = '929958907563348709' } = options
    // this.setData({
    //   landlordId
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getHouses();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  handleBooking(e) {
    let { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/housing/detail/index?houseId=' + id
    })
  },

  getHouses() {
    wx.showLoading({
      title: '加载中...',
    })
    const {pageNum,pageSize} = this.data
    let params = {
      pageNum,
      pageSize,
      limitImage: 1,
      // landlordId: '929958907362021377'
      landlordId:app.globalData.userInfo.id
    }
    getHouseList(params)
      .then(res => {
        let { total, list, hasNextPage } = res.data
        list.forEach(item => {
          item['toiletNumber'] = (item.toiletNumber || 0) + (item.publicToiletNumber || 0)
          // 优化内存
          this.deleteObj(item, ['designNameImageOss', 'rankingNumber', 'designerInfo', 'navigationInfo', 'housingInfo', 'summary', 'houseType', 'clearPrice', 'weekPrice', 'deposit', 'countryCode', 'countryName', 'areaCode', 'areaName', 'cityCode', 'cityName', 'cityEnName', 'provinceName', 'provinceCode', 'address', 'houseArea', 'createTime', 'facilities'])
          delete item['landlord']['introduce']
          delete item['landlord']['nickName']
          delete item['landlord']['sex']
        })
        let {houseList} = this.data
        this.setData({
          hasNextPage,
          houseCount: total,
          houseList: houseList.concat(list)
        })
        wx.hideLoading()
      })
  },

  deleteObj(item, keys = []) {
    keys.forEach(key => {
      delete item[key]
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.hasNextPage)
      return
    this.setData({
      pageNum: this.data.pageNum + 1
    })
    this.getHouses();
  },

})