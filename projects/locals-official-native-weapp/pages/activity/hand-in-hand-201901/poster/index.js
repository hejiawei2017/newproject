const request = require('../../../../utils/request');
const {
  BASE_API,
  PASTER_IMAGE,
  QRCODE_PREFIX,
} = require('../config');
const NOOP = () => undefined;
const app = getApp();

Page({
  data: {},
  onLoad: function(options) {},

  onShow() {
    wx.pageScrollTo({ scrollTop: 200 });
  },

  onReady: function() {
    const { userInfo } = app.globalData;
    const qs = `name=${userInfo.nickName}&phone=${userInfo.mobile}`;
    request.get(`${BASE_API}hand_in_hand/qrcode?${qs}`).then(res => {
      this.selectComponent('#poster').draw(
        PASTER_IMAGE,
        `${QRCODE_PREFIX}${res.data}`
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
    // 用户点击右上角分享
    const { userInfo } = app.globalData;
    return {
      title: '送你300元路客精品民宿红包福利，点击领取~',
      path: `/pages/activity/hand-in-hand-201901/register/index?name=${
        userInfo.nickName
      }&phone=${userInfo.mobile}`,
      imageUrl: 'https://oss.localhome.cn//localhomeqy/hand_in_hand/share.jpg',
    };
  },
});
