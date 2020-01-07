const { getHouseLandlord, getHouseList, getUserDetail, getHouseComment, followOwer} =require('../../../server/housing.js')
const { isHasLogin, showLoading, catchLoading } = require('../../../utils/util')
const request = require('../../../utils/request.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFullScreen: app.globalData.isFullScreen,
    memberId: '',
    houseOwner: {},
    houseList: [],
    comments: [],
    total: 0,
    defaultAvatar: app.globalData.defaultAvatar,
    willDoSomething: ''
  },
  onShareAppMessage () {
    return {
      title: '精品度假酒店'
    }
  },
  onPullDownRefresh() {
    this.getHouses()
  },
  onLoad: function (options) {
    this.selectComponent("#im-message").imLogin()
    this.setData({
      pageNum: 1,
      pageSize: 999,
      memberId: options.memberId || ''
    })
    this.getHouses()
  },
  getHouses(){
    wx.showLoading({
      title: '加载中...',
    })
    let params={
      pageNum: 1,
      pageSize: 100,
      landlordId:this.data.memberId
    }
    let self = this
      try {
        wx.request({
          url: `https://oss.localhome.cn/wechat/landlord_${this.data.memberId}.json?v=${Math.random(0, 1)}`,
          success: function(houseResult) {
            getHouseList(params)
              .then(res => {
                let { houseList = [] } = houseResult.data
                let { list } = res.data
                list = list.filter(item => {
                  item['toiletNumber'] = (item.toiletNumber || 0) + (item.publicToiletNumber || 0)
                  if (houseList.indexOf(item.houseNo) > -1) {
                    return true
                  } else {
                    return false
                  }
                })
                self.setData({
                  houseList: list
                })
                wx.stopPullDownRefresh()
                wx.hideLoading()
              })
              .catch(e => {
                catchLoading(e)
              })
          },
          complete: function (e) {
            if (String(e.statusCode) !== '200') {
              getHouseList(params)
              .then( res => {
                let { list } = res.data
                self.setData({
                  houseList: list
                })
                wx.hideLoading()
              })
              .catch(e => {
                catchLoading(e)
              })
            }
          }
        })
      } catch(e) {
        console.log(e)
        catchLoading(e)
      }
  },
  goToHouseDetail(e) {
    let houseSourceId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/housing/detail/index?houseId=' + houseSourceId
    })
  },
  avatarError(e) {
    let { id } = e.currentTarget.dataset
    let { comments } = this.data

    for (let i = 0; i < comments.length; i++) {
      if (comments[i]['id'] === id) {
        comments[i]['memberImgPath'] = this.data.defaultAvatar
      }
    }

    this.setData({
      comments
    })
  }
})