const moment = require('../../utils/dayjs.min.js')
const { getDiffDays, catchLoading, isHasLogin, showLoading, shareDataFormat, switchNavigate, gioTrack } = require('../../utils/util')
const { fetchHotHouseList, getCustomerTag, getHouseList } = require('../../server/housing')
const { fetchAdsList, getActivityData } = require('../../server/index')
const { personnelNumber } = require('../../utils/dictionary')
const regeneratorRuntime = require('../../libs/regenerator-runtime.js')
const scenesHandler = require('./scenes-handler')
const { getCity } = require('../../utils/load-city.js')
const {statisticsEvent, getFamousData, trackingConversionAd} = require('../../server/hd')
const { FOREIGN_NAME } = require('../../common/const');
const app = getApp()

Page({
  data: {
    isFullScreen: app.globalData.isFullScreen,
    defaultAvatar: app.globalData.defaultAvatar,
    defaultHouseImage: app.globalData.defaultHouseImage,
    selectCityName: '获取位置...',
    searchStartDate: '',
    searchEndDate: '',
    path:'',
    keyword: '',
    featuredScrollLeft: 0,
    tenantNumber: 0,
    activeIndex: 0,
    loadingTheme: true,
    loadingFeatured: true,
    loadingHotHouse: true,
    themeList: null,
    hotHouseList: null,
    featuredTagList: null,
    activityContent: null,
    selectedCustomTag: null,
    showMoreTagImage: '',
    featuredHouses: null,
    adsTitles: [],
    webViewUrls: [],
    cityhouseInfoList: [],
    houseSourceImageList: [],
    isEmptyFeaturedTagList: false,
    isShowActivityContent: false,
    hangVisiable: true,
    personnelNumberList: personnelNumber,
    hotHouseHeight: 0,
    showIndexTips:false,
    famousList:null,
    famousSwiperIndex:0
  },
  async onLoad(options) {
    getApp().mtj.trackEvent('menu_index');
    let { sid, navigateToHouseDetailId, parentId='', navigateToPath, gdt_vid } = options
    scenesHandler(options)
    // 长按二维码返回一个path结果
    let LongPressQRcodeResult = app.LongPressQRcode(options)
    if (LongPressQRcodeResult) {
      navigateToPath = LongPressQRcodeResult
    }

    /**
     * gdt_vid：用户从H5落地页点击广告进入小程序，带的点击ID参数，做微信广告数据转化统计回传需要使用此参数
     * 微信广告数据回传上报
     * gio统计从广告进入小程序首页用户数
     */
    if (gdt_vid) {
      app.globalData.clickId = gdt_vid;
	  gioTrack('from_ad_to_mini_program_user');
    }

    if ( sid ) {
      app.globalData.sid = sid
    }
    if (parentId) { // 如果是分享而来的，在全局记录分享者的id
      app.globalData.parentId = parentId
    }

    if ( navigateToHouseDetailId ) {
      wx.navigateTo({
        url: `/pages/housing/detail/index?houseId=${navigateToHouseDetailId}`
      })
    }

    // 动态跳转
    if ( navigateToPath ) {
      navigateToPath = decodeURIComponent(navigateToPath)
      wx.navigateTo({
        url: `${navigateToPath}`
      })
    }
    // request.post(`http://localhost:7001/api/house_share/index`, {parentId: `${app.globalData.userInfo.id}`, userId: '929958907378798647', houseId: '1054584039197642752'})
    this.checkNeedShowTips()
  },
  onReady () {
    this.init()
  },
  async init() {
    wx.showNavigationBarLoading()
    // 需要同步获取当前城市，以至于后续能够拿当前城市请求
    try {
      await getCity(({city}) => {
        if (city) {
          app.globalData.defaultCity = city;
        }
        app.globalData.searchParams.cityParams = {
          cityName: city
        }
        this.setData({ selectCityName: city })
      }, this.cannotGetCity)
    } catch(e) {
      this.cannotGetCity()
    }
    this.getHotHouseList()
    this.getCarouselImage()
    this.getCustomerTag()
    this.getActivityContent()
    this.getFamousData()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },
  onPullDownRefresh() {
    this.init()
  },
  onShow() {
    this.setData({
      path:this.route
    })
    this.selectComponent("#im-message").imLogin()
    const { dateParams, cityParams, getKeyword } = app.globalData.searchParams;
    const { beginDate: searchStartDate, endDate: searchEndDate } = dateParams;
    const { cityName } = cityParams;
    let checkinDays = getDiffDays(searchStartDate, searchEndDate)
    this.setData({
      keyword: getKeyword() || '',
      checkinDays,
      selectCityName: cityName || app.globalData.defaultCity,
      searchStartDate: moment(searchStartDate).format('YYYY/MM/DD'),
      searchEndDate: moment(searchEndDate).format('YYYY/MM/DD'),
    })
  },
  async getActivityContent() {
    try {
      let content = await getActivityData()
      this.setData({
        activityContent: content
      })
    } catch(e) {
      console.log(e)
    }
  },
  setShowPopupImage(isShowPopupImage = true) {
    let popupShowTimes = wx.getStorageSync('popupShowTimes')
    if (!popupShowTimes) {
      wx.setStorageSync('popupShowTimes', 1)
      this.setData({
        isShowPopupImage
      })
    }
  },
  navigateToUrl(e) {
    let { url, title } = e.currentTarget.dataset
    if (!url) {
      return false
    }
    if (title) {
      getApp().mtj.trackEvent('index_activity', { title });
      gioTrack('index_activity', { tag_name: title });
    }
    switchNavigate(url)
  },
  setPopupLoadingSuccess() {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      if (userInfo.isNew) {
        this.setShowPopupImage(false)
      } else {
        this.setShowPopupImage()
      }
    } else {
      this.setShowPopupImage()
    }
  },
  //选择人数
  bindPickerChange (e) {
    getApp().mtj.trackEvent('index_persons');
    this.setData({
      tenantNumber: e.detail.value
    })
  },
  activityCancel() {
    this.setData({
      isShowPopupImage: false
    })
  },
  //首页轮播图
  async getCarouselImage () {
    const response = await fetchAdsList({
      platform: 'MINI2',
      statusNotEqual: 0
    })
    const { list } = response.data
    let arr = []
    let webViewUrls = []
    let adsTitles = []
    if (list !== null){
      list.forEach(item => {
        adsTitles.push(item.title)
        webViewUrls.push(item.url)
        arr.push(item.imagePath)
      })
    }
    this.setData({
      adsTitles,
      webViewUrls,
      houseSourceImageList: arr
    })
  },
  async getCustomerTag() {
    const response = await getCustomerTag({
      status: 1,
      isDisplay: 1,
      pageSize: 100
    })
    let { list } = response.data;
    let bizTagList = [];
    let featuredTagList = [];

    list.forEach(item => {
      // 筛选出业务标签，并只获取5个业务标签
      const { categoryType, otherImage, describe } = item
      if (categoryType === '1000') {
        // 个别处理路客lotel这个对象中的discript
        if (describe && describe.indexOf(',') >= 0) {
          item.describe = describe.split(',')
        }
        // 首页图片添加
        item.indexImg = `https://oss.localhome.cn/localhomeqy/newIndexIcon/${item.code}.png`
        bizTagList.push(item);
      }
      // 筛选出风格特色
      if (categoryType === '1004') {
        if (otherImage) {
          const [ moreImage, bottonImage ] = otherImage.split('|')
          item = {
            ...item,
            moreImage,
            bottonImage
          }
        }
        featuredTagList.push(item);
      }
    })
    let selectedCustomTag = ''
    let showMoreTagImage = ''
    // 异步获取通用标签的房源
    if (featuredTagList[0]) {
      const { id, moreImage } = featuredTagList[0]
      selectedCustomTag = id
      if (moreImage) {
        showMoreTagImage = moreImage
      }
      this.getCustomerTagHouses(selectedCustomTag);
    } else {
      // 没有通用标签则隐藏特色民宿馆模块
      this.setData({
        isEmptyFeaturedTagList: true
      })
    }
    this.setData({
      featuredTagList,
      selectedCustomTag,
      loadingTheme: false,
      showMoreTagImage,
      themeList: bizTagList,
    })
  },
  selectCustomTag(e) {
    const { item } = e.currentTarget.dataset
    const { selectedCustomTag, featuredScrollLeft } = this.data
    const { id, moreImage, name } = item
    getApp().mtj.trackEvent('home_label', {
      tag_name: name,
    });
    if (selectedCustomTag !== id) {
      this.setData({
        showMoreTagImage: moreImage,
        // 点击切换时，使scrollview left位置保持0
        featuredScrollLeft,
        selectedCustomTag: id,
      }, () => {
        this.getCustomerTagHouses(id)
      })
    }
  },
  async getCustomerTagHouses(tagId) {
    const params = {
      pageNum: 1,
      pageSize: 8,
      customTagIds: tagId,
      limitImage: 3,
      rankingSort: 0
    }
    // 判断是否已缓存数据
    const { cacheFeaturedHouses } = app.globalData
    const hasCacheHouses = cacheFeaturedHouses && cacheFeaturedHouses[tagId] &&cacheFeaturedHouses[tagId]['length']
    if (hasCacheHouses) {
      this.setData({
        loadingFeatured: false,
        featuredHouses: cacheFeaturedHouses[tagId]
      })
    } else {
      this.setData({
        featuredHouses: [],
        loadingFeatured: true,
      })
      const response = await getHouseList(params)
      const { data } = response
      const { list } = data
      list.forEach(item => {
        if (item.houseImages && item.houseImages[0]) {
          item.mainImages = `${item.houseImages[0]['imagePath']}?x-oss-process=image/resize,w_600/quality,Q_100`
        }
        if (item.cityName) {
          item.cityName = item.cityName.replace(/(市|城区)/g, '')
        }
      })
      // 缓存当前tagId的list
      cacheFeaturedHouses[tagId] = list;
      this.setData({
        loadingFeatured: false,
        featuredHouses: list
      })
    }
  },
  //获取热门房源
  async getHotHouseList () {
    try {
      const { data = [] } = await fetchHotHouseList({ heatPageSize: 20 })
      let newCityList = data.map(list => {
        const cityInfo = {
          city: {
            originName: list.city.name,
            name: list.city.name.slice(0, -1),
            code: list.city.code
          }
        }
        // 遍历房源列表处理数据结构
        let houses = list.houses || []
        // 判断是否为基数
        const isCardinal = houses.length % 2 == 0 ? false : true
        // 判断是否为基数，减一
        if (isCardinal) houses = houses.slice(0, -1)
        // 判断是否大于20，分割成20
        if (houses.length > 20 ) houses = houses.slice(0, 20)
        cityInfo['houses'] = houses.map(item => {
          const { id, houseImages, title, toiletNumber, bedNumber, tenantNumber, standardPrice, stars, roomNumber } = item
          let houseInfo = {
            id,
            title,
            stars,
            bedNumber,
            roomNumber,
            toiletNumber,
            tenantNumber,
            standardPrice
          }
          if (houseImages && houseImages[0]) {
            houseInfo['mainImages'] = `${houseImages[0]['imagePath']}?x-oss-process=image/resize,w_300/quality,Q_100`
          } else {
            houseInfo['mainImages'] = app.globalData.defaultHouseImage
          }
          return houseInfo
        })
        return cityInfo
      })
      newCityList = newCityList.filter(item => item.houses.length !== 0)
      this.setData({
        hotHouseList: newCityList,
        loadingHotHouse: false
      }, this.setHotHouseHeight)
    } catch(e) {
      console.log(e)
    }
  },
  avatarError(e) {
    let id = e.target.dataset.index
    let newArray = this.data.cityhouseInfoList.map(item => {
      if (item.id === id) {
        item.memberAvatar = this.data.memberAvatar
      }
      return item
    })
    this.setData({
      houseList: newArray
    })
  },
  goToShowMoreHouses() {
    let { activeIndex, hotHouseList } = this.data
    let currentHouse = hotHouseList[activeIndex]
    const { searchParams } = app.globalData;
    searchParams.cleanAll();
    if (currentHouse) {
      let cityName = currentHouse['city']['originName']
      wx.navigateTo({
        url: `/pages/housing/list/index?selectCityName=${cityName}`
      })
    }
  },
  onSearch () {
    getApp().mtj.trackEvent('index_search');
    gioTrack('index_search');
    const { searchParams } = app.globalData;
    const { tenantNumber } = this.data;
    // 城市设置为undefined自动获取当前城市
    // searchParams.cleanParams('roomParams');
    // searchParams.cleanParams('tagParams');
    searchParams.roomParams = {
      tenantNumber: Number(tenantNumber) || undefined,
    }

    if (searchParams.cityParams.cityName === null) {
      searchParams.cityParams = {
        cityName: app.globalData.defaultCity
      }
    }

    if (searchParams.cityParams.cityName === FOREIGN_NAME) {
      // 设置tagId
      searchParams.tagParams = {
        allTagIds: '1059368807866712066',
      }
    }

    let url = `/pages/housing/list/index`

    wx.navigateTo({
      url
    })
  },
  onShareAppMessage () {
    return shareDataFormat({
      imageUrl: 'https://oss.localhome.cn/localhomeqy/pic.jpg?x-oss-process=image/resize,w_400/quality,Q_100',
      path:'/pages/index/index?sid='+app.globalData.sid,
    })
  },
  skipTo(e) {
    const { type } = e.currentTarget.dataset
    let url = ''
    switch(type) {
      case 'detail':
        const { houseInfo, from } = e.currentTarget.dataset
        const { id, houseNo } = houseInfo
        if (from === 'wheel') {
          this.trackEventTag('home_label_wheel')
          this.trackEventFn('landing_housing_detail','featured_house',{
            from: '首页-特色标签',
            house_no: houseNo,
          })
        } else {
          this.trackEventFn('landing_housing_detail','explore_city',{
            from: '首页-探索城市',
            house_no: houseNo,
          })
        }
        url = `/pages/housing/detail/index?houseId=${id}`
        break;
      case 'area':
        this.trackEventFn('index_search_city')
        url = '/pages/searcharea/searcharea';
        break;
      case 'date':
        this.trackEventFn('index_date')
        url = '/pages/datepicker/date-select';
        break;
      case 'wheel-featured':
        this.trackEventTag('home_wheel_more_selection')
        gioTrack('featured_house_more_selection');
        url = this.getFeaturedUrl()
        break;
      case 'featured':
        this.trackEventFn('index_skip_to_featured','featured_house_more')
        url = this.getFeaturedUrl()
        break;
      case 'bottom-featured':
        {
          const { item } = e.currentTarget.dataset
          this.trackEventFn('home_bottom_label','home_bottom_label', {
            tag_name: item && item.name ? item.name : ''
          })
          url += `/pages/housing/featured-houses/index`
          if (item && item.id) {
            url += `?customTagIds=${item.id}`
          }
        }
        break;
    }
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  // 统计上报封装-mtj百度统计和gio一起上报
  trackEventFn(mtjName,gioName = mtjName,data = {}) {
    getApp().mtj.trackEvent(mtjName, data);
    gioTrack(gioName, data);
  },
  getFeaturedUrl() {
    const { selectedCustomTag } = this.data
    let url = `/pages/housing/featured-houses/index`
    if (selectedCustomTag) {
      url += `?customTagIds=${selectedCustomTag}`
    }
    return url
  },
  trackEventTag(eventName) {
    if (eventName) {
      const { selectedCustomTag, featuredTagList } = this.data
      const tag = featuredTagList.filter(item => item.id === selectedCustomTag)
      getApp().mtj.trackEvent(eventName, {
        tag_name: tag && tag[0] && tag[0].name ? tag[0].name : ''
      });
    }
  },
  cannotGetCity() {
    // 默认写广州
    this.setData({ selectCityName: app.globalData.defaultCity })
  },
  clearKeyword() {
    this.setData({
      keyword: ''
    })
  },
  goToHouseList(e) {
    let { id, name, code } = e.currentTarget.dataset
    const { searchParams } = app.globalData;
    // 清空关键字
    searchParams.cleanAll();
    // 城市设置为空，则是所有房源
    searchParams.cityParams = {
      cityName: null
    }
    // 设置tagId
    searchParams.tagParams = {
      allTagIds: id,
    }

    let url = `/pages/housing/list/index`
    if (code === '0rnk07') {
      getApp().mtj.trackEvent('index_biz_locals_lotel');
    }
    // 商务精选
    if (code === 'vn709x') {
      getApp().mtj.trackEvent('index_biz_choiceness');
    }
    // 行政会所
    if (code === 'rekzs8') {
      getApp().mtj.trackEvent('index_biz_administration');
    }
    // 路客精品
    if (code === 'xzie95') {
      getApp().mtj.trackEvent('index_biz_great_pieces');
    }
    // 海外民宿
    if (code === '4su26u') {
      searchParams.cityParams = {
        cityName: FOREIGN_NAME
      }
      getApp().mtj.trackEvent('index_biz_overseas');
    }

    wx.navigateTo({
      url
    })
  },
  /**
   * 计算探索城市高度赋值给hotHouseHeight
   * @param {Number} index 当前活动的索引
   */
  setHotHouseHeight() {
    const { activeIndex } = this.data
    const that = this
    const query = wx.createSelectorQuery()
    query.select(`#explore-house-wrapper-${activeIndex}`).boundingClientRect()
    query.exec(function (res) {
      if (res[0] && res[0]['height']) {
        const { height } = res[0]
        that.setData({
          hotHouseHeight: height
        })
      }
    })
  },
  bindSearchStatus (e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      activeIndex: index
    }, this.setHotHouseHeight);
  },
  bindHotHouseChange(e) {
    const { current, source } = e.detail
    if (source === 'touch') {
      this.setData({
        activeIndex: current
      }, this.setHotHouseHeight)
    }
  },
  clickExploreHouses() {
    getApp().mtj.trackEvent('index_city_list');
  },
  closeHang() {
    this.setData({
      hangVisiable: false,
    })
  },
  jumpToUrl(e) {
    const { item } = e.currentTarget.dataset
    const { desc, url, title } = item
    const { searchParams } = app.globalData;
    if(desc !== 'more'){
      searchParams.cityParams = { cityName: title }
    }
    gioTrack('index_foreign_active', { tag_name: title });
    wx.navigateTo({ url })
  },
  closetips() {
    this.setData({showIndexTips:false})
  },
  // 检查是否需要显示顶部提示
  checkNeedShowTips() {
    const showTipsTime = wx.getStorageSync('showTipsTime')
    const noShowScene = ['1001', '1023', '1089']
    if(noShowScene.indexOf(app.globalData.fromScene) !== -1 ) return
    if(!showTipsTime || moment(showTipsTime).year() !== moment().year() || moment(showTipsTime).month() !== moment().month() || moment(showTipsTime).date() !== moment().date()){
      wx.setStorageSync('showTipsTime',moment().valueOf())
      this.setData({showIndexTips:true})
    }
  },
  getFamousData(){
    const params = {
      pageNum:1,
      pageSize:5,
      status:1
    }
    getFamousData(params).then(res => {
      if(res.success){
        const list = res.data.list
        let famousList = []
        list.forEach(item => {
          const tag = item.tag.replace(/,/g,' · ')
          const famous = {
            house_id:item.house_id,
            cover_image:item.cover_image,
            tag,
            big_title:item.big_title
          }
          famousList.push(famous)
        })
        this.setData({famousList})
      }
    })
  },
  famousSwiperChange(e) {
    this.setData({
      famousSwiperIndex: e.detail.current,
    })
  },
  jumpToFamous(e){
    const { id, title } = e.currentTarget.dataset
    gioTrack('index_wanghong', { tag_name: title, house_no: id });
    const url = encodeURIComponent(`https://i.localhome.cn/v/1908141100907?houseid=${id}`)
    wx.navigateTo({
      url:`/pages/h5/index?url=${url}&barTitle=${title}`,
    })
  }
})
