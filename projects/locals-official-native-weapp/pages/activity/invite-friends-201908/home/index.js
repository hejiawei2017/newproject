const request = require('../../../../utils/request')
const regeneratorRuntime = require('../../../../libs/regenerator-runtime')
const {
  shareDataFormat,
  gioTrack
} = require('../../../../utils/util')
const {
  getIsNewUser
} = require('../../../../server/mine')
const {
  BASE_API
} = require('../config')
const app = getApp()

const PAGESIZE = 3

Page({
  data: {
    myBonus: 0, // 我的奖金
    parentId: null,
    count: 0,
    bonusShareDetail: [],
    bonusSharePage: {
      page: 1,
      pageSize: PAGESIZE
    },
    isShowInviteFriendsRules: false // 是否展示活动规则
  },
  onLoad: function (options) {
    if (options.parentId) {
      this.setData({
        parentId: options.parentId
      })
    }
    this.selectComponent('#auth-drawer-box').checkRole()
  },

  showRules() {
    this.setData({
      isShowInviteFriendsRules: true
    })
    gioTrack('invite_friends_rules_tap');
  },
  hideRules() {
    this.setData({
      isShowInviteFriendsRules: false
    })
  },

  /**
   * 获取奖励金额
   */
  async getMyBonus() {
    const res = await request.get(`${BASE_API}/house_share/getAllBonus`, {
      userId: wx.getStorageSync('userInfo').id
    })
    if (res.success) {
      this.setData({
        myBonus: res.data
      })
    }
  },

  /**
   * 分页获取分享的记录（被分享者获取100元）
   */
  async showMoreDetail() {
    const {
      page,
      pageSize
    } = this.data.bonusSharePage
    const userInfo = app.globalData.userInfo || {}
    const {
      id: userId
    } = userInfo
    const res = await request.get(`${BASE_API}/house_share/getShareReport`, {
      userId,
      page,
      pageSize
    })
    if (res.success) {
      const cached = Array.isArray(res.data) ? res.data : []
      const concatArr = []
      if (cached.length < this.data.bonusSharePage.pageSize) { // 如果返回的数据没有足够多条，则没有更多
        this.setData({
          hasMoreShareDetail: false
        })
      }
      cached.forEach(item => { // 如果原先已经包含这条记录，则这条记录不要增加重复展示出来
        const has = this.data.bonusShareDetail.filter(detail => {
          detail.id === item.id
        })
        if (has.length > 0) return
        concatArr.push(item)
      })
      this.setData({
        bonusShareDetail: this.data.bonusShareDetail.concat(concatArr),
        bonusSharePage: {
          page: this.data.bonusSharePage.page + 1,
          pageSize: PAGESIZE
        }
      })
    } else {
      wx.showToast({
        title: res.errorDetail || res.errorMsg,
        icon: 'none',
        duration: 1500, //持续的时间
      });
      return
    }
  },

  // 新注册用户，分享者可得到1元奖励
  async send1BonusToParent() {
    const activityId = 'invite_friends' // 标记为好友分享
    let isNew = false
    
    // 是否有分享者判断
    const {
      parentId
    } = this.data // 这里的parentId 在主页做跳转的时候已经设置
    if (!parentId) return // 如果不存在分享者，直接返回不做处理
    // 是否新用户判断
    const isNewRes = await getIsNewUser()
    isNew = isNewRes.success ? isNewRes.data : false

    if (!isNew) return // 不是新用户， 分享者不能得到奖励

    const {
      id
    } = app.globalData.userInfo

    // 触发分享者获利1元接口
    const res = await request.post(`${BASE_API}/house_share/index`, {
      parentId: parentId + '',
      userId: id + '',
      activityId: activityId + ''
    })
    if (res.success) {
      gioTrack('invite_friends_signup', {tag_name: '好友分享_新人注册登录'});
    }
    console.log(res)
  },

  signInCallback() {
    this.send1BonusToParent()
    this.getMyBonus()
    this.showMoreDetail()
  },

  onShareAppMessage: function () {
    const {
      id
    } = app.globalData.userInfo || {};
    gioTrack('invite_friends_share');
    return shareDataFormat({
      title: '送你100元路客精品民宿红包福利，点击领取~',
      path: `/pages/activity/invite-friends-201908/home/index?parentId=${id}`,
      imageUrl: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/invite_friends/banner.png',
    });
  },
});