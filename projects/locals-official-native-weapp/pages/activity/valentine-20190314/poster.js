const request = require('../../../utils/request');

const NOOP = () => undefined;
const app = getApp();

Page({
  data: {},
  onLoad: function(options) {},

  onShow() {
    wx.pageScrollTo({ scrollTop: 200 });
  },

  onReady: function() {
    const selfInviteCode = wx.getStorageSync('selfInviteCode')
    const data = {
      page: "pages/activity/valentine-20190314/index",
      scene: `inviteCode=${selfInviteCode}`
    }
    request.post(`https://i.localhome.cn/api/wechat/qrcode/unlimited`,data).then(res => {
      this.selectComponent('#poster').draw(
        'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/acitvity29coupon/poster.png',
        `http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com${res.data}`
      );
    });
  },

  saveToAlbum() {
    this.selectComponent('#poster')
      .getPosterPath()
      .then(({ tempFilePath: filePath }) => {
        wx.saveImageToPhotosAlbum({
          filePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'none',
            });
          },
          fail() {
            wx.showModal({
              title: '提示',
              content: '保存失败',
              showCancel: false,
            });
          },
        });
      });
  },

  onShareAppMessage: function() {
    const { userInfo } = app.globalData;
    // 用户点击右上角分享
    return {
      title: '29元体验路客精品民宿，上万家房源随你选，赶紧来抢',
      path: `/pages/activity/coupon29-201812/index?springRalationFromUserId=${userInfo.id}`,
      imageUrl: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/acitvity29coupon/share.png'
    }
  },
});
