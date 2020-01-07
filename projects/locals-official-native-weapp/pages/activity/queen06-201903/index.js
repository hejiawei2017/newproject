// pages/activity/queen06-201903/index.js
const request = require("../../../utils/request");
const BASE_API = 'https://i.localhome.cn/api';
const { joinShare, statisticsEvent, shareDataFormat } = require('../../../server/hd');
// const BASE_API = 'http://tp.localhome.cn:9999/api'
const app = getApp();

const ACTIVITY_NAME = 'queen';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    houseInfo: {},
    activeItem: "item1",
    currentHouse: [],
    showCoupon:false,

    shareTitle: "求助~12500元女王大礼快到手了，你也可以领！",
    shareImage: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/queen/queen_share.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this=this
    wx.request({
      url: "https://i.localhome.cn/queen/house_info",
      success(res) {
        // console.log(res)
        let houseInfo = { item1: [], item2: [], item3: [], item4: [] };
        res.data &&
          res.data.map(item => {
            if (item.type === "item1") {
              houseInfo.item1.push(item);
            } else if (item.type === "item2") {
              houseInfo.item2.push(item);
            } else if (item.type === "item3") {
              houseInfo.item3.push(item);
            } else if (item.type === "item4") {
              houseInfo.item4.push(item);
            }
          });
        _this.setData({
          houseInfo: houseInfo,
          currentHouse: houseInfo.item1
        });
      }
    });

    wx.request({
      url: "https://i.localhome.cn/api/common/config/1903050701735?category=hd",
      success: (res) => {
        const data = res.data;
        if (data && data.value) {
          this.setData(data.value);
        }
      }
    });
  },
  // 登录成功后的回调函数
  _cancelEventFn() {
    const { userInfo } = app.globalData;
    const channel = wx.getStorageSync('from_channel');
    if (channel) {
      joinShare({
        ticket_id: ACTIVITY_NAME,
        share_user_id: channel,
      });
    }

    let data={
      user_id: userInfo.id,
      ticket: ""
  }

    request.post(`${BASE_API}/report/index`,{
      activity_id:"1903050701735",
      payload:JSON.stringify(data)
    }).then(res=>{
      wx.hideLoading()
      
      if(res.success){
        // console.log(res.data)
        if(res.data.first){
          getApp().mtj.trackEvent('goddess_event', {
            type: '发起活动',
            message: '',
          });

          this.setData({
            showCoupon:true
          })
        }else{
          this.goInvitation()
        }
      }
      }).catch(() => wx.hideLoading())

    // if (this.data.loginType === 1) {
    //   getApp().mtj.trackEvent('activity_59_btn', {
    //     type: '首页-领取',
    //     desc: '',
    //   });
    //   this.checkCoupon(token, openId);
    // }

    // if (this.data.loginType === 2) {
    //   getApp().mtj.trackEvent('activity_59_btn', {
    //     type: '首页-发起砍价',
    //     desc: '',
    //   });
    //   this.cp();
    // }



  },
  // 切换tab
  changeTab(e) {
    let type = e.target.dataset.type;
    this.setData({ activeItem: type, currentHouse: this.data.houseInfo[type] });
  },
  goHouse(e){
    let houseId=e.currentTarget.dataset.house;
    wx.navigateTo({
      url: `/pages/housing/detail/index?houseId=${houseId}`
    })
  },
  goInvitation(){
    const { userInfo } = app.globalData;
    wx.navigateTo({
      url: `/pages/activity/queen06-201903/invitation?userId=${userInfo.id}`
    })
  },
  clothModal(){
    this.setData({showCoupon:false})
  },
  checkCoupon(){
    wx.showLoading({
      title: '加载中...',
    })
    this.selectComponent("#auth-drawer-box").checkRole();
  },
  onShareAppMessage: function() {
    const { userInfo } = app.globalData;
    const { shareTitle, shareImage } = this.data;

    return shareDataFormat({
      title: shareTitle,
      path: 'pages/activity/queen06-201903/index?userId=' + userInfo.id,
      imageUrl: shareImage
    })
  }
});
