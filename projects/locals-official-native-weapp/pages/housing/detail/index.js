const {
  getHouseDetail,
  getHouseCalendarDetail,
  checkStock,
  fetchForeignRuleText
} = require('../../../server/housing')
const {
  isHasLogin,
  isRegisterMobile,
  showLoading,
  catchLoading,
  getDiffDays,
  shareDataFormat,
  processFloat,
  gioTrack,
  throttle,
  maskPhone
} = require('../../../utils/util')
const {
  getAllCollct,
  getIsNewUser
} = require('../../../server/mine')
const {
  specialList
} = require('../../../utils/dictionary')
const app = getApp()
const moment = require('../../../utils/dayjs.min.js')
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

const request = require('../../../utils/request');

// const BASE_API = 'http://localhost:7001/api/'
// const BASE_API = 'https://i.localhome.cn/api/'; // 房源活动使用的baseurl

const {
  BASE_API,
  playNotice,
  stopNoticeTimer
} = require('../shared')


const page = {
  data: {
    isErrorDesignImage: false,
    designByImage: 'https://oss.localhome.cn/localhomeqy/Designed.png',
    fromApp: app.globalData.fromApp,
    isFullScreen: app.globalData.isFullScreen,
    defaultAvatar: app.globalData.defaultAvatar,
    houseId: '',
    houseInfo: {},
    markers: [],
    resY: 0,
    isShowFooter: false,
    isShowAuth: false,
    animationData: {},
    currentIndex: 1,
    searchStartDate: '',
    searchEndDate: '',
    checkinDays: 0,
    priceTotal: '', //房源价格
    isPlaceOrder: true, //判断是否可以下单
    // 判断是否从首页进来
    isFromIndex: false,
    isfromSelectDate: false,
    timeLineList: [],
    houseFacilitieList: [], //家居整合(最多前8个icon)
    houseSourceFacilitieCount: 0,
    houseSourceFacilitieList: [], //封装后的设施集合，用于设施页面，通过store传过去
    specialInfoList: [], //特殊功能信息
    currentStep: 0,
    drawDate: { //预定时间
      startDate: {
        date: '',
        week: ''
      },
      endDate: {
        date: '',
        week: ''
      }
    },
    loadingCheckStock: true,
    horizontalMainPic: '',
    averageMoney: '***',
    totalHouseImage: '**',
    imageGroup: [],
    canvasImg: "",
    notice: '', // 顶部活动滚动notice列表,
    activeTab: 0,
    tabs: [{ name: '概览', classname: '#describe',active:true }, { name: '点评', classname: '#review' }, { name: '相册', classname: '#image' }, { name: '设施', classname: '#facility-menu' },
    { name: '位置', classname: '#map' }, { name: '交易规则', classname: '#rule' }, { name: '周边房源', classname: '#surrounding' }]
  },
  onShareAppMessage() {
    const {
      houseInfo
    } = this.data;
    const {
      title
    } = houseInfo;
    const { userInfo } = app.globalData || {};
    gioTrack('tap_house_share');
    return shareDataFormat({
      title,
      imageUrl: this.data.canvasImg === '' ? this.data.horizontalMainPic : this.data.canvasImg,
      path: `pages/index/index?navigateToHouseDetailId=${this.data.houseId}&sid=${app.globalData.sid}&parentId=${userInfo.id || ''}`
    })
  },
  onLoad(options) {
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    let scene = null
    if (options.scene) {
      scene = decodeURIComponent(options.scene)
    }
    if (scene) {
      let sceneArray = scene.split('&')
      let data = {
        isFromIndex: options.from === 'index'
      }
      for (let item of sceneArray) {
        let [key, value] = item.split('=')
        if (value) {
          data[key] = value
        }
      }
      this.setData(data)
    } else {
      this.setData({
        houseId: options.houseId,
        isFromIndex: options.from === 'index'
      })
    }
    app.addSignUpCbs(this.send1BonusToParent()) // 房源分享后，进入页面会注册1元奖励给分享者的机制
    // 记录sid
    let {
      sid
    } = options
    if (sid) {
      app.globalData.sid = sid
    }
    showLoading();
  },
  onUnload() {
    this.disConnectXmlObserver()
    stopNoticeTimer.call(this)
  },
  onHide() {
    stopNoticeTimer.call(this)
  },
  onShow() {
    this.selectComponent("#im-message").imLogin()

    let {
      dateParams
    } = app.globalData.searchParams;

    const {
      beginDate: searchStartDate,
      endDate: searchEndDate
    } = dateParams;

    if (searchStartDate !== this.data.searchStartDate || searchEndDate !== this.data.searchEndDate) {
      //转化日期，（预订日期使用）
      let startDate = new Date(searchStartDate)
      this.data.drawDate.startDate.date = (startDate.getMonth() + 1) + '月' + startDate.getDate() + '日'
      this.data.drawDate.startDate.week = this.getWeekCn(startDate.getDay())
      let endDate = new Date(searchEndDate)
      this.data.drawDate.endDate.date = (endDate.getMonth() + 1) + '月' + endDate.getDate() + '日'
      this.data.drawDate.endDate.week = this.getWeekCn(endDate.getDay())
      //-------end---------
      this.setData({
        searchStartDate,
        searchEndDate,
        drawDate: this.data.drawDate
      })
      //获取预订须知信息
      this.getHouseData()
      this.setTimeLineList()
    }
    // 此情况存在分享房源，没有列表传过来的收藏字段
    this.getCollct()
    // this.startNotice() // 开始播放顶部notice 暂不启用
  },
  async startNotice() {
    const notices = await this.getNoticesList()
    playNotice.call(this, notices)
  },
  // 获取随机数
  randomCount(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },


  async getNoticesList() {
    const res = await request.get(`${BASE_API}/house_share/getSharers`, {
      size: 5
    })
    let sharers = []
    sharers = res.success ? res.data : []
    const notices = sharers.map(sharer => {
      const {
        nick_name,
        avatar
      } = sharer
      const money = this.randomCount(500, 3)
      return {
        avatar,
        content: `${nick_name}通过分享累计赚的${money}元`
      }
    })
    return notices
  },
  /**
   * 发放1元奖励给分享者
   */
  send1BonusToParent() {
    const activityId = this.data.houseId || ''
    return async () => {
      let isNew = false

      // 是否有分享者判断
      const {
        parentId
      } = app.globalData // 这里的parentId 在主页做跳转的时候已经设置
      if (!parentId) return // 如果不存在分享者，直接返回不做处理
      // 是否新用户判断
      const isNewRes = await getIsNewUser()
      isNew = isNewRes.success ? isNewRes.data : false

      if (!isNew) return // 不是新用户， 分享者不能得到奖励

      // 触发分享者获利1元接口
      const res = await request.post(`${BASE_API}/house_share/index`, {
        parentId: parentId + '',
        userId: app.globalData.userInfo.id + '',
        activityId: activityId + ''
      })
      if (res.success) {
        gioTrack('house_share_signup', { tag_name: '房源分享_新人注册登录' });
      }
    }
  },
  signInCallback() {
    let {
      isShowAuth,
      willDoSomething
    } = this.data
    this.setData({
      isShowAuth: false
    })
    if (isShowAuth && isHasLogin()) {
      switch (willDoSomething) {
        case 'newOrder':
          this.setData({
            isShowAuth: false
          })
          // 从首页进来则必须选择日期
          if (this.data.isFromIndex) {
            this.goDateSelectTap(true)
            return
          }
          if (!this.data.isPlaceOrder) {
            this.goDateSelectTap(true)
            return
          }
          this.nowBooking()
          break;
        case 'collect':
          this.getCollct()
          break;
        // case 'receiveCoupon':
        //   this.handleSummerSpecialModal(false);
        //   break;
      }
    }
  },
  getCollct() {
    getAllCollct()
      .then(res => {
        let collectList = res.data
        let isFavorate = false
        // loop 修改房源收藏状态
        collectList.some(item => {
          if (item.houseSourceId === this.data.houseId) {
            isFavorate = true
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]
            if (prevPage && prevPage.updateHouseListFavStatus) {
              prevPage.updateHouseListFavStatus(item.houseSourceId, isFavorate)
            }
            return true
          }
        })
        this.setData({
          isFavorate
        })
      })
      .catch(e => {
        console.log('collect error', e)
      })
  },
  getWeekCn(num) {
    const arr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return arr[num]
  },
  bindDateSelectTap() {
    getApp().mtj.trackEvent('detail_date');
    let url = '../date-select/date-select?houseId=' + this.data.houseId
    wx.navigateTo({
      url
    })
  },
  goDateSelectTap(willFlash) {
    let url = '../date-select/date-select?houseId=' + this.data.houseId
    if (willFlash) {
      url += '&willFlash=1'
    }
    wx.navigateTo({
      url
    })
  },
  //获取房源详情信息
  getHouseData(callback) {
    showLoading()
    let {
      houseId
    } = this.data
    getHouseDetail(houseId)
      .then(res => {
        const {
          data: houseInfo
        } = res;
        let {
          houseImages
        } = houseInfo;
        if (houseImages && houseImages.length > 0) {
          // 主图只显示一张，即：主图(竖图)主图(横图)同时存在则横图移除
          const isHasVerticalImage = houseImages.some(item => item.module === '主图(竖图)');
          if (isHasVerticalImage && houseImages.some(item => item.module === '主图(横图)')) {
            houseImages = houseImages.filter(item => item.module !== '主图(横图)')
          }
          houseImages.forEach((item, index) => {
            const {
              imagePath
            } = item
            if (index === 0) {
              item.imagePath = `${imagePath}?x-oss-process=image/resize,w_900/quality,Q_100`
            } else {
              item.imagePath = `${imagePath}?x-oss-process=image/resize,w_600/quality,Q_100`
            }
          })
        }
        houseInfo.houseImages = houseImages;
        let tags = []
        // 将标签合并
        if (Array.isArray(houseInfo.bizTag) && houseInfo.bizTag.length > 0) {
          tags = tags.concat(houseInfo.bizTag)
        }
        if (Array.isArray(houseInfo.customTag) && houseInfo.customTag.length > 0) {
          tags = tags.concat(houseInfo.customTag)
        }
        houseInfo['tags'] = tags
        // 处理stars
        houseInfo['stars'] = Math.round(houseInfo.stars * 10) / 10
        houseInfo['toiletNumber'] = (houseInfo.toiletNumber || 0) + (houseInfo.publicToiletNumber || 0)
        // 设置经纬度
        let totalHouseImage = 0
        // 过滤主图
        let imageGroup = []
        if (houseInfo && houseInfo.houseImagesMap) {
          const {
            houseImagesMap
          } = houseInfo
          const showImageType = ['客厅', '卧室', '厨房', '卫生间']
          imageGroup = Object.keys(houseImagesMap)
            .filter(key => showImageType.includes(key))
            .map(key => {
              const imagesMap = houseImagesMap[key]
              // 合并集合下的所有图片
              const images = []
              Object.keys(imagesMap)
                .forEach(key => {
                  imagesMap[key] && imagesMap[key].forEach(item => images.push(item))
                })
              return {
                key,
                images
              }
            })
          // 获取房源图片数量，不包括下面两者
          const notIncluded = ['主图(横图)', '主图(横图)']
          totalHouseImage = houseInfo.houseImages.filter(item => !notIncluded.includes(item.module)).length
        }
        if (houseInfo['location']) {
          let locationArray = houseInfo['location'].split(',')
          houseInfo['latitude'] = locationArray[0]
          houseInfo['longitude'] = locationArray[1]
        }
        // 处理姓名为手机号
        if (Array.isArray(houseInfo.comments) && houseInfo.comments.length > 0) {
          const comments = houseInfo.comments
          comments.forEach(item => {
            const phoneExp = new RegExp(/^1[3-9]\d{9}$/)
            if(phoneExp.test(item.memberName)) item.memberName = maskPhone(item.memberName)
          })
        }
        // 控制内存
        delete houseInfo['houseImagesGroup']
        let markers = [{
          iconPath: "/assets/housing/location-range.png",
          id: 0,
          latitude: houseInfo['latitude'],
          longitude: houseInfo['longitude'],
          width: 70,
          height: 70,
          anchor: {
            x: .5,
            y: .6
          } //设置左边点居中显示
        }]

        const isForeignCity = tags.some(item => item.tagName === '海外民宿');
        // 获取国外详情的入住须知和规则文案
        if (isForeignCity) {
          this.getForeignRuleText();
          gioTrack('detali_enter_foreign')
        }
        // 是否有国庆特惠标签
        // will delete
        const isSummerSpecial = tags.some(item => item.tagName === '国庆特惠');

        // will delete

        this.setData({
          visablePage: true,
          isForeignCity,
          isSummerSpecial, // will delete
          markers,
          houseInfo,
          imageGroup,
          totalHouseImage,
          priceTotal: res.data.standardPrice
        });
        wx.hideLoading()


        this.getAllFacilities(res.data.facilities)
        this.getRecommendHousingInfo()
        // 每次进来房源详情都需要判断时间是否可预订
        if (!!this.data.searchStartDate && !!this.data.searchEndDate) {
          this.getHouseCalendarData()
        }
        typeof callback === 'function' && callback()
        // 记录横版主图，用于分享封面以及海报生成
        const filterPic = houseInfo.houseImages && houseInfo.houseImages.filter(function (x) {
          return x.module === '主图(横图)';
        });
        if (filterPic && filterPic.length !== 0) {
          this.setData({
            horizontalMainPic: filterPic[0].imagePath
          })
        }
        this.initNavTab();

      })
      .catch((e) => {
        const {
          errorCode
        } = e
        wx.hideLoading()
        if (errorCode === '20712') {
          wx.showModal({
            title: '温馨提示',
            content: '管家不接新订单了，如有问题请与客服联系。',
            showCancel: false,
            confirmText: '知道了',
            success(e) {
              const {
                confirm
              } = e
              if (confirm) {
                wx.navigateBack()
              }
            }
          })
        } else {
          catchLoading(e)
        }
      })
  },
  async getForeignRuleText() {
    const {
      data
    } = await fetchForeignRuleText();
    const {
      checkInRules,
      tradingRules
    } = (data || {});
    this.setData({
      tradingRules,
      checkInRules,
    })
  },
  //获取房态价格
  async getHouseCalendarData() {
    let {
      houseId,
      searchStartDate,
      searchEndDate,
      houseInfo
    } = this.data
    let bookingCriteria = {
      checkinDate: moment(searchStartDate).format('YYYY-MM-DD'),
      checkoutDate: moment(searchEndDate).format('YYYY-MM-DD'),
    }
    try {
      let {
        data: isHasStock
      } = await this.handleCheckStock()
      if (isHasStock) {
        this.setData({
          isPlaceOrder: true
        })
      } else {
        this.setData({
          isPlaceOrder: false
        })
      }
    } catch (e) {
      this.setData({
        isPlaceOrder: false
      })
      catchLoading(e)
    }
    // 小程序房源详情金额逻辑：获取“房源日历”成功则显示日历上多个房晚的“均价(总金额/房晚数)”，否则显示房源的标准价
    getHouseCalendarDetail(houseId, bookingCriteria)
      .then(res => {
        //房态价格
        let {
          priceTotal,
          averageMoney
        } = this.calendarNightPrice(res.data.nightPrices)
        this.setData({
          priceTotal,
          averageMoney,
          checkinDays: getDiffDays(searchStartDate, searchEndDate)
        })
      })
      .catch(e => {
        //获取标准价
        this.setData({
          averageMoney: houseInfo.standardPrice,
          checkinDays: getDiffDays(searchStartDate, searchEndDate)
        })
      })
  },
  calendarNightPrice(nightPriceArray) {
    let priceTotal = 0
    nightPriceArray.forEach(item => {
      priceTotal += parseFloat(item.price)
    })
    let averageMoney = Math.round(priceTotal / nightPriceArray.length)
    return {
      priceTotal,
      averageMoney
    }
  },
  //封装设施设备
  getAllFacilities(list) {
    let arr = [{
      categoryCode: '62',
      categoryName: '家居',
      facilitieList: []
    }, {
      categoryCode: '63',
      categoryName: '洗浴用品',
      facilitieList: []
    }, {
      categoryCode: '64',
      categoryName: '厨房',
      facilitieList: []
    }, {
      categoryCode: '66',
      categoryName: '安全',
      facilitieList: []
    }, {
      categoryCode: '68',
      categoryName: '周边',
      facilitieList: []
    }]
    //获取特殊分类
    let special = []
    if (list) {
      list.forEach(facilitieItem => {
        // 居家 娱乐 建筑 整合成【家居模块】
        if (facilitieItem.categoryCode === '62' || facilitieItem.categoryCode === '65' || facilitieItem.categoryCode === '67') {
          arr[0].facilitieList.push(facilitieItem)
        } else {
          if (facilitieItem.categoryCode === '70') {
            special.push(facilitieItem)
          } else {
            arr.forEach((arrItem, arrIndex) => {
              if (arrItem.categoryCode === facilitieItem.categoryCode) {
                arr[arrIndex].facilitieList.push(facilitieItem)
              }
            })
          }
        }
      })
    }
    this.getHouseDictionary(special)
    this.getHouseAndHome(arr)
    this.setData({
      houseSourceFacilitieList: arr
    })
  },
  //获取8个家居设施图标
  getHouseAndHome(list) {
    let arr = []
    let count = 0
    list.forEach(item => {
      item.facilitieList.forEach(facItem => {
        //详情页需要展示的icon, 显示（7个图标）
        if (arr.length < 7) {
          arr.push(facItem)
        } else {
          count++
        }
      })
    })
    this.setData({
      houseSourceFacilitieCount: count,
      houseFacilitieList: arr
    })
  },
  //封装特殊功能信息
  getHouseDictionary(canSpecialList) {
    // 存在此设施数组说明能够做，例如设施中存在 容许做饭的code，则不用在此项前添加“不”
    const canSpecialArray = canSpecialList.map(item => item.code)
    const special = JSON.parse(JSON.stringify(specialList))
    let landlordRequest = []
    special.forEach(item => {
      let {
        code,
        name,
        mustExecuted
      } = item
      if (!mustExecuted && !canSpecialArray.includes(item.code)) {
        name = '不' + name
      }
      landlordRequest.push({
        code,
        name,
      })
    })
    this.setData({
      specialInfoList: landlordRequest
    })
  },
  //获取推荐房源数据
  getRecommendHousingInfo() {
    let params = {
      pageSize: 10
    };
    //若详情有房源坐标点时，传入坐标点搜索，若没有，则传城市编号进行查询
    if (this.data.houseInfo.longitude && this.data.houseInfo.latitude) {
      params.maxLng = this.data.houseInfo.longitude;
      params.maxLat = this.data.houseInfo.latitude;
      params.keyword = this.data.houseInfo.cityName;
    } else {
      params.cityCode = this.data.houseInfo.cityCode;
    }
  },
  //打开地图层
  onOpenMapPage() {
    let {
      houseInfo
    } = this.data
    getApp().mtj.trackEvent('detail_map');
    wx.openLocation({
      latitude: parseFloat(houseInfo.latitude),
      longitude: parseFloat(houseInfo.longitude),
      name: houseInfo.title,
      address: houseInfo.address,
      scale: 15
    })
  },
  handleCheckStock() {
    this.setData({
      loadingCheckStock: true
    })
    let {
      searchStartDate,
      searchEndDate
    } = this.data
    let params = {
      checkInDate: moment(searchStartDate).format('YYYY-MM-DD'),
      checkOutDate: moment(searchEndDate).format('YYYY-MM-DD')
    };
    return checkStock(this.data.houseId, params)
  },
  nowBookingClick() {
    if (!this.data.houseInfo) {
      return;
    }
    // 判断是否注册手机或是否登录
    if (isHasLogin() && isRegisterMobile()) {
      // 从首页进来则必须选择日期
      if (this.data.isFromIndex) {
        this.goDateSelectTap(true)
        return
      }
      // 请求判断此日期是否被占用
      if (!this.data.isPlaceOrder) {
        this.goDateSelectTap(true)
        return
      }
      this.nowBooking()
    } else {
      this.setData({
        isShowAuth: true,
        willDoSomething: 'newOrder'
      })
      this.selectComponent("#auth-drawer-box").showAuthBox()
    }
    gioTrack('detail_new_booking');
  },
  nowBooking() {
    let {
      id
    } = this.data.houseInfo
    getApp().mtj.trackEvent('detail_flash_order');
    wx.navigateTo({
      url: `/pages/order/order-v2/index?houseSourceId=${id}&from=houseDetail`
    })
  },
  contactLandlord(e) {
    let {
      from
    } = e.currentTarget.dataset
    getApp().mtj.trackEvent('detail_contact_landlord');
    if(this.data.isForeignCity){
      gioTrack('detail_contact_landlord_foreign');
    }else{
      gioTrack('detail_contact_landlord');
    }
    let {
      id
    } = this.data.houseInfo
    if (id) {
      wx.navigateTo({
        url: `/pages/pre-contact-order/index?houseSourceId=${id}&from=${from}`
      })
    }
  },
  setTimeLineList() {
    let {
      searchStartDate,
      searchEndDate
    } = this.data
    let step1 = false
    let step2 = false
    let currentStep = -1
    let currentMoment = ''
    let bookingDate = ''
    let checkinBeforeFiveDays = ''
    let checkinDate = ''
    if (!!searchStartDate && !!searchEndDate) {
      currentMoment = moment()
      bookingDate = moment()
      checkinBeforeFiveDays = moment(searchStartDate).add(-5, 'day')
      checkinDate = moment(searchStartDate)
      let checkinDate12clock = checkinDate.format('YYYY-MM-DD 12:00:00')
      currentStep = 0
      step1 = moment(checkinBeforeFiveDays.format('YYYY-MM-DD 15:00:00')).isBefore(currentMoment)
      step2 = moment(checkinDate12clock).isBefore(currentMoment)

      if (step1) {
        currentStep = 1
      }
      if (step2) {
        currentStep = 2
      }
    }
    const timeDescript1 = checkinBeforeFiveDays !== '' ? `${checkinBeforeFiveDays.format('YYYY.MM.DD 15:00')}` : '';
    const timeDescript2 = checkinDate !== '' ? `${checkinDate.format('YYYY.MM.DD 15:00')}` : '';
    let timeLineList = [{
      id: 0,
      success: true,
      success: !!searchStartDate && !!searchEndDate,
      lineDescript: '免费取消',
      timeDescript: `距离入住≥5天取消`,
      timehint: `（${timeDescript1}前）`
    },
    {
      id: 1,
      success: step1,
      lineDescript: '退全部房费的50%',
      timeDescript: `距离入住＜5天取消`,
      timehint: `（${timeDescript1}～${timeDescript2.substring(5,timeDescript2.length)}）`
    },
    {
      id: 2,
      success: step2,
      lineDescript: '退发生退订24小时后未住房费的50%',
      timeDescript: `入住当天取消或提前退房`,
      timehint: `（${timeDescript2}后）`
    }
    ]
    this.setData({
      timeLineList,
      currentStep
    })
  },
  // 收藏房源回调
  collectioned(e) {
    // success 收藏成功返回true，否则返回false
    let {
      houseSourceId,
      success,
      data
    } = e.detail
    if (success) {
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      if (prevPage && prevPage.updateHouseListFavStatus) {
        prevPage.updateHouseListFavStatus(houseSourceId, data === 'create')
      }
    } else {
      this.setData({
        isShowAuth: true,
        willDoSomething: 'collect'
      })
      this.selectComponent("#auth-drawer-box").showAuthBox()
    }
  },
  showDetail() {
    getApp().mtj.trackEvent('detail_house_detail');
  },
  avatarError() {
    let {
      houseInfo
    } = this.data
    houseInfo.comments[0].memberImgPath = this.data.defaultAvatar
    this.setData({
      houseInfo
    })
  },
  skipTo(e) {
    const {
      type
    } = e.currentTarget.dataset
    const {
      houseId,
      searchStartDate
    } = this.data
    let url = ''
    switch (type) {
      case 'landlord':
        const {
          id
        } = e.currentTarget.dataset
        if (id) {
          url = `/pages/housing/owner/index?memberId=${id}`
        }
        break;
      case 'rule':
        url = '/pages/tipspage/rules/index'
        break;
      case 'facilitie':
        getApp().mtj.trackEvent('detail_facilities');
        wx.setStorageSync('locals_dictionary_acilitie_info', this.data.houseSourceFacilitieList)
        url = '/pages/housing/facilities/index'
        break;
      case 'morePicture':
        const {
          key
        } = e.currentTarget.dataset
        url = `/pages/housing/album/index?houseId=${houseId}`
        if (key) {
          url += `&key=${key}`
        }
        break;
      case 'unsubscribe':
        url = `/pages/tipspage/unsubscribe/index?searchStartDate=${searchStartDate}`;
        break;
      case 'comment': {
        const {
          stars,
          id,
          memberId
        } = e.currentTarget.dataset
        url = `/pages/comment/list/index?stars=${stars}&houseSourceId=${id}&memberId=${memberId}`
      }
        break;
      case 'recommend':
        const {
          houseInfo
        } = this.data
        url = `/pages/housing/recommend/index?houseId=${houseInfo.id}&longitude=${houseInfo.longitude}&latitude=${houseInfo.latitude}`;
        break;
    }
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  skipToSummerSpecial() {
    const webUrl = `https%3A%2F%2Fi.localhome.cn%2Fv%2F1909161503682%2F%23%2F%3Fchannel%3Dgqcx&title=国庆抢8折特惠，长假住精品民宿！`;
    wx.navigateTo({
      url: `/pages/h5/index?url=${webUrl}`
    });
  },
  bindErrorDesignImage() {
    this.setData({
      isErrorDesignImage: true
    })
  },
  onCanvasOver(e) {
    const canvasImg = e.detail.canvasImg
    this.setData({
      canvasImg,
    })
  },
  // will delete
  // handleReceiveCoupon() {
  //   this.setData({
  //     isShowAuth: true,
  //     willDoSomething: 'receiveCoupon'
  //   })
  //   this.selectComponent("#auth-drawer-box").showAuthBox()
  // },
  // will delete
  cancelCouponModal() {
    this.setData({
      receiveCouponSuccess: false,
      showReceiveCouponModal: false,
    })
  },
  // will delete 
  bindloadSummerSprites() {
    this.setData({
      summerImageStatus: true,
    });
  },

  /**
   * 实现联动tab
   */
  onPageScroll(e) {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.autoRoll = false
    }, 200)
  },

  initNavTab() {
    this._observer = wx.createIntersectionObserver(this, {
      // 阈值设置少，避免触发过于频繁导致性能问题
      thresholds: [0],
      // 监听多个对象
      // observeAll: true
    })
    this._observer
      .relativeToViewport({ top: -280 })
      .observe('#swiper', (res) => {
        // this.setData({
        //   headappear: 
        // })
        this.triggerHeadAnimation(res.intersectionRatio === 0);
      })

      this._sectionobserver = wx.createIntersectionObserver(this, {
        // 阈值设置少，避免触发过于频繁导致性能问题
        thresholds: [0,0.8],
        // 监听多个对象
        observeAll: true
      })
      this._sectionobserver
        .relativeToViewport({ top: -180 })
        .observe('.nav-anchor', (res) => {
          if (res.id) console.log(res);
          if (res.intersectionRatio > 0 && res.intersectionRect.top <=180 && !this.autoRoll) {
            this.setActiveTab(res.id)
          }
        })
  },

  setActiveTab(id) {
    if (id) {
      const {tabs,activeTab} = this.data
      const index = tabs.findIndex(e => e.classname.replace('#','') === id);
      console.log('yoyoyoyoy');
      if (index !== activeTab) {
        tabs[index].active = true
        tabs[activeTab].active = false
        this.setData({
          tabs,
          activeTab:index
        })
      }
    }
  },

  disConnectXmlObserver() {
    if (this._observer) this._observer.disconnect()
    if (this._sectionobserver) this._sectionobserver.disconnect()
  },
  
  tabClick(e) {
    const { item, index } = e.currentTarget.dataset
    const {tabs,activeTab} = this.data
    if (activeTab !== index) {
      tabs[index].active = true
      tabs[activeTab].active = false
    }
    this.setData({
      tabs,
      activeTab:index
    })
    this.autoRoll = true
    const query = wx.createSelectorQuery()
    query.select(item.classname).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      res[0].top       // #the-id节点的上边界坐标
      res[1].scrollTop // 显示区域的竖直滚动位置
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: res[0].top + res[1].scrollTop - 100,
          duration: 300
        })
      }, 100);
    })

  },
  triggerHeadAnimation(show) {
    let headerAnimation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
      transformOrigin: '100% 100% 0'
    })

    if (show) {
      headerAnimation.translateY(0).opacity(1).step()
    } else {
      headerAnimation.translateY(-160).opacity(0).step()
    }

    this.setData({
      headerAnimationData: headerAnimation.export()
    })
  }
}
Page(page)

module.exports = {
  page
}