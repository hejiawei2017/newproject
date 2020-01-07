const { getLotelDetail, getLotelHouses, getHouseCalendarDetail, getHouseDetail, getlotelProperty } = require('../../../server/housing')
const { getMemberCard, getUserDetail, getAllCollct } = require('../../../server/mine')
const { showLoading, catchLoading, getDiffDays, processFloat, isHasLogin, isRegisterMobile, shareDataFormat } = require('../../../utils/util')
const { memberCardInfo } = require('../../../utils/dictionary')
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')
const { getGeoCode } = require('../../../server/map')
const moment = require('../../../utils/dayjs.min.js')
const app = getApp()
const defaultMemberCard = memberCardInfo["GOLD"]
function getWeekCn(num) {
  const arr = ['周日','周一', '周二', '周三', '周四', '周五', '周六']
  return arr[num]
}

Page({
  userInfo: null,
  memberCardInfo: null,
  moneyProperty: {
    title: '价格',
    // 不支持多选
    notCanMulitSelect: true,
    properties: [
      {id: '0-300', name: '¥300以下'},
      {id: '300-500', name: '¥300-500'},
      {id: '500-700', name: '¥500-700'},
      {id: '700-900', name: '¥700-900'},
      {id: '900-1200', name: '¥900-1200'},
      {id: '1200-9999', name: '¥1200以上'}
    ]
  },
  data: {
    isFullScreen: app.globalData.isFullScreen,
    defaultAvatar: app.globalData.defaultAvatar,
    defaultHouseImage: app.globalData.defaultHouseImage,
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
    checkinDays: 0,
    searchEndDate: null,
    searchStartDate: null,
    filterStatus: false,
    lotelInfo: {},
    pageNum: 1,
    houseList: null,
    isLoadingHouse: true,
    memberCardCode: null,
    willDoSomethig: null,
    houseInfo: {},
    depositContent: '',
    showProperty: [],
    searchProperty: [],
    searchTagCount: 0,
    selectedTags: [],
    // 筛选中的最大人数可选
    maxTenantNumber: 0,
    canvasImg:""
  },
  onShareAppMessage () {
    const { lotelId, lotelInfo } = this.data
    const { shopName: title } = lotelInfo
    let navigateToPath = encodeURIComponent(`/pages/housing/lotel/index?lotelId=${lotelId}`)
    return shareDataFormat({
      imageUrl: this.data.canvasImg,
      title,
      path: `/pages/index/index?navigateToPath=${navigateToPath}`,
    })
  },
  onLoad(options) {
    if (!options.lotelId) {
      throw new Error('lotelId is null')
    }
    // 已不必要传houseId，现在是自动获取lotel下的房源列表索引为0的houseId
    let { lotelId, houseId = '' } = options
    this.setData({
      lotelId,
      houseId
    })
    this.getHouseData()
    this.getCollct()
  },
  onShow() {
    this.selectComponent("#im-message").imLogin()

    let { dateParams } = app.globalData.searchParams;

    const { beginDate: searchStartDate, endDate: searchEndDate } = dateParams;

    if (searchStartDate !== this.data.searchStartDate || searchEndDate !== this.data.searchEndDate) {
      //转化日期，（预订日期使用）
      let startDate = moment(searchStartDate);
      let endDate = moment(searchEndDate);
      let drawDate = {
        startDate: {
          date: startDate.format('MM月DD日'),
          week: getWeekCn(startDate.day())
        },
        endDate: {
          date: endDate.format('MM月DD日'),
          week: getWeekCn(endDate.day())
        }
      }
      
      this.setData({
        houseList: null,
        isLoadingHouse: true,
        pageNum: 1,
        drawDate,
        searchEndDate,
        searchStartDate,
        checkinDays: getDiffDays(searchStartDate, searchEndDate)
      })
      //获取预订须知信息
      this.setTimeLineList()
      this.getLotelHouses()
      this.handlelotelProperty()
    }
  },
  signInCallback() {
    if (isHasLogin()) {
      let { willDoSomethig, houseSourceId } = this.data
      this.setHouseListCardText()
      switch(willDoSomethig) {
        case 'nowBooking':
          this.nowBooking(houseSourceId)
          break;
      }
    }
  },
  //获取房源详情信息
  async getHouseData() {
    try {
      showLoading()
      let { data: lotelInfo } = await getLotelDetail(this.data.lotelId)
      lotelInfo['starsAverage'] = parseFloat(lotelInfo.starsAverage) && parseFloat(lotelInfo.starsAverage).toFixed(1)
      let newImages = lotelInfo.photoUrls && lotelInfo.photoUrls.map(v => {
        return {
          'imagePath': v
        }
      })
      lotelInfo['photoUrls'] = newImages
      lotelInfo['label'] = lotelInfo.label ? lotelInfo.label.split(',') : []
      lotelInfo['brightSpot'] = lotelInfo.brightSpot ? lotelInfo.brightSpot.split('*') : []
      
      this.setData({
        lotelInfo
      })
      
      wx.hideLoading()
    } catch(e) {
      catchLoading(e)
    }
  },
  async handlelotelProperty() {
    let { lotelId } = this.data
    let { data } = await getlotelProperty(lotelId)
    let { showProperty = [], searchProperty = [], maxTenantNumber } = data
    let propertiesArray = []
    
    let tempObject = {}
    searchProperty.forEach(item => {
      // 属性分类
      if (!tempObject[item.remark]) {
        tempObject[item.remark] = []
        tempObject[item.remark].push(item)
      } else {
        tempObject[item.remark].push(item)
      }
    })
    // 将对象转换为数组
    for (let key in tempObject) {
      propertiesArray.push({
        title: key,
        properties: tempObject[key]
      })
    }

    // 将最大入住人数生成一个数组
    let tenantpropertiesArray = {
      title: '可住人数',
      // 不支持多选
      notCanMulitSelect: true,
      // 从 “可住2人” 开始
      properties: Array.from({ length: maxTenantNumber - 1 }, (_, index) => ({
        id: index + 2, name: `可住${index + 2}人`
      }))
    }
    
    propertiesArray.push(this.moneyProperty)

    if (tenantpropertiesArray.properties.length > 0) {
      propertiesArray.push(tenantpropertiesArray)
    }

    this.setData({
      maxTenantNumber,
      showProperty,
      searchProperty: propertiesArray
    })
  },
  showMore() {
    this.getLotelHouses()
  },
  clickSearch() {
    this.setData({
      pageNum: 1,
      filterStatus: false
    })
    this.getLotelHouses()
  },
  async getLotelHouses() {
    this.setData({
      isLoadingHouse: true
    })
    try {
      let { pageNum, lotelId, searchStartDate } = this.data

      let extendsParams = this.getSearchTag()
      
      let params = {
        pageNum,
        pageSize: 5,
        lotelId,
        checkInDate: moment(searchStartDate).format('YYYY-MM-DD'),
        ...extendsParams
      }
      
      let { data: houses } = await getLotelHouses(params)
      let { hasNextPage, list: houseList } = houses

      this.setData({
        isLoadingHouse: false,
        houseList: pageNum === 1 ? houseList : this.data.houseList.concat(houseList),
        hasNextPage,
        pageNum: hasNextPage ? pageNum + 1 : pageNum,
        houseId: houseList[0] ? houseList[0].houseSourceId : '',
      }, this.setHouseListCardText)
      this.getFirstHouseDetail()
    } catch(e) {
      console.log(e)
      this.setData({
        isLoadingHouse: false
      })
    }
  },
  getSearchTag() {
    let { searchProperty, maxTenantNumber } = this.data
    // 获取标签搜索条件
    let features = '',
        bedTypes = '',
        minPrice = '',
        maxPrice = '',
        tenantNumbers = ''
    
    searchProperty.forEach(item => {
      if (Array.isArray(item.properties) && item.properties.length > 0) {
        item.properties.forEach(property => {
          if (property.selected) {
            switch(item.title) {
              case '床型':
                bedTypes += `${property.code},`
                break;
              case '特色':
                features += `${property.code},`
                break;
              case '价格':
                let [ min, max ] = property.id.split('-')
                minPrice = min
                maxPrice = max
                break;
              case '可住人数':
                for (let i = parseInt(property.id, 10); i <= maxTenantNumber; i++) {
                  tenantNumbers += `${i},`
                }
                break;
            }
          }
        })
      }
    })

    let params = {
      minPrice,
      maxPrice,
      features: features.slice(0, -1),
      bedTypes: bedTypes.slice(0, -1),
      tenantNumbers: tenantNumbers.slice(0, -1)
    }
    
    return params
  },
  selectTag(e) {
    let { id, isImmediately, title } = e.currentTarget.dataset
    // 外部和搜索内部需要同步显示
    let { showProperty, searchProperty } = this.data

    showProperty.some(item => {
      if (id === item.id) {
        item.selected = !item.selected
        return true
      } else {
        return false
      }
    })

    searchProperty.some(item => {
      let status = false
      if (item.properties) {
        item.properties.some(property => {
          // 当前点击的标题是不容许多选时， 将selected设为false
          if (item.title === title && item.notCanMulitSelect) {
            // 此类型不支持多选
            item.properties.forEach(p => {
              if (id !== p.id) { // 保持原来被选择的不变，让303行代码修改
                p.selected = false
              }
            })
          }
          if (id === property.id) {
            property.selected = !property.selected
            status = true
            return true
          } else {
            return false
          }
        })
        return status
      } else {
        return false
      }
    })

    if (!isImmediately) {
      this.setData({
        showProperty,
        searchProperty
      })
    } else {
      this.setData({
        pageNum: 1,
        showProperty,
        searchProperty
      }, this.getLotelHouses)
    }
    this.setSearchTagCount()
  },
  clearSearchTag() {
    let { showProperty, searchProperty } = this.data

    showProperty.forEach(item => {
        item.selected = false
    })

    searchProperty.forEach(item => {
      item.properties.forEach(property => {
          property.selected = false
      })
    })
    
    this.setData({
      showProperty,
      searchProperty,
      searchTagCount: 0,
      selectedTags: []
    })
  },
  setSearchTagCount() {
    let { searchProperty } = this.data
    let count = 0
    let selectedTags = []
    searchProperty.forEach(item => {
      item.properties.forEach(property => {
          if (property.selected) {
            selectedTags.push(property)
            count++
          }
      })
    })

    this.setData({
      selectedTags,
      searchTagCount: count
    })
  },
  async setHouseListCardText() {
    if (!isHasLogin()) {
      return
    }
    try {
      let list = []
      let { houseList } = this.data
      let memberCardInfo = null
      let memberCardCode = null

      if (!memberCardInfo) {
        memberCardInfo = defaultMemberCard
      }

      try {
        if (!this.userInfo) {
          let { data: userInfo } = await getUserDetail()
          this.userInfo = userInfo
          memberCardCode = userInfo.platformUser.memberCardCode
        } else {
          memberCardCode = this.userInfo.platformUser.memberCardCode
        }
      } catch(e) {
        console.log('can not catch userInfo')
      } finally {
        let { data } = await this.getMemberCardInfo(memberCardCode)
        let isNormal = this.isNormal(memberCardCode)
        memberCardInfo = data
        
        list = houseList.map(item => {
          item['cardText'] = this.getCardText(item, memberCardInfo, isNormal)
          return item
        })
        this.setData({
          houseList: list,
          memberCardCode: memberCardInfo.memberCardCode
        })
      } 
    } catch(e) {
      console.log('setHouseListCardText', e)
    }
  },
  getFirstHouseDetail() {
    let { houseId } = this.data
    getHouseDetail(houseId)
      .then(res => {
        let { data: houseInfo } = res
        let depositContent = `路客将线上收取保证金${houseInfo.deposit}元，房客入住时请遵守管家制定的《房屋守则》，在退房后+1天内提出损坏赔偿情况，将立即原路返还。`
        this.setData({
          houseInfo,
          depositContent
        })
      })
  },
  getCardText(item, memberCardInfo, isNormal) {
    let reducePrice = processFloat(item.price - item.price * memberCardInfo.discount, 0)
    let defaultText = `${memberCardInfo.memberCardName}立减${reducePrice}`
    if (isHasLogin() && !isNormal) {
      return defaultText
    } else {
      return `升级${defaultText}`
    }
  },
  isNormal(memberCardCode) {
    return memberCardCode === 'NORMAL'
  },
  getMemberCardInfo(memberCardCode) {
    let params = {}

    if (memberCardCode && memberCardCode !== 'NORMAL') {
      params.code = memberCardCode
    } else {
      params.code = "GOLD"
    }
    
    return getMemberCard(params)
  },
  navigateToDetail(e) {
    let { houseSourceId } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/housing/detail/lotel?houseId=${houseSourceId}`
    })
  },
  setTimeLineList() {
    let { searchStartDate, searchEndDate } = this.data
    let step1 = false
    let step2 = false
    let currentStep = -1
    let currentMoment = ''
    let checkinBeforeFiveDays = ''
    let checkinDate = ''
    if (!!searchStartDate && !!searchEndDate) {
      currentMoment = moment()
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
    const timeDescript1 = checkinBeforeFiveDays !== '' ? `${checkinBeforeFiveDays.format('YYYY.MM.DD 15:00')}（入住前5天）` : '入住前5天';
    const timeDescript2 = checkinDate !== '' ? `${checkinDate.format('YYYY.MM.DD 15:00')}（入住当天）` : '入住当天';
    let timeLineList = [{
      id: 0,
      success: !!searchStartDate && !!searchEndDate,
      timeDescript: '预订成功',
      lineDescript: '免费取消'
    },
    {
      id: 1,
      success: step1,
      timeDescript: timeDescript1,
      lineDescript: '收50%房费作为赔偿金'
    },
    {
      id: 2,
      success: step2,
      timeDescript: timeDescript2,
      lineDescript: '收50%剩余未住房费作为赔偿金',
    }
    ]
    this.setData({
      timeLineList,
      currentStep
    })
  },
  toggleFilterHouse() {
    this.setData({
      filterStatus: !this.data.filterStatus
    })
  },
  bindDateSelectTap () {
    getApp().mtj.trackEvent('detail_date');
    let url =  '/pages/datepicker/date-select'
    wx.navigateTo({
      url
    })
  },
  async openAddress() {
    try {
      let { address, city, shopName } = this.data.lotelInfo
      let params = {
        city,
        address
      }
      showLoading('定位中...')
      let { data: result } = await getGeoCode(params)
      let { geocodes } = result
      if (geocodes && geocodes[0]) {
        let { location } = geocodes[0]
        if (location) {
          let [ longitude, latitude ] = location.split(',')
          wx.openLocation({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            name: shopName,
            address,
            scale: 15
          })
        } else {
          catchLoading('没有经纬度')
        }
      } else {
        catchLoading('没有地理信息')
      }
      console.log(result)
      wx.hideLoading()
    } catch(e) {
      console.log(e)
    }
    
  },
  nowBookingClick(e){
    let { houseSourceId } = e.currentTarget.dataset
    // 判断是否注册手机或是否登录
    if (isHasLogin() && isRegisterMobile()) {
      this.nowBooking(houseSourceId)
    }else{
      this.setData({
        houseSourceId,
        willDoSomethig: 'nowBooking'
      })
      this.selectComponent("#auth-drawer-box").showAuthBox()
    }
  },
  async nowBooking(houseSourceId) {
    if (!houseSourceId) {
      catchLoading('没有houseSourceId')
      return false
    }
    let canBookingStatus = true
    try {
      let { searchStartDate, searchEndDate } = this.data
      let bookingCriteria = {
        checkinDate: moment(searchStartDate).format('YYYY-MM-DD'),
        checkoutDate: moment(searchEndDate).format('YYYY-MM-DD'),
      }
      await getHouseCalendarDetail(houseSourceId, bookingCriteria)
    } catch(e) {
      catchLoading(e)
      canBookingStatus = false
    }
    if (canBookingStatus) {
      wx.navigateTo({
        url: `/pages/order/order-v2/index?houseSourceId=${houseSourceId}`
      })
    }
  },
  contactLandlord (e) {
    let { houseSourceId } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/pre-contact-order/index?houseSourceId=${houseSourceId}&from=lotel`
    })
  },
  navigateToAllComment() {
    let { lotelId } = this.data
    wx.navigateTo({
      url: `/pages/comment/list/index?lotelId=${lotelId}`
    })
  },
  collectioned(e) {
    // success 收藏成功返回true，否则返回false
    let { houseSourceId, success, data } = e.detail
    if (success) {
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      if (prevPage && prevPage.updateHouseListFavStatus) {
        prevPage.updateHouseListFavStatus(houseSourceId, data === 'create' ? true : false )
      }
    } else {
      this.setData({
        isShowAuth: true,
        willDoSomething: 'collect'
      })
      this.selectComponent("#auth-drawer-box").showAuthBox()
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
  maskTouchMove() {
    return false
  },
  onCanvasOver(e) {
    const canvasImg = e.detail.canvasImg
    this.setData({ canvasImg })
  },
  goToUnsubscribe() {
    const { searchStartDate } = this.data;
    wx.navigateTo({ url: `/pages/tipspage/unsubscribe/index?searchStartDate=${searchStartDate}`});
  }
})