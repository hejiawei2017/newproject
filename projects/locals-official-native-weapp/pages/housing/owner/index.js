const { getHouseLandlord, getHouseList, getUserDetail, getLandlordComment, followOwer} =require('../../../server/housing.js')
const { isHasLogin, showLoading, catchLoading } = require('../../../utils/util')
var app = getApp()

Page({
  landlordRectBottom: null,
  boundingClientRects: null,
  data: {
    isCompleteLoading: false,
    isFullScreen: app.globalData.isFullScreen,
    memberId: '',
    houseOwner: {},
    houseList: [],
    comments: [],
    houseCount: 0,
    defaultAvatar: app.globalData.defaultAvatar,
    defaultHouseImage: app.globalData.defaultHouseImage,
    isFollow: false,
    show: false,
    willDoSomething: '',
    avgPoint: 0,
    numbersOfComment: 0,
    isShowTab: false,
    tabs: [
      {
        isSelect: true,
        label: '房源'
      },
      { 
        isSelect: false,
        label: '评论'
      }
    ]
  },
  onLoad(options) {
    this.selectComponent("#im-message").imLogin()
    this.setData({
      pageNum: 1,
      pageSize: 999,
      memberId: options.memberId || ''
    })
    this.getHouses()
    this.getComments()
    this.getLandlord()
    this.getUser()
  },
  onPageScroll({ scrollTop }) {
    this.getContainerPostion(() => {
      let { landlordContainer, houseContainer, commentContainer, tabsContainer } = this.boundingClientRects
      scrollTop += tabsContainer.height
      if (scrollTop >= landlordContainer.bottom) {
        if (houseContainer) {
          if (scrollTop >= houseContainer.top && scrollTop < houseContainer.bottom) {
            this.setNewTabs(0)
          }
        }
        if (commentContainer) {
          if (scrollTop >= commentContainer.top && scrollTop < commentContainer.bottom) {
            this.setNewTabs(1)
          }
        }
      } else if (this.data.isShowTab) {
        this.setData({
          isShowTab: false
        })
      }
    })
  },
  signInCallback() {
    if (isHasLogin() && this.data.willDoSomething === 'follow') {
      this.followOwer()
    }
  },
  getHouses(){
    wx.showLoading({
      title: '加载中...',
    })
    let params={
      pageNum: 1,
      pageSize: 50,
      limitImage: 1,
      landlordId:this.data.memberId
    }
    getHouseList(params)
    .then(res => {
      let { total, list } = res.data
      list.forEach(item => {
        item['toiletNumber'] = (item.toiletNumber || 0) + (item.publicToiletNumber || 0)
        // 优化内存
        this.deleteObj(item, ['designNameImageOss', 'rankingNumber', 'designerInfo', 'navigationInfo', 'housingInfo', 'summary', 'houseType', 'clearPrice', 'weekPrice', 'deposit', 'countryCode', 'countryName', 'areaCode', 'areaName', 'cityCode', 'cityName', 'cityEnName', 'provinceName', 'provinceCode', 'address', 'houseArea', 'createTime', 'facilities'])
        delete item['landlord']['introduce']
        delete item['landlord']['nickName']
        delete item['landlord']['sex']
      })
      this.setData({
        houseCount: total,
        houseList: list
      })
      wx.hideLoading()
    })
  },
  deleteObj(item, keys = []) {
    keys.forEach(key => {
      delete item[key]
    })
  },
  navigateToAllComment() {
    let { memberId } = this.data
    wx.navigateTo({
      url: `/pages/comment/list/index?memberId=${memberId}`
    })
  },
  getLandlord() {
    let params = this.data.memberId
    getHouseLandlord(params)
      .then(res=>{
        this.setData({
          houseOwner:{
            id: res.data.userId,
            avatar: res.data.avatar,
            name: res.data.nickName,
            introduce: res.data.introduce,
            label: res.data.label,
            createTime: res.data.createTime
          },
          show:true
        })
      })
  },
  getUser() {
    let params = this.data.memberId
    getUserDetail(params).then(res => {
        this.setData({
          isFollow: res.data.isFollow || '',
          show: true
        })
      })
  },
  getComments() {
    let params={
      toMemberId: this.data.memberId,
      pageSize: 10,
      pageNum: 1
    }
    getLandlordComment(params)
      .then( res => {
        let { numbersOfComment, avgPoint, list } = res.data
        avgPoint = Math.round(avgPoint * 10) / 10
        this.setData({
          avgPoint,
          comments: list,
          numbersOfComment
        })
      })
  },
  followLandlord() {
    if(isHasLogin()){
      this.followOwer()
    }else{
      this.setData({
        willDoSomething: 'follow'
      })
      this.selectComponent("#auth-drawer-box").showAuthBox()
    }
  },
  followOwer() {
    let params={
      userId: app.globalData.userInfo.id,
      followUserId: this.data.houseOwner.id
    }
    showLoading()
    followOwer(params)
      .then(res => {
        this.setData({
          isFollow: !this.data.isFollow
        })
        wx.hideLoading()
      })
      .catch( e =>{
        console.log(e)
        catchLoading(e)
      })
  },
  handleBooking(e) {
    let { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/housing/detail/index?houseId=' + id
    })
  },
  avatarError(e) {
    let { id, type } = e.currentTarget.dataset

    if (type === 'landlord-avatar') {
      this.setData({
        houseOwner: {
          ...this.data.houseOwner,
          avatar: this.data.defaultAvatar
        }
      })
    } else {
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
  },
  previewImage(e) {
    let { src } = e.currentTarget.dataset
    wx.previewImage({
      urls: [src]
    })
  },
  handleClickTabs(e) {
    let { index, label } = e.currentTarget.dataset
    
    this.setNewTabs(index, () => {
      this.getContainerPostion(() => {
        this.handleTabsScroll(label)
      })
    })
  },
  setNewTabs(index, callback) {
    let { tabs } = this.data
    
    let newTabs = tabs.map((item, key) => {
      let isSelect = false
      if (key === index) {
        isSelect = true
      }
      return {
        ...item,
        isSelect
      }
    })
    this.setData({
      tabs: newTabs,
      isShowTab: true
    }, callback)
  },
  handleTabsScroll(label) {
    if (this.boundingClientRects) {
      let { houseContainer, commentContainer } = this.boundingClientRects
      switch(label) {
        case '房源':
          this.scrollTo(houseContainer.top)
          break
        case '评论':
          this.scrollTo(commentContainer.top)
          break
      }
    }
  },
  scrollTo(scrollTop) {
    wx.pageScrollTo({
      scrollTop
    })
  },
  getContainerPostion(callback) {
    let currentTimesamp = (new Date()).valueOf()
    let delay = 100

    if (!this.lastTimesamp || currentTimesamp - this.lastTimesamp >= delay) {
      const query = wx.createSelectorQuery()
      query.select('.house-container').boundingClientRect()
      query.select('.comment-list-container').boundingClientRect()
      query.select('.landlord-info').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.select('.float-tabs').boundingClientRect()
      query.exec(res => {
        let houseContainer = null;
        let commentContainer = null;
        let landlordContainer = null;
        if (res[0]) {
          houseContainer = {
            ...res[0],
            top: res[0]['top'] + res[3]['scrollTop'] - res[4]['height'],
            bottom: res[0]['bottom'] + res[3]['scrollTop'] - res[4]['height']
          }
        }
        if (res[1]) {
          commentContainer = {
            ...res[1],
            top: res[1]['top'] + res[3]['scrollTop'] - res[4]['height'],
            bottom: res[1]['bottom'] + res[3]['scrollTop'] - res[4]['height']
          };
        }
        if (res[2]) {
          landlordContainer = {
            ...res[2],
            bottom: res[2]['bottom'] + res[3]['scrollTop']
          };
        }
        this.boundingClientRects = {
          houseContainer,
          commentContainer,
          landlordContainer,
          tabsContainer: res[4]
        }
        this.lastTimesamp = (new Date()).valueOf()
        callback && callback()
      })
    }
   
  }
})