const app = getApp()
const {
  getCollct,
  getUserBiz,
  getPermission,
  checkRole,
  getMineInfo,
  getWallet
} = require('../../server/mine')
const {
  showLoading,
  catchLoading,
  switchCardImage,
  gioTrack,
  switchNavigate
} = require('../../utils/util')
const regeneratorRuntime = require('../../libs/regenerator-runtime.js')
import { env } from '../../config/env-config'

Page({
  data: {
    id: '',
    avatar: '',
    widthValue: '',
    collectData: '',
    userInfo: '',
    isVip: null,
    path: '',
    defaultAvatar: app.globalData.defaultAvatar,
    myHouseResources: false, //控制我的房源项显示
    marketingRight: true, //全员营销开关控制
    sumdiscount: 0, //开卡节省
    cardCodeName: '', //卡会员
    cardCode: '',
    cardType: 0, //0普卡 1银卡 2金卡 3黑卡
    typeName: '', //商务旅客,商务企业,商务vip
    bookTipMag: '', //再住多少晚可以升级
    progress: 50, //再住多少晚可以升级百分比
    couponNum: 0, //券张数
    availableCashMoney: 0, //账户余额
    shangwulvke: false, //是否商务旅客
    shangwuqiye: false, //是否商务企业
    shangwuVip: false, //是否商务vip
    serverList: [], //服务列表
    serverDefaultList: [
      //默认服务列表
      {
        id: '21',
        serviceName: '8.8折',
        countNum: -10,
        src:
          'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/8.8%E6%8A%98.png'
      },
      {
        id: '22',
        serviceName: '专属管家',
        countNum: -10,
        src:
          'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E4%B8%93%E5%B1%9E%E7%AE%A1%E5%AE%B6.png'
      },
      {
        id: '23',
        serviceName: '生日红包',
        countNum: -10,
        src:
          'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E7%94%9F%E6%97%A5%E7%BA%A2%E5%8C%85.png'
      },
      {
        id: '24',
        serviceName: '欢迎水果',
        countNum: -10,
        src:
          'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E6%AC%A2%E8%BF%8E%E6%B0%B4%E6%9E%9C.png'
      }
    ],
    menberRgihtList: [] //组件权限列表
  },
  onLoad(options) {
    showLoading()
    this.selectComponent('#im-message').imLogin()
    getApp().mtj.trackEvent('menu_mine')
    let { sid, channel } = options
    gioTrack('mine_load', { tag_name: channel })
    if (sid) {
      app.globalData.sid = sid
    }
    //加载用户对应信息
    getMineInfo({
      userId: app.globalData.userInfo.id,
      mobile: app.globalData.userInfo.mobile
    }).then(res => {
      if (res.success) {
        console.log(res.data)
        let serverUserList = res.data.serverUserList
        let rgihtList = res.data.serverList.map(item => {
          let userRight = serverUserList.find(fitem => {
            if (fitem.id == item.id) {
              return true
            }
          })

          return {
            serviceName: item.serviceName,
            id: item.id,
            src: item.imageUrl,
            countNum: userRight ? userRight.countNum : -10
          }
        })
        this.setDiscount(res.data.cardType)

        this.setData({
          sumdiscount: Number.parseInt(res.data.sumdiscount || 0),
          cardCodeName: res.data.cardCodeName || '路客会员',
          cardCode: res.data.cardCode || 'LOCALS',
          bookTipMag: res.data.bookTipMag,
          cardType: res.data.cardType,
          couponNum: res.data.couponNum,
          shangwulvke: res.data.shangwulvke,
          shangwuqiye: res.data.shangwuqiye,
          shangwuVip: res.data.shangwuVip,
          menberRgihtList: [...rgihtList, ...this.data.serverDefaultList],
          progress: res.data.bookProgress
        })
      }
    })

    //加载账户余额
    getWallet().then(res => {
      console.log(res.data)
      this.setData({
        availableCashMoney: res.data.availableCashMoney || 0
      })
    })
  },
  setDiscount(cardType) {
    //折扣的特殊处理
    let element = this.data.serverDefaultList[0]
    if (cardType === 0 || cardType === 1) {
      element.src =
        'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine80/96.png'
      element.serviceName = '9.6折'
    }
    if (cardType === 2) {
      element.src =
        'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine80/92.png'
      element.serviceName = '9.2折'
    }
    if (cardType === 3) {
      element.src =
        'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/8.8%E6%8A%98.png'
      element.serviceName = '8.8折'
    }
  },
  onShow() {
    this.selectComponent('#auth-drawer-box').checkRole()
    this.setData({
      path: this.route
    })
  },
  onPullDownRefresh() {
    this.init()
  },
  // 获取token后执行的回调
  _cancelEventFn() {
    this.init()
  },
  async init() {
    this.setUserInfo()
    this.getCollct()
    this.getPermission()
    this.checkisLandLord()
    try {
      await this.getUserBiz()
    } catch (e) {
      catchLoading(e)
    }
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },
  // 获取分销权限
  getPermission() {
    getPermission({ businessId: '1143078431431962624' }).then(res => {
      if (res.success && res.data.state === 1) {
        this.setData({ marketingRight: true })
      }
    })
  },
  //获取用户角色检查是不是房东
  checkisLandLord() {
    checkRole({ userId: app.globalData.userInfo.id })
      // checkRole({ userId: '938996630918533135' })
      .then(res => {
        if (res.success) {
          const landlordIndex = res.data.findIndex(
            e => 'ROLE_LANDLORD' === e.role.roleCode
          )
          if (-1 !== landlordIndex) {
            this.setData({ myHouseResources: true })
          }
        }
      })
  },
  setUserInfo() {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo,
        avatar: userInfo.avatar,
        nickName: userInfo.nickName
      })
    } else {
      this.setData({
        avatar: 'https://oss.localhome.cn/logo.png',
        nickName: ''
      })
    }
  },
  getUserBiz() {
    return getUserBiz().then(res => {
      let { addUpBookCount, addUpBookDay, isVip, memberCardCode } = res.data
      this.setData({
        addUpBookCount,
        addUpBookDay,
        isVip: parseInt(isVip) === 1 ? true : false,
        memberCardCode,
        memberCardImage: switchCardImage(memberCardCode),
        cardpop: true
      })
    })
  },
  getCollct() {
    let params = {
      pageNum: 1,
      pageSize: 10
    }
    getCollct(params)
      .then(res => {
        if (res.data.list.length == 1) {
          this.setData({
            widthValue: parseInt(res.data.list.length * 274, 10),
            collectData: res.data.list
          })
        } else if (res.data.list.length >= 2) {
          this.setData({
            widthValue: parseInt(res.data.list.length * 274 - 30, 10),
            collectData: res.data.list
          })
        } else {
          this.setData({
            widthValue: parseInt(res.data.list.length * 274, 10),
            collectData: res.data.list
          })
        }
      })
      .catch(e => {
        catchLoading(e)
      })
  },
  taplist: function() {
    wx.navigateTo({
      url: '/pages/housing/list/index'
    })
  },
  tojump(e) {
    var gotype = e.currentTarget.dataset.type
    var gourl = ''
    console.log('gotype', gotype)
    switch (gotype) {
      case '1':
        getApp().mtj.trackEvent('mine_personal_profile')
        gourl = '/pages/settings/settings'
        break
      case '2':
        getApp().mtj.trackEvent('mine_coupon')
        gourl = '/pages/coupon/index'
        break
      case '3':
        gourl = './collect/collect'
        break
      case '4':
        getApp().mtj.trackEvent('mine_courteous_invitation')
        gourl = '/pages/web-view/invitation/index'
        break
      case '7':
        getApp().mtj.trackEvent('mine_invoice')
        gourl = './invoice/invoice'
        break
      case '8':
        getApp().mtj.trackEvent('mine_member_info')
        gourl = './interests/interests'
        break
      case '9':
        gourl = './landlord/landlord'
        break
      // case "9": gourl = 'http://wxpt.localhome.cn/Home/HomeOwnerIndex/?emId=&wxn=&a=1'; break;
      case '11':
        getApp().mtj.trackEvent('mine_balance')
        gourl = './balance/balance'
        break
      case '12':
        getApp().mtj.trackEvent('mine_business_info')
        gourl = '/pages/web-view/business-trip/index'
        break
      case '13':
        getApp().mtj.trackEvent('mine_download_landlord_app')
        let url = 'http://10.0.6.245:3345'
        //let url = "https://f.localhome.cn/20181101downloadApp/index.html"
        gourl = '/pages/web-view/web-view-container/index?url=' + url
        break
      case '14':
        const time = new Date().getTime()
        const aid = env === 'dev' ? '1908122042414' : '1907291823453'
        gourl = `/pages/h5/index?url=${encodeURIComponent(
          `https://i.localhome.cn/v/${aid}?_=${time}`
        )}url=&barTitle=全员营销`
        break
      case '16':
        gourl = `/pages/mall/my-order/my-order`
        break
      case '17':
        gourl = `/pages/activity/upgrade29-201907/index`
        break
      case '18':
        gourl = `/pages/business-trip/order-list/index`
        break
      case '20':
        gourl = `/pages/activity/invite-friends-201908/home/index`
        break
      case '21':
        gourl = `/pages/h5/index?url=https://i.localhome.cn/v/1902210802838`
        break
      case '22':
        gourl = `/pages/mine/member/member`
        break
      case '23':
        gourl = `/pages/business-trip/vip/index`
        break
      case '24':
        gourl = `/pages/h5/index?url=https://i.localhome.cn/v/1908281118216?channel=mine`
        break
      case '25':
        switchNavigate(
          'appid=wx604ac28b988cd4bb&path=/pages/home/dashboard/index'
        )
        break
      case '26':
        gourl = `/pages/mall/my-order/my-order`
        break
      case '27':
        gourl = `house-of-landlord/house-of-landlord`
        break
      default:
        null
    }
    if (gotype == '25') {
      return
    }
    if (gotype == '19') {
      wx.showModal({
        title: '退出登录',
        content: '请确认是否退出登录?',
        cancelText: '否',
        confirmText: '是',
        success: res => {
          if (res.confirm) {
            wx.clearStorageSync()
            app.globalData.isAuthentication = false
            wx.setStorageSync('isUserClickLoginOut', true)
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }
        }
      })
      return
    }
    wx.navigateTo({
      url: gourl
    })
  },
  clickHouse(e) {
    const house_no = e.currentTarget.dataset.housesourceid
    console.log(e)
    gioTrack('mine_collect', { house_no })
  },
  onlineCustomer() {
    getApp().mtj.trackEvent('mine_online_customer_service')
  },
  binderror() {
    this.setData({
      avatar: ''
    })
  }
})
