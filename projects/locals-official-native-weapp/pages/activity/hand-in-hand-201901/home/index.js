const request = require('../../../../utils/request');
const { shareDataFormat } = require('../../../../utils/util');
const { BASE_API } = require('../config');
const app = getApp();

Page({
  data: {
    count: 0,
    rows: [],
  },
  onLoad: function(options) {
    this.selectComponent('#auth-drawer-box').checkRole();
  },

  signInCallback() {
    const { mobile } = app.globalData.userInfo;
    request
      .get(`${BASE_API}hand_in_hand/invite_user/${mobile}`)
      .then(response => {
        if (!response.success) {
          return;
        }
        this.setData(response.data);
      });
  },

  onShareAppMessage: function() {
    const { userInfo } = app.globalData;
    return shareDataFormat({
      title: '送你300元路客精品民宿红包福利，点击领取~',
      path: `/pages/activity/hand-in-hand-201901/register/index?name=${
        userInfo.nickName
      }&phone=${userInfo.mobile}`,
      imageUrl:
        'https://oss.localhome.cn//localhomeqy/hand_in_hand/share.jpg',
    });
  },
});
