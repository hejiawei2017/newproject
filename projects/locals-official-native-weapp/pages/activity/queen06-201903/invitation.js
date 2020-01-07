// pages/activity/queen06-201903/invitation.js
const BASE_API = 'https://i.localhome.cn/api';
// const BASE_API = 'http://tp.localhome.cn:9999/api';
const { joinShare, statisticsEvent } = require('../../../server/hd');
const request = require('../../../utils/request');
const AID = "1903050701735";
const app = getApp();
const ACTIVITY_NAME = 'queen';

function ajax(uri, method, options) {
  return request[method](BASE_API + uri, options);
}

let t = 0;
let formId = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    houseInfo: {},
    activeItem: "item1",
    currentHouse: [],

    timingContainer: ["00", "00", "00"],
    activityEnd: false,

    isMaster: false,
    parentUserId: "",
    activityData: {},

    receiveGiftModal: false,
    received: false,
    helpSuccessModal: false,

    shareTitle: "求助~12500元女王大礼快到手了，你也可以领！",
    shareImage: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/queen/queen_share.png',
    noBlack: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    this.setData({
      parentUserId: options.userId,
    })

    wx.request({
      url: "https://i.localhome.cn/queen/house_info",
      success(res) {
        // console.log(res)
        let houseInfo = {
          item1: [],
          item2: [],
          item3: [],
          item4: []
        };
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
          this.setData(data.value)
        }
      }
    });
  },
  // 切换tab
  changeTab(e) {
    let type = e.target.dataset.type;
    this.setData({
      activeItem: type,
      currentHouse: this.data.houseInfo[type]
    });
  },
  goHouse(e) {
    let houseId = e.currentTarget.dataset.house;
    wx.navigateTo({
      url: `/pages/housing/detail/index?houseId=${houseId}`
    });
  },
  closeModal(){
    // this.setData({showCoupon:false})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取好友
    wx.showLoading({
      title: '读取女王分中...',
    })
    this.selectComponent("#auth-drawer-box").checkRole();
  },

  /**
   * 送好友女王分
   */
  giveGoddessScore({ detail }) {
    formId = detail.formId;
    const userInfo = wx.getStorageSync('userInfo');
    wx.showLoading({
      title: '赠送中，请稍等...',
    })
    ajax('/report/index/friend', 'put', {
        activity_id: AID,
        payload: JSON.stringify({
          master_user_id: userInfo.id,
          parent_user_id: this.data.parentUserId,
          formId: formId,
        })
      })
      .then(() => {
        // TODO: 赠送成功弹出提示框
        wx.hideLoading();
        getApp().mtj.trackEvent('goddess_event', {
          type: '赠送分',
          message: '',
        });
        this.setData({
          helpSuccessModal: true
        })
      })
      .catch(({
        errorMsg
      }) => {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: errorMsg || '赠送失败，请稍后再试',
          showCancel: false,
        })
      })
  },

  closeModal({ currentTarget }) {
    const { close } = currentTarget.dataset;
    this.setData({ [close]: false })
  },

  receiveGift({ detail }) {
    formId = detail.formId;
    if (this.data.activityEnd) {
      wx.showModal({
        title: '提示',
        content: '倒计时已结束',
        showCancel: false,
      })
      return
    }
    this.setData({
      receiveGiftModal: true
    })
  },

  /**
   * 用户领取
   */
  realReceiveGift() {
    const userInfo = wx.getStorageSync('userInfo')
    ajax('/report/index', 'get', {
      activity_id: AID,
      payload: JSON.stringify({
        user_id: userInfo.id,
        formId: formId,
      })
    })
    .then((res) => {
      getApp().mtj.trackEvent('goddess_event', {
        type: '领取礼包',
        message: '',
      });
      statisticsEvent({
        event: 'attend',
        share_user: wx.getStorageSync('from_channel'),
        activity_name: ACTIVITY_NAME,
      });
      this.setData({ received: true })
    })
    .catch(({ errorMsg }) => {
      wx.showModal({
        title: '提示',
        content: errorMsg,
        showCancel: false,
      })
    })
  },

  navi({ currentTarget }) {
    const { path, navi } = currentTarget.dataset;
    if (navi) {
      wx.navigateTo({
        url: path,
      })
      return
    }
    wx.switchTab({
      url: path,
    })
  },

  _cancelEventFn() {
    const {
      parentUserId
    } = this.data;
    const userInfo = wx.getStorageSync("userInfo")
    this.setData({
      isMaster: userInfo.id === parentUserId,
      userInfo: userInfo
    });

    const channel = wx.getStorageSync('from_channel');
    if (channel) {
      joinShare({
        ticket_id: ACTIVITY_NAME,
        share_user_id: channel,
      });
    }

    // 获取用户的活动数据
    ajax('/report/index/data', 'get', {
        activity_id: AID,
        payload: JSON.stringify({
          user_id: parentUserId
        })
      })
      .then(({
        data
      }) => {
        wx.hideLoading()
        this.setData({
          activityData: data,
          received: data.receive_gift || false,
        });
        const endTime = data.start_time + 1000 * 60 * 60 * 24;
        if (Date.now() < endTime) {
          console.info('this.timing', this.timing)
          this.timing(endTime);
          return
        }

        this.setData({ activityEnd: true });
      })
      .catch((error) => {
        console.info(error)
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: error.errorMsg || "网络繁忙，请稍后再试",
          showCancel: false,
        })
      })
  },

  timing(start_time) {
    const now = new Date();
    const end = new Date(start_time);
    let diff = end - now;

    function toTwoBit(number) {
      return number < 10 ? `0${number}` : number.toString();
    }

    function compute() {
      const h = Math.floor((diff / 1000 / 60 / 60) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      return [toTwoBit(h), toTwoBit(m), toTwoBit(s)];
    }

    this.setData({
      timingContainer: compute()
    });

    t = setInterval(() => {
      diff -= 1000;
      if (diff <= 0) {
        this.setData({ activityEnd: true });
        clearInterval(t);
      }
      this.setData({
        timingContainer: compute()
      });
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    const { userInfo } = app.globalData;
    const { shareTitle, shareImage } = this.data;
    return {
      title: shareTitle,
      path: `pages/activity/queen06-201903/invitation?userId=` + userInfo.id,
      imageUrl: shareImage
    }
  }
});