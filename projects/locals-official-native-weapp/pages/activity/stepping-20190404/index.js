const app = getApp();
const { miniPay, wxPay, waitPay } = require('../../../server/order');
const { joinShare, statisticsEvent } = require('../../../server/hd');
const { showLoading, catchLoading } = require('../../../utils/util');
const { springRelation } = require('../../../server/index');
const request = require('../../../utils/request');

const SOTRAGE_SURPLUS = '__COUPON29_SURPLUS__';
const SOTRAGE_SEED = '__SOTRAGE_SEED__';
const DEFAULT_SURPLUS = 100;
const STAGE2_SURPLUS = 40;
const DEFAULT_SEED = [1, 1, 1, 1, 1, 0, 0, 0];
let t = 0;
let t1 = 0;
// 防止多次点击
let buyying = false

const ACTIVITY_NAME = 'coupon29-201812';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 是否有资格购买
    isAuthenticated: false,
    // 是否为新用户（新用户才有资格参加活动）
    isNew: true,
    // 是否是黑名单用户
    isBlackList: false,
    // 是否已经购买
    isHave: false,
    // 规则展示更多
    showRuleDetails: false,
    // 根据库存数量，判断是否还能购买
    over: true,
    // 弹窗状态
    popUp: false,
    // 测试用messege
    messege: 'empty',

    surplus: 100,

    timingContainer: ['00', '00', '00'],
    // 渠道号
    channel:null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let { sid, springRalationFromUserId,channel } = options;
    // 记录渠道号
    channel && this.setData({channel:channel})
    if (sid) {
      app.globalData.sid = sid;
    }



    if (!!springRalationFromUserId) {
      app.globalData.taskList.push(userInfo => {
        springRelation({
          from_user_id: springRalationFromUserId,
          id: userInfo.id,
          city: 'miniprogram-city',
        });
      });
    }
  },

  onUnload() {
    clearInterval(t)
    clearTimeout(t1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 启动倒计时
    // 计算剩余多少人
    const now = new Date();
    // 如果今天是第一次进来，则还原数据
    const flag = `${now.getFullYear()}/${now.getMonth()}/${now.getDate()}`
    if (!wx.getStorageSync(flag)) {
      wx.setStorageSync(SOTRAGE_SURPLUS, DEFAULT_SURPLUS)
      wx.setStorageSync(SOTRAGE_SEED, DEFAULT_SEED)
      wx.setStorageSync(flag, 1)
    }

    let surplus = wx.getStorageSync(SOTRAGE_SURPLUS) || DEFAULT_SURPLUS;
    let randSeed = wx.getStorageSync(SOTRAGE_SEED) || DEFAULT_SEED;
    // 一点之后设置成 80 以下个
    if (now.getHours() > 1 && surplus > 80) {
      surplus = Math.ceil(80 - Math.random() * 10);
      randSeed.push.apply(randSeed, [0, 0, 0, 0, 0]);
    }

    // 早点八点设置成 40 个
    if (now.getHours() > 8 && surplus > 40) {
      surplus = Math.ceil(40 - Math.random() * 10);
    }
    
    if (surplus < 40 && randSeed.length < 20) {
      randSeed.push.apply(randSeed, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }

    wx.setStorageSync(SOTRAGE_SURPLUS, surplus)
    wx.setStorageSync(SOTRAGE_SEED, randSeed)
    this.timingSurplus();
    this.timing();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    request.get('/mall/item/931070414685876247').then(e => {
      if (e.success) {
        this.setData({
          // over:false
          over: !(parseInt(e.data.quantity, 10) > 1), //弹窗引导下一步
        });
      }
    });
  },

  // 自定义方法
  shareTimeline() {
    // 保证每次生成新poster
    wx.removeStorageSync('__POSTER_STORAGE_KEY__')
    wx.navigateTo({
      url: '/pages/activity/stepping-20190404/poster',
    });
  },

  timeout() {
    const now = new Date();
    const beginEnd = 235500
    const endEnd = 235959
    const current = Number(`${now.getHours()}${now.getMinutes()}${now.getSeconds()}`)
    return current >= beginEnd && current <= endEnd;
  },

  /**
   * 计算还剩多少参与人
   */
  computeSurplus() {
    const now = new Date();

    if (this.timeout()) {
      this.setData({ surplus: 0 })
      return 0;
    }

    let preSurplus = wx.getStorageSync(SOTRAGE_SURPLUS) || DEFAULT_SURPLUS;
    let randSeed = wx.getStorageSync(SOTRAGE_SEED) || DEFAULT_SEED;

    let surplus = preSurplus;

    if (now.getHours() >= 0 && now.getHours() <= 1 && surplus > 60) {
      const basis = Math.round(Math.random());
      surplus -= basis * Math.round(Math.random()) * ((surplus - 40) * 0.1);
    } else {
      const basis =
        randSeed[Math.ceil(Math.random() * randSeed.length - 1)];
      surplus -= basis * Math.ceil(Math.random() * ((surplus - 3) * 0.05));
    }

    const diff = surplus != preSurplus;
    if (diff) {
      randSeed.push(0);
    }

    if (surplus <= 40 && surplus > 3) {
      if (randSeed.filter(v => v).length > 1 && diff) {
        randSeed.splice(0, Math.round(Math.random()));
      }
    }

    wx.setStorageSync(SOTRAGE_SURPLUS, surplus);
    wx.setStorageSync(SOTRAGE_SEED, randSeed);
    this.setData({ surplus: Math.ceil(surplus) });
    return surplus;
  },

  timingSurplus() {
    this.computeSurplus();
    t1 = setTimeout(() => {
      this.timingSurplus();
    }, 1000 + 1000 * Math.random());
  },

  timing() {
    const tmpDate = new Date();
    tmpDate.setHours(23);
    tmpDate.setMinutes(55);
    tmpDate.setSeconds(0);
    const now = new Date();
    const end = new Date(tmpDate);
    tmpDate.setHours(24);
    const start = new Date(tmpDate);
    if (now > tmpDate && now < end) {
      return;
    }

    this.setData({ buttonDisabled: true });
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

    this.setData({ timingContainer: compute() });
    t = setInterval(() => {
      diff -= 1000;
      if (diff <= 0) {
        clearInterval(t);
      }
      this.setData({ timingContainer: compute() });
    }, 1000);
  },

  // 领券判断
  handleClick() {
    // 调用登录组件
    if (this.timeout()) {
      this.setData({ surplus: 0 })
      return 0;
    }
    this.selectComponent('#auth-drawer-box').signInSuccessCallback();
  },

  // 登录成功后的回调函数
  _cancelEventFn() {
    let token = wx.getStorageSync('token');
    let openId = wx.getStorageSync('openId');
    this.checkCoupon(token, openId);

    const channel = wx.getStorageSync('from_channel');
    if (channel) {
      joinShare({
        ticket_id: ACTIVITY_NAME,
        share_user_id: channel,
      });
    }
  },

  // 领券操作
  checkCoupon(token, openId) {
    // 防止多次点击
    if (buyying) return
    buyying = true
    wx.showLoading({
      title: '加载中..',
      mask: true
    })
    waitPay({ itemId: '931070414685876247' })
    .then(({ data }) => {
      wx.hideLoading()
      const orderInfo = data && data.orderInfo;
      if (!data || !orderInfo || orderInfo.tradeStatus !== 0) {
        normalProcess()
        return
      }
      
      this.doPay(orderInfo);
    })
    const now = new Date();
    const normalProcess = () => {
      if (this.data.over) {
        wx.showToast({
          title:
            now.getHours() < 14
              ? '活动还没开始哦，14：00准时开抢！'
              : '今日的券抢光了，请明天14:00再来吧！',
          icon: 'none',
          duration: 2000, //持续的时间
        });
        return
      }

      showLoading();

      request
        .post('mall/purchase-right/grant', {
          itemId: '931070414685876247',
          buyNum: '1',
        })
        .then(e => {
          wx.hideLoading();
          if (e.success) {
            // isAuthenticated为真有购买资格
            this.setData({
              isAuthenticated: e.data.isAuthenticated,
              isBlackList:
                e.data.itemPurchaseRights[0].isAuthenticated ||
                e.data.itemPurchaseRights[1].isAuthenticated,
              isNew: e.data.itemPurchaseRights[2].isAuthenticated,
              isHave: e.data.itemPurchaseRights[3].isAuthenticated,
              popUp: true,
            });
            // 逻辑修改：有权限购买的新人直接支付，不做弹窗处理   修改时间：2019/3/14 
            if (e.data.isAuthenticated) {
              this.setData({
                popUp: false, 
              })
              this.doOrder()
            }

            if (e.data.isAuthenticated) {
              const surplus = (wx.getStorageSync(SOTRAGE_SURPLUS) || 3) - 1
              wx.setStorageSync(SOTRAGE_SURPLUS, surplus)
              this.setData({ surplus })
            }
          } else {
            // 请求不成功的情况
            wx.showToast({
              title: '活动火爆，请稍后再试。',
              icon: 'none',
              duration: 2000, //持续的时间
            });
          }
          // 防止多次点击
          buyying = false
        })
        .catch(e => {
          wx.hideLoading();
          wx.showToast({
            title: '活动火爆，请稍后再试。',
            icon: 'none',
            duration: 2000, //持续的时间
          });
          // 防止多次点击
          buyying = false
        });
    }
  },

  doPay(orderInfo) {
    let openId = wx.getStorageSync('openId');
    // 订单创建后，调起微信支付
    let params = {
      accountId: 7,
      isInvoice: false,
      tradeType: 'JSAPI',
      outTradeNo: orderInfo.id,
      amount: orderInfo.payment / 100,
      currency: 'CNY',
      source: 'MALL', // 不能修改
      body: '小程序支付',
      openId: openId,
    };

    wxPay(params)
      .then(res => {
        
        getApp().mtj.trackEvent('active_order', {
          channel: this.data.channel || "natrue_origin", 
          order_item: '59元劵', 
        });

        statisticsEvent({
          event: 'attend',
          share_user: wx.getStorageSync('from_channel'),
          activity_name: ACTIVITY_NAME,
        });
        wx.redirectTo({
          url: '/pages/activity/coupon29-201812/success',
        });
        // 防止多次点击
        buyying = false
      })
      .catch(e => {
        wx.redirectTo({
          url: './index',
        });
        // 防止多次点击
        buyying = false
      });
  },

  // 下单
  doOrder() {
    showLoading();
    request
      .post('mall/trade/item', {
        sourcePlatform: 'MP',
        trades: [
          {
            itemId: '931070414685876247',
            totalFee: '5900',
            buyNum: 1,
          },
        ],
      })
      .then(e => {
        wx.hideLoading();
        if (e.success) {
          // isAuthenticated为真有购买资格
          console.log(e.data);

          this.doPay(e.data.orderInfo)
        } else {
          // 请求不成功的情况
          wx.showToast({
            title: '活动火爆，请稍后再试。',
            icon: 'none',
            duration: 2000, //持续的时间
          });
        }
        // 防止多次点击
        buyying = false
      })
      .catch(e => {
        wx.hideLoading();
        console.log(e);
        wx.showToast({
          title: '活动火爆，请稍后再试。',
          icon: 'none',
          duration: 2000, //持续的时间
        });
        // 防止多次点击
        buyying = false
      });
  },

  //  跳转到我的优惠券
  jumpToCouponList() {
    wx.reLaunch({
      url: '/pages/mine/mine',
    });
  },

  // 跳回首页
  jumpToHomePage() {

    wx.reLaunch({
      url: '/pages/index/index',
    });
  },

  // 阅读更多
  readMore() {
    this.setData({ showRuleDetails: !this.data.showRuleDetails });
  },

  // 关闭弹窗
  handlePopUp() {
    this.setData({ popUp: false });
  },

  // 分享给好友的文案配置

  onShareAppMessage() {
    // 分享之前跳回首页
    // wx.reLaunch({
    //   url: '/pages/index/index'
    // })
    const { userInfo } = app.globalData;
    // 用户点击右上角分享
    return {
      title: '59元体验路客精品民宿，上万家房源随你选，赶紧来抢',
      path: `/pages/activity/stepping-20190404/index?springRalationFromUserId=${
        userInfo.id
      }`,
      imageUrl:
        'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/acitvity29coupon/share.png',
    };
  },
});
