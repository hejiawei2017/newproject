// pages/info/collect/collect.js
var app = getApp();
const { getCollct,getCollctLand } = require('../../../server/mine')
const { postCollct } = require('../../../server/housing');
const { showLoading,catchLoading } = require('../../../utils/util')
Page({
   data: {
    defaultAvatar: app.globalData.defaultAvatar,
    pageNum: 1,
    pageSize: 20,
    collectData: [],
    indicatorDots: true,
    autoplay: false,
    heartHot: 'https://oss.localhome.cn/new_icon/heart-hot.png',
    isLoading:true,
    isHasNextPage:true,
    activeIndex:0,
    landlordData:''
  },
  onShow () {
    this.selectComponent("#im-message").imLogin()
    let params = {
      'pageNum': this.data.pageNum,
      'pageSize': this.data.pageSize
    }
    this.init(params);
  },
  tabClick(e){
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
  },
  onReachBottom () {
    let that = this;
    let n = parseInt(that.data.pageNum) + 1
    if(n <= that.data.pages){
      let params = {
        'pageNum':n,
        'pageSize': 20
      }
      // 显示加载图标
      // wx.showLoading({
      //   title: '玩命加载中',
      // })
      that.init(params)
    }else{
      //wx.hideLoading();
    }
  },
  init(params){
    this.setData({
      isLoading:true,
    })
    getCollct(params).then((res) => {
      let list = res.data.list
      // 处理数据
      list.forEach((item, index) => {
        list[index]['id'] = item.houseSourceId
        list[index]['stars'] = item.avgStars
        list[index]['houseImages'] = [{
          imagePath: item.houseImgPath
        }]
        list[index]['landlord'] = {
          avatar: item.memberHeadImg
        }
        list[index]['title'] = item.houseTitle
        let tags = []
        if (Array.isArray(item.tagName) && item.tagName.length > 0) {
          item.tagName.forEach((value, index) => {
            tags.push({
              tagName: value,
              tagId: index
            })
          })
        }
        list[index]['tags'] = tags
      })
      this.setData({
        collectData: list,
        isLoading: false,
        isHasNextPage: res.data.hasNextPage
      })
    }).catch((e) => {
      console.log(e)
      catchLoading(e)
      this.setData({
        isLoading:false,
      })
    })
    if(app.globalData.userInfo){
      let pm = {
        'userId': app.globalData.userInfo.id,
        'pageNum':1,
        'pageSize': 200
      }
      getCollctLand(pm).then((res)=>{
        this.setData({
          landlordData: res.data.list
        })
      })
    }
  },
  //取消收藏
  collection(e){
    e.stopPropagation
    e.preventDefault
    let params = {
      houseSourceId:e.currentTarget.dataset.id
    }
    postCollct(params).then((res)=>{
      this.setData({
        isFavorate: false
      })
      wx.showToast({
        title: '已取消收藏~',
        icon: 'none'
      })
      this.init()
    })
  },
  _cancelEventFn() {
    this.selectComponent("#im-message").imLogin()
  }

})