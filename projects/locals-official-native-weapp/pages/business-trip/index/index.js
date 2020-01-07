const {
  showLoading,
  catchLoading,
  isHasLogin,
  gioTrack,
  shareDataFormat
} = require('../../../utils/util')
const { getHouseList } = require('../../../server/housing')
const { getBuinessStatus, fetchAvailableServiceOrder } = require('../util')
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')
const moment = require('../../../utils/dayjs.min.js')
const app = getApp()

// 房源类型
const houseSourceTypes = {
  1: 'NORMAL',
  2: 'LOTEL'
}

// // vip类型
// const vipTypeMeta = {
// 	1: '个人商旅',
// 	2: '企业商旅',
// 	3: '商务VIP'
// }

Page({
  data: {
    roomsList: [], // 房屋列表
    isHasLogin: isHasLogin(), // 是否登录
    serviceMap: {}, // 可用服务kv表
    serviceNames: [], // 可用服务名
    isCashVip: false,
    isVip: false, // 是否vip
    vipType: null, // vip类型
    rightsShowFlag: false // 权益介绍展示位
  },

  onShow() {
    this.selectComponent('#auth-drawer-box').checkRole() // show回调登录
  },

  async onReady() {
    this.reportChannel()
    this.initHouses()
  },
  async initHouses() {
    const location = await app.wechat.getLocation('wgs84')
    const { longitude = '', latitude = '' } = location
    this.getHouses(longitude, latitude)
  },
  reportChannel() {
    const channel = wx.getStorageSync('from_channel')
    if (!channel) return
    gioTrack('biz_trip_from_channel', { channel: channel }) // 上报渠道
  },
  /**
   * 展示权益介绍
   */
  showRightsIntro() {
    this.setData({
      rightsShowFlag: true
    })
    gioTrack('rules_btn_tap')
  },
  /**
   * 关闭权益介绍弹出框
   */
  closeRightsIntro() {
    this.setData({
      rightsShowFlag: false
    })
  },

  /**
   * 获取会员可用服务类型及数量
   *
   */
  getAvailableServiceOrder() {
    return fetchAvailableServiceOrder.call(this)
  },

  /**
   * 登录之后的回调
   * 1.获取商务状态
   * 2.当前登录状态位为true
   */
  _cancelEventFn() {
    this.getBuinessStatus()
    this.getAvailableServiceOrder()

    if (isHasLogin()) {
      this.setData({
        isHasLogin: true
      })
    }
  },

  /**
   * 请求当前用户的bz状态
   * 设置当前用户的会员状态及会员类型
   */
  getBuinessStatus() {
    return getBuinessStatus.call(this)
  },

  /**
   * 获取房屋数据
   * @param {*} lon 经度
   * @param {*} lat 纬度
   */
  getHouses(lon, lat) {
    let params = {
      endDate: moment().format('YYYY-MM-DD'),
      beginDate: moment().format('YYYY-MM-DD'),
      pageNum: 1,
      pageSize: 6,
      limitImage: 5
    }
    if (lon && lat) {
      params = Object.assign({}, params, {
        // 经
        longitude: lon,
        secondLongitude: lon,
        // 纬
        latitude: lat,
        secondLatitude: lat,
        distance: 1000
      })
    }

    // 获取房屋数据列表
    getHouseList(params)
      .then(res => {
        wx.hideLoading()
        this.setData({
          roomsList: res.data.list
        })
      })
      .catch(err => {
        catchLoading()
      })
  },

  /**
   * 跳转对应的房屋详情
   * @param {*} e 事件
   */
  goRoomDetail(e) {
    const self = e.currentTarget.dataset.self
    switch (houseSourceTypes[self.houseSourceType]) {
      case 'NORMAL':
        this.goToNormalDetail(self)
        break
      case 'LOTEL':
        this.goToLotelDetail(self)
        break
    }
  },

  goToNormalDetail(item) {
    const { id, isFav, houseNo } = item
    app.mtj.trackEvent('business-trip_house-list', {
      house_no: houseNo
    })

    let url = `/pages/housing/detail/index?`
    if (id) {
      url += `houseId=${id}`
    }
    if (isFav) {
      url += `&isFavorate=${isFav}`
    }
    wx.navigateTo({
      url
    })
  },

  goToLotelDetail(item) {
    const { hotelId, id } = item
    const url = `/pages/housing/lotel/index?lotelId=${hotelId}&houseId=${id}`
    wx.navigateTo({
      url
    })
  },

  /**
   * 跳转认证页
   */
  routeToVerify() {
    gioTrack('biz_trip_certification_btn_tap')
    wx.navigateTo({
      url: '/pages/business-trip/firm-register/index'
    })
  },

  /**
   * 跳转房源列表界面
   */
  routeToHousingList() {
    wx.navigateTo({
      url: '/pages/housing/list/index'
    })
  },

  /**
   * 跳转vip注册页
   */
  routeToVip() {
    gioTrack('biz_trip_to_vip')
    wx.navigateTo({
      url: '/pages/business-trip/vip/index'
    })
  },

  /**
   * 跳转兑换记录页
   */
  routeToExchangeLog() {
    wx.navigateTo({
      url: '/pages/business-trip/trade-log/index'
    })
  },

  /**
   * 跳转兑换页
   */
  routeToTrade() {
    gioTrack('tap_to_order_list')
    wx.navigateTo({
      url: '/pages/business-trip/order-list/index'
    })
  },
  dialogCatchTouch() {
    return false
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return shareDataFormat({
      title: '【免费领取】商务出行权益', // 分享标题
      path: '/pages/business-trip/index/index', // 分享路径
      imageUrl:
        'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1561461723543top-image.png'
    })
  }
})
