const { validator } = require('../../../../utils/util');

const {
  BASE_API,
  DEFAULT_OVERTIME,
} = require('../config');
const request = require('../../../../utils/request');
const app = getApp();

let t = 0;
Page({
  data: {
    name: '',
    inviter_phone: '',

    overTime: DEFAULT_OVERTIME,
    phone: '',
    code: '',
    modalHidden: true,
  },

  signInCallback() {
    let { isNew } = wx.getStorageSync('userInfo')
    if (isNew) {
      return
    }

    wx.showModal({
      title: '提示',
      content: '活动仅限新用户参与，立即预订精品民宿吧！',
      confirmText: '立即预定',
      showCancel: false,
      success({ confirm }) {
        if (confirm) {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      },
    });
  },

  onLoad: function(options) {
    this.setData({
      name: options.name,
      inviter_phone: options.phone,
    });

    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      this.selectComponent('#auth-drawer-box').showAuthBox();
      return;
    }

    this.signInCallback()
  },

  onShow() {
    wx.pageScrollTo({ scrollTop: 500 })
  },

  /**
   * 重置定时器
   *
   */
  resetTiming() {
    clearInterval(t);
    this.setData({
      overTime: DEFAULT_OVERTIME,
    });
  },

  /**
   * 输入框事件
   *
   * @param {*} e
   */
  changeInput(e) {
    let key = e.currentTarget.dataset.name;
    let value = e.detail.value;
    this.setData({ [key]: value });
  },

  /**
   * 获取验证码失败
   *
   */
  getCodeFail() {
    wx.showModal({
      title: '提示',
      content: '获取验证码失败， 请稍后再试',
      showCancel: false,
    });
    this.resetTiming();
  },

  /**
   * 获取验证码
   *
   * @returns
   */
  getCode() {
    const { phone, overTime } = this.data;
    if (!validator(phone, 'phone')) {
      return;
    }
    if (overTime != DEFAULT_OVERTIME) {
      return;
    }
    this.setData({ overTime: overTime - 1 });
    t = setInterval(() => {
      let { overTime } = this.data;
      if (overTime <= 0) {
        this.resetTiming();
        return;
      }
      this.setData({ overTime: overTime - 1 });
    }, 999);

    request
      .post('/platform/auth/auth-code/send', {
        mobile: phone,
      })
      .then(e => {
        if (!e.success) {
          this.getCodeFail();
          return;
        }
        wx.showToast({
          icon: 'success',
          title: e.data,
        });
      })
      .catch(() => {
        this.getCodeFail();
      });
  },

  /**
   * 点击领取优惠券
   * 1. 绑定手机号
   * 2. 绑定成功则向手机号发送优惠券
   * 3. 向发起邀请用户发送优惠券
   * @returns
   */
  receiveCoupons() {
    let { phone, code, inviter_phone } = this.data;
    if (!validator(phone, 'phone')) {
      return;
    }
    if (code.length <= 3) {
      wx.showToast({
        title: '验证码错误，请重新输入',
        icon: 'none',
      });
      return;
    }
    wx.showLoading({
      title: '请稍等...',
      mask: true
    })
    request
      .put('/platform/user/user-info-mobile', {
        mobile: phone,
        code,
        traceId: app.globalData.sid,
      })
      .then(response => {
        {
          // 同步用户信息
          app.getUserInfoDetail();
        }
        {
          // 向后台发送优惠券请求
          return request.post(`${BASE_API}hand_in_hand/receive_coupons`, {
            master_phone: inviter_phone,
            guest_phone: phone,
            guest_avatar_url: app.globalData.userInfo.avatar,
            traceId: app.globalData.sid,
          });
        }
      })
      .then(response => {
        wx.hideLoading()
        this.setData({ modalHidden: false });
      })
      .catch((e = {}) => {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: e.errorMsg || e.errorDetail || '',
        });
      });
  },

  /**
   * 关闭模态框
   *
   */
  closeSuccessModal() {
    this.setData({ modalHidden: true });
  },

  onUnload: function() {
    this.resetTiming();
  },

  onShareAppMessage: function() {
    // 用户点击右上角分享
    const { name, inviter_phone } = this.data;
    return {
      title: '送你300元路客精品民宿红包福利，点击领取~',
      path: `/pages/activity/hand-in-hand-201901/register/index?name=${name}&phone=${inviter_phone}`,
      imageUrl:
        'https://oss.localhome.cn//localhomeqy/hand_in_hand/share.jpg',
    };
  },
});
