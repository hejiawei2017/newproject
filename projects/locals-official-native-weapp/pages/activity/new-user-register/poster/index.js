const request = require('../../../../utils/request');
const BASE_API = 'https://i.localhome.cn/api/';
const PASTER_IMAGE = 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/new_user_register/banner2.png';
const QRCODE_PREFIX = 'https://uat.localhome.cn/public/image/1553854565890.jpeg';
const NOOP = () => undefined;
const app = getApp();

Page({
  data: {},
  onLoad: function(options) {},

  onShow() {
    wx.pageScrollTo({ scrollTop: 200 });
  },

  onReady: function() {
    wx.removeStorageSync('__POSTER_STORAGE_KEY__')
    this.selectComponent('#poster').setData({ 
      posterOriginalHeight: 881,
      watermarkVerticalPadding: 25,
    })
    this.selectComponent('#poster').draw(
      PASTER_IMAGE,
      QRCODE_PREFIX
    );
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
      path: `/pages/activity/new-user-register/index?name=${
        userInfo.nickName
      }&phone=${userInfo.mobile}`,
      imageUrl: 'https://oss.localhome.cn//localhomeqy/hand_in_hand/share.jpg',
    };
  },
});
