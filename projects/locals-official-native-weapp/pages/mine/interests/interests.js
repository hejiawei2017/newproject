// pages/mine/interests/interests.js
const { getMembership } = require('../../../server/mine')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberCode:'',
    headPortrait:'',
    memberImg:''
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.selectComponent("#im-message").imLogin()
    if (app.globalData.userInfo) {
      this.setData({
        memberCode: app.globalData.userInfo.memberCardCode,
        headPortrait: app.globalData.userInfo.avatar
      })
      if(app.globalData.userInfo.memberCardCode === 'NORMAL'){
        this.setData({
          memberImg:'https://oss.localhome.cn/new_icon/normal.png'
        })
      }else if(app.globalData.userInfo.memberCardCode === 'SILVER'){
        this.setData({
          memberImg:'https://oss.localhome.cn/new_icon/silver.png'
        })
      }else if(app.globalData.userInfo.memberCardCode === 'GOLD'){
        this.setData({
          memberImg:'https://oss.localhome.cn/new_icon/gold.png'
        })
      }else if(app.globalData.userInfo.memberCardCode === 'BLACK'){
        this.setData({
          memberImg:'https://oss.localhome.cn/new_icon/black.png'
        })
      }else{
        this.setData({
          memberImg:''
        })
      }
    } else {
      this.setData({
        headPortrait: 'https://oss.localhome.cn/logo.png'
      })
    }
    //this.getMembership()
  },
  getMembership(){
    getMembership().then(res => {
      console.log(res)
    })
  }
})