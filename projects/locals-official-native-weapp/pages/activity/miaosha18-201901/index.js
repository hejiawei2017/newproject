// pages/activity/miaosha/index.js
const app = getApp();
const { miniPay, wxPay } = require("../../../server/order");
const { showLoading, catchLoading, shareDataFormat } = require("../../../utils/util");
import request from "../../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    buttonText: "9元 立即支付",
    // 根据库存数量，判断是否还能购买
    over: false,
    // 是否已经购买
    isHave: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    request.get("/mall/item/931070414685876251").then(e => {
      console.log(parseInt(e.data.quantity, 10));
      let left=parseInt(e.data.quantity, 10)
      if (e.success) {
        this.setData({
          over: !(left >= 1)
        });
      }
    });

    setTimeout(() => {
      this.selectComponent("#auth-drawer-box").checkRole();
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
    return shareDataFormat({
      title: "路客民宿9元住，20万新春现金红包人人有份~",
      path: "/pages/activity/miaosha18-201901/index",
      imageUrl:
        "https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/share.pn"
    });
  },
  // 登录成功后的回调函数
  _cancelEventFn() {
    let token = wx.getStorageSync("token");
    let openId = wx.getStorageSync("openId");
    this.checkStatues(token, openId);
  },
  // 下单
  doOrder() {
    showLoading();
    request
      .post("mall/trade/item", {
        sourcePlatform: "MP",
        trades: [
          {
            itemId: "931070414685876251",
            totalFee: "2900",
            buyNum: 1
          }
        ]
      })
      .then(e => {
        wx.hideLoading();
        if (e.success) {
          // isAuthenticated为真有购买资格
          console.log(e.data);

          let openId = wx.getStorageSync("openId");
          // 订单创建后，调起微信支付
          let params = {
            accountId: 7,
            isInvoice: false,
            tradeType: "JSAPI",
            outTradeNo: e.data.orderInfo.id,
            amount: e.data.orderInfo.payment / 100,
            currency: "CNY",
            source: "MALL", // 不能修改
            body: "小程序支付",
            openId: openId
          };
          wxPay(params)
            .then(res => {
              wx.showToast({
                title: "支付成功！",
                icon: "none",
                duration: 2000 //持续的时间
              });
              setTimeout(() => {
                wx.reLaunch({
                  url: "/pages/index/index"
                });
              }, 2000);
            })
            .catch(e => {
              wx.redirectTo({
                url: "./"
              });
            });
        } else {
          // 请求不成功的情况
          wx.showToast({
            title: "抢光了，待会再来吧！",
            icon: "none",
            duration: 2000 //持续的时间
          });
        }
      })
      .catch(e => {
        wx.hideLoading();
        console.log(e);
        wx.showToast({
          title: "抢光了，待会再来吧！",
          icon: "none",
          duration: 2000 //持续的时间
        });
      });
  },
  // 检差状态
  checkStatues() {
    // const now = new Date();
    // const startTime=new Date("2019/01/21 00:00:00")
    // if(now<startTime){
    //   wx.showToast({
    //     title: '活动还没开始,21日再来吧',
    //     icon: 'none',
    //     duration: 2000//持续的时间
    //   })
    //   return
    // }

    if (this.data.over) {
      wx.showToast({
        title: "这个时间段的劵抢光了，下一个时间段再来吧！",
        icon: "none",
        duration: 2000 //持续的时间
      });
      return;
    }
    showLoading();
    request
      .post("mall/purchase-right/grant", {
        itemId: "931070414685876251",
        buyNum: "1"
      })
      .then(res => {
        wx.hideLoading();
        if (res.success) {
          // isAuthenticated为真有购买资格
          console.log(res);
          this.setData({
            isHave: res.data.isAuthenticated
          });
        } else {
          // 请求不成功的情况
          wx.showToast({
            title: "网络出错啦,请稍后再试,错误码003",
            icon: "none",
            duration: 2000 //持续的时间
          });
        }
      });
  }
});
