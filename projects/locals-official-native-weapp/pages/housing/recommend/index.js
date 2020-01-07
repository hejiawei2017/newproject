const app = getApp()
const { getHouseList, postCollct } = require('../../../server/housing')
const { getMemberCard } = require('../../../server/mine')
const { isHasLogin } = require('../../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    defaultAvatar: app.globalData.defaultAvatar,
    houseList: [],
    isLoading: false,
    isRequestError: false,
    isUpperLoading: false,
    isHasNextPage: true,
    longitude: '',
    latitude: '',
    pageNum: 1,
    pageSize: 20,
    emptyHouse: false,
    isHasLogin: isHasLogin(),
    memberCardInfo: null
  },
  onLoad(options) {
    getApp().mtj.trackEvent('detail_periphery_house');
    let { longitude, latitude, houseId } = options
    this.setData({
      houseId: houseId || '',
      // 经纬度
      longitude: longitude || '',
      latitude: latitude || ''
    })
    this.getMemberCardInfo()
  },
  onShow() {
    this.setData({
      isHasLogin: isHasLogin()
    })
    this.getHouses()
  },
  onReachBottom () {
    if (this.data.isHasNextPage) {
      this.setData({
        isLoading: true
      })
      this.getHouses()
    } else {
      wx.showToast({
        title: '到底了~',
        icon: 'none'
      })
    }
  },
  getMemberCardInfo() {
    let userInfo = wx.getStorageSync('userInfo')
    let params = {
      code: 'GOLD'
    }
    if (userInfo && userInfo.memberCardCode) {
      params.code = userInfo.memberCardCode
    }
    
    getMemberCard(params)
      .then(res => {
        let { data: memberCardInfo } = res
        if (memberCardInfo) {
          this.setData({
            isHasLogin: isHasLogin(),
            memberCardInfo
          })
        }
      })
      .catch(e => {
        console.log('getMemberCard', e)
      })
  },
  getHouses() {
    this.setData({ isLoading: true })
    let params = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      longitude: this.data.longitude,
      latitude: this.data.latitude
    }
    getHouseList(params)
      .then(res => {
        wx.hideLoading()
        let { list } = res.data
        let newList = []
        if (Array.isArray(list) && list.length > 0){
          list.forEach((item, index) => {
            if (this.data.houseId === item.id) {
              // 过滤详情进来的房源
              return true
            }
            let tags = []
            // 将标签合并
            if (Array.isArray(item.bizTag) && item.bizTag.length > 0) {
              tags = tags.concat(item.bizTag)
            }
            if (Array.isArray(item.customTag) && item.customTag.length > 0) {
              tags = tags.concat(item.customTag)
            } 
            // 处理距离poi的距离
            if (item.locationDistance) {
              let locationDistance = parseInt(item.locationDistance)
              if (locationDistance >= 1000) {
                locationDistance = locationDistance / 1000
                locationDistance = locationDistance.toFixed(1) + '公里'
              } else {
                locationDistance = locationDistance + '米'
              }
              list[index]['locationDistance'] = locationDistance
            }
            
            list[index]['tags'] = tags
            // 处理stars
            list[index]['stars'] = Math.round(item.stars)
            // 检查房东头像是否存在
            if (!item.landlord) {
              list[index]['landlord'] = {}
            }
            if (!list[index]['landlord']['avatar']) {
              list[index]['landlord']['avatar'] = this.data.defaultAvatar
            }

            newList.push(list[index])
          })

          this.setData({
            isLoading: false,
            isRequestError: false,
            isUpperLoading: false,
            isHasNextPage: res.data.hasNextPage,
            pageNum: this.data.pageNum + 1,
            houseList: this.data.pageNum === 1 ? newList : this.data.houseList.concat(newList)
          })
        }else{
          this.setData({
            longitude: '',
            latitude: ''
          })
          this.getHouses()
        }
      })
      .catch((e) => {
        this.setData({
          isLoading: false,
          isRequestError: true
        })
        wx.hideLoading()
      })
  },
  collection(e) {
    let houseSourceId = e.detail.id
    let houseList = this.data.houseList
    let params = {
      houseSourceId
    }
    // 判断是否登录，否则唤起登录
    if (!isHasLogin()) {
      this.setData({
        isShowAuth: true
      })
      this.selectComponent("#auth-drawer-box").showAuthBox()
    } else {
      postCollct(params).then((res)=>{
        houseList.forEach((item, index) => {
          if (item.id === houseSourceId) {
            houseList[index]['isFav'] = res.data === 'create' ? true : false
          }
        })
        this.setData({
          houseList
        })
        if(res.data === 'create'){
          wx.showToast({
            title: '收藏成功~',
            icon: 'none'
          })
        }else if(res.data === 'delete'){
          wx.showToast({
            title: '已取消收藏~',
            icon: 'none'
          })
        }
      })
    }
  },
  goToLandlord(e) {
    let { landlord } = e.currentTarget.dataset.item
    if (landlord && landlord.userId) {
      wx.navigateTo({
        url: '/pages/housing/owner/index?memberId=' + landlord.userId
      })
    }
  },
})