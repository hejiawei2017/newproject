const app = getApp()
const { getCustomerTagMap, getHouseList } = require('../../server/housing')
const { getLocationInfo, convertLocation, getGeoCode, batchRequest } = require('../../server/map')
const { showLoading, catchLoading } = require('../../utils/util')
const { cityCodeList } = require('../../utils/dictionary')
const regeneratorRuntime = require('../../libs/regenerator-runtime.js')
const { getCity } = require('../../utils/load-city.js')
const isCityArray = ["190102", "190103", "190104"]

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isHasSearch: false,
    loading: false,
    currentCity: [],
    searchInfo: [],
    keywords: '',
    searchLogs:[],
    tagList: [],
    houseList: [],
    houseTotal: 0,
    // 默认显示2个
    showSearchCount: 2,
    getCurrnetCityText: '获取当前位置中...',
    currnetCityLoading: true
  },
  onLoad() {
    this.init()
  },
  onShow (){
    this.selectComponent("#im-message").imLogin()
  },
  onReady () {
    let ar = []
    this.searchParams = app.globalData.searchParams;
    const { cityName } = this.searchParams.cityParams;
    if(this.searchParams.cityParams.cityName){
      ar.push(cityName)
    }
    this.setData({
      location: ar
    })
  },
  init(){
    const globalKeyword = app.globalData.searchParams.getKeyword();
    this.getCity()
    this.getCustomerTagMap()
    if (!this.data.keywords) {
      this.setData({
        keywords: globalKeyword
      })
    }
    // 进来时全局keyword不为空时，自动请求
    if (globalKeyword) {
      this.setData({
        isHasSearch: !!globalKeyword,
      })
      this.getHouseList()
      this.requestConfirm()
    }
    wx.getStorage({
      key: 'searchLogs',
      success: res => {
        this.setData({
          searchLogs: res.data
        })
      } 
    })
  },
  getHouseList() {
    let { keywords } = this.data
    let params = {
      pageSize: 5,
      pageNum: 1,
      keyword: keywords,
      rankingSort: 0,
    }
    getHouseList(params)
      .then(res => {
        let { list } = res.data
        list.forEach((item, index) => {
          if (item.highlight && item.highlight.title) {
            let title = item.highlight.title.replace(/tag/ig, 'span')
            title = title.replace(/<span>/ig, '<span class="keyword-color" >')
            list[index]['highlight']['title'] = '<div class="search-title">' + title + '</div>'
          } 
        })
        this.setData({
          houseTotal: res.data.total,
          houseList: list
        })
      })
  },
  getCustomerTagMap() {
    // 获取通用标签
    getCustomerTagMap('1001')
      .then(res => {
        this.setData({
          tagList: res.data
        })
      })
      .catch(e => {
        console.log('getCustomerTagMap error', e)
        catchLoading(e)
      })
  },
  input (e) {
    let self = this
    let value = e.detail.value
    self.value = value.trim()
    clearTimeout(self.serchTime)
    self.setData({
      keywords: e.detail.value
    })
    self.serchTime = setTimeout(() => {
      if(value){
        if(self.value === value){
          self.setData({
            houseTotal: 0,
            houseList: [],
            isHasSearch: !!self.value,
          })
          self.getHouseList()
          self.requestConfirm()
        }else{
          self.value = value
        }
      } else {
        this.setData({
          isHasSearch: false
        })
      }
    }, 500)
  },
  searchTag(e) {
    this.setData({
      isHasSearch: !!e.detail.item,
      keywords: e.detail.item
    })
    this.storageContrast()
    this.getHouseList()
    this.requestConfirm()
  },
  confirm () {
    const { keywords } = this.data;
    const { searchParams } = app.globalData;
    searchParams.keywordParams = {
      keyword: keywords,
    }
    let { searchInfo } = this.data
    // 判断searchInfo(高德返回的数据)中是否有城市字段，有则走选择城市的逻辑
    let cityName = ''
    let isHasCity = searchInfo.some(item => {
      let { typecode, name } = item
      if (isCityArray.indexOf(typecode) !== -1) {
        cityName = name
        return true
      } else {
        return false
      }
    })
    if (isHasCity && cityName) {
      searchParams.cleanParams('keywordParams');
      searchParams.cleanParams('locationParams');
      searchParams.cityParams = {
        cityName
      }
      
      this.navigateTo()
      return
    }
    this.storageContrast();
    this.navigateTo();
  },
  requestConfirm(){
    showLoading()
    const cityPoiType = `190102|190103|190104`
    const otherPoiType = `010000|010100|010101|010102|010103|010104|010105|010107|010108|010109|010110|010111|010112|010200|010300|010400|010401|010500|010600|010700|010800|010900|010901|011000|011100|050000|050100|050101|050102|050103|050104|050105|050106|050107|050108|050109|050110|050111|050112|050113|050114|050115|050116|050117|050118|050119|050120|050121|050122|050123|050200|050201|050202|050203|050204|050205|050206|050207|050208|050209|050210|050211|050212|050213|050214|050215|050216|050217|050300|050301|050302|050303|050304|050305|050306|050307|050308|050309|050310|050311|050400|050500|050501|050502|050503|050504|050600|050700|050800|050900|060000|060100|060101|060102|060103|060200|060201|060202|060300|060301|060302|060303|060304|060305|060306|060307|060308|060400|060401|060402|060403|060404|060405|060406|060407|060408|060409|060411|060413|060414|060415|060500|060501|060502|060600|060601|060602|060603|060604|060605|060606|060700|060701|060702|060703|060704|060705|060706|060800|060900|060901|060902|060903|060904|060905|060906|060907|061000|061001|061100|061101|061102|061103|061104|061200|061201|061202|061203|061204|061205|061206|061207|061208|061209|061210|061211|061212|061213|061214|061300|061301|061302|061400|061401|070000|070100|070200|070201|070202|070203|070300|070301|070302|070303|070304|070305|070306|070400|070401|070500|070501|070600|070601|070603|070604|070605|070606|070607|070608|070609|070610|070700|070701|070702|070703|070704|070705|070706|070800|070900|071000|071100|071200|071300|071400|071500|071600|071700|071800|071801|071900|071901|071902|071903|072000|072001|080000|080100|080101|080102|080103|080104|080105|080106|080107|080108|080109|080110|080111|080112|080113|080114|080115|080116|080117|080118|080119|080200|080201|080202|080300|080301|080302|080303|080304|080305|080306|080307|080308|080400|080401|080402|080500|080501|080502|080503|080504|080505|080600|080601|080602|080603|090000|090100|090101|090102|090200|090201|090202|090203|090204|090205|090206|090207|090208|090209|090210|090211|090300|090400|090500|090600|090601|090602|090700|090701|090702|100000|100100|100101|100102|100103|100104|100105|100200|100201|110000|110100|110101|110102|110103|110104|110105|110106|110200|110201|110202|110203|110204|110205|110206|110207|110208|110209|120000|120100|120200|120201|120202|120203|120300|120301|120302|120303|120304|130000|130100|130101|130102|130103|130104|130105|130106|130107|130200|130201|130202|130300|130400|130401|130402|130403|130404|130405|130406|130407|130408|130409|130500|130501|130502|130503|130504|130505|130506|130600|130601|130602|130603|130604|130605|130606|130700|130701|130702|130703|140000|140100|140101|140102|140200|140201|140300|140400|140500|140600|140700|140800|140900|141000|141100|141101|141102|141103|141104|141105|141200|141201|141202|141203|141204|141205|141206|141207|141300|141400|141500|150000|150100|150101|150102|150104|150105|150106|150107|150200|150201|150202|150203|150204|150205|150206|150207|150208|150209|150210|150300|150301|150302|150303|150304|150400|150500|150501|150600|150700|150701|150702|150703|150800|150900|150903|150904|150905|150906|150907|150908|150909|151000|151100|151200|151300|160400|160401|160402|160403|160404|160405|160406|160407|160408|160500|160501|160600|170000|170100|170200|180000|180100|180101|180102|180103|180104|180200|180201|180202|180203|180300|180301|180302|180400|180500|190000|190100|190101|190105|190106|190107|190108|190109|190200|190201|190202|190203|190204|190205|190300|190301|190302|190303|190304|190305|190306|190307|190308|190309|190310|190311|190400|190401|190402|190403|190500|190600|190700`
    const key = 'b403e838708e55f7f871baa0a5ea3ffe'
    // 请求两个接口：一个是获取城市相关的，另一个是正常的内容，后者可能会出现前者的内容
    let { keywords } = this.data
    let inputtipsUrl = `/v3/assistant/inputtips?key=${key}&keywords=${keywords}`
    let params = {
      "ops": [
        {
            "url": `${inputtipsUrl}&datatype=poi&type=${cityPoiType}`
        },
        {
            "url": `${inputtipsUrl}&datatype=poi&type=${otherPoiType}`
        }
    ]
    }
    batchRequest(params)
      .then(res => {
        let { data } = res
        let searchTips = []
        if (Array.isArray(data) && data.length > 0) {
          let [ cityPoiArray, otherPoiArray ] = data
          if (cityPoiArray && cityPoiArray['body'] && Array.isArray(cityPoiArray['body']['tips'])) {
            let { tips } = cityPoiArray['body']
            tips.forEach(item => {
              // 存在“市”字且在目前的城市字典里则放进显示的数组里
              if (item && /市/g.test(item['name']) && cityCodeList[item['name']]) {
                searchTips.push(item)
              }
            })
          }
          if (otherPoiArray && otherPoiArray['body'] && Array.isArray(otherPoiArray['body']['tips'])) {
            let { tips = [] } = otherPoiArray['body']
            searchTips = [
              ...searchTips,
              ...tips
            ]
          }
        } else {
          Promise.reject('res is null')
        }
        this.setData({
          searchInfo: searchTips
        })
        wx.hideLoading()
      })
      .catch(e => {
        wx.hideLoading()
        console.log(e)
      })
  },
  /**
   * 路由管理
   */
  navigateTo(url = '/pages/housing/list/index') {
    this.storageContrast()
    let pages = getCurrentPages()
    if (pages.length === 3) {
      wx.navigateBack({
        url
      })
    } else {
      wx.redirectTo({
        url: url
      })
    }
  },
  clickTag(e) {
    let { id, name } = e.detail.item
    // app.globalData.searchParams. = name
    this.navigateTo();
  },
  showMoreSearchCount() {
    let { showSearchCount } = this.data
    if (showSearchCount === 2) {
      this.setData({
        showSearchCount: 10
      })
    } else {
      this.setData({
        showSearchCount: 2
      })
    }
  },
  showAllHouses() {
    const { searchParams } = app.globalData;
    searchParams.cleanParams('locationParams');
    searchParams.cleanParams('cityParams');
    searchParams.keywordParams = {
      keyword: this.data.keywords,
    };
    searchParams.cityParams = {
      cityName: null,
    }
    this.navigateTo();
  },
  clickHouse(e) {
    app.globalData.searchParams.keywordParams = {
      keyword: this.data.keywords,
    }
    let { id } = e.currentTarget.dataset.item
    this.storageContrast()
    wx.navigateTo({
      url: `/pages/housing/detail/index?houseId=${id}`
    })
  },
  async clickLocation (e) {
    const value = e.currentTarget.dataset.item ? e.currentTarget.dataset.item : e.detail.item;
    let { district, location, typecode, adcode } = e.currentTarget.dataset;
    const { searchParams } = app.globalData;
    typecode = '' + typecode;
    
    // 如果typecode为市名则不传关键字，并清楚坐标信息
    if (isCityArray.indexOf(typecode) !== -1) {
      searchParams.keywordParams = {
        keyword: undefined,
      }
      searchParams.cleanParams('locationParams');
      searchParams.cityParams = {
        cityName: value
      }
      this.navigateTo()
      return
    }
    showLoading()
    let res = await getGeoCode({address: district})
    wx.hideLoading()
    let { geocodes } = res.data
    let geocodesInfo = geocodes[0]
    
    if (!geocodesInfo && !geocodesInfo.city) {
      catchLoading('无法获取此地址')
      return false
    }
    let { city: cityName } = geocodesInfo
    // 只有在按下确认健时传入keyword，其他情况只是单纯地显示keyword，利用keywordDummy来显示
    searchParams.keywordParams = {
      keywordDummy: value,
    }
    searchParams.cityParams = {
      cityName,
    }
    // 存放搜索内容
    this.storageContrast()

    // 如果location存在则处理
    if (location && typeof location === 'string') {
      // 处理经纬度
      let [longitude, latitude] = location.split(',')
      this.setData({
        keywords: value
      }) 
      if (this.handleAreaCode({ typecode, adcode, value })) {
        return 
      }
      searchParams.cleanParams('locationParams');
      searchParams.cityParams = {
        areaCode: undefined,
        provinceName: undefined,
      };
      searchParams.locationParams = {
        longitude,
        latitude,
      };
      searchParams.sortParams = {
        distanceSort: 0,
      };
      this.navigateTo()
    } else {
      // 没有location属性则getGeoCode来获取location
      let params = {
        address: value,
        city: cityName
      }
      showLoading()
      getGeoCode(params)
        .then(res => {
          let geocodes = res.data.geocodes[0]
          wx.hideLoading()

          if (geocodes && geocodes.location) {
            let [longitude, latitude] = geocodes.location.split(',')
            if (this.handleAreaCode({ typecode, adcode, value })) {
              return 
            }
            searchParams.cleanParams('locationParams');
            searchParams.cleanParams('cityParams', ['cityName']);
            searchParams.locationParams = {
              longitude,
              latitude,
            }
            this.navigateTo()
          } else {
            searchParams.cleanParams('locationParams');
            searchParams.cleanParams('cityParams', ['cityName']);
            this.navigateTo()
          }
        })
        .catch(e => {
          console.log('getGeoCode', e)
          catchLoading(e)
        })
    }
  },
  handleAreaCode({ typecode, adcode, value }) {
    const regionPoiType = ['190105']
    if (regionPoiType.includes(typecode)) {
      const { searchParams } = app.globalData;
      searchParams.cleanParams('keywordParams');
      searchParams.cleanParams('locationParam');
      searchParams.locationParams = {
        poiName: value,
      }
      searchParams.cityParams = {
        areaCode: adcode,
      }
      this.navigateTo()
      return true
    }
    return false
  },
  storageContrast(){//本地存储
    let { searchLogs, keywords } = this.data
    if (!keywords) {
      return false
    }
    let array = searchLogs
    if(array.length > 0){
      for(let i = 0; i < array.length; i++){
        if(array[i] === keywords){
          array.splice(i, 1); 
        }
      }
      if(keywords){
        array.unshift(keywords)
      }
      if(array.length >= 11){
        array.pop();
      }
    }else{
      array.unshift(keywords)
    }
    wx.setStorage({
      key:"searchLogs",
      data:array
    })
  },
  clearStorage(){
    let self = this
    wx.removeStorage({
      key: 'searchLogs',
      success: function(res) {
        self.setData({
          searchLogs: []
        })
      } 
    })
  },
  goToMoreCity () {
    wx.redirectTo({
      url: '/pages/searcharea/searcharea?from=searchkeyword'
    })
  },
  clean() {
    app.globalData.searchParams.cleanAll();
    this.setData({
      keywords: '',
      searchInfo: [],
      isHasSearch: false
    })
  },
  selectCity(e) {
    let { name } = e.detail.item
    const { searchParams } = app.globalData;

    if (name === '我的位置') {
      let { location, city, localName } = e.detail.item;
      let [longitude, latitude] = location.split(',')
      searchParams.cityParams = {
        cityName: city,
        areaCode: undefined,
        provinceName: undefined,
      }
      searchParams.locationParams = {
        latitude,
        longitude,
        poiName: undefined,
      }
      searchParams.keywordParams = {
        keywordDummy: localName,
      };
      searchParams.cleanParams('roomParams');
      searchParams.cleanParams('tagParams');
      this.navigateTo()
    } else {
      searchParams.cityParams = {
        cityName: name,
        areaCode: undefined,
        provinceName: undefined,
      }
      searchParams.cleanParams('locationParams');
      searchParams.cleanParams('roomParams');
      searchParams.cleanParams('tagParams');
      this.navigateTo()
    }
  },
  getCity() {
    getCity(({city, streetNumber}) => {
      this.setData({
        currnetCityLoading: false,
        currentCity: [
          {
            name: city
          },
          {
            name: '我的位置', 
            city: city,
            localName: streetNumber.street || '',
            location: streetNumber.location || ''
          }
        ]
      });
    }, (e) => {
      this.setData({
        getCurrnetCityText: '获取失败'
      })
    })
  },
})