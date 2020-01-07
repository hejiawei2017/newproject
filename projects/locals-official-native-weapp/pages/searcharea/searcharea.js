let { getCityList, fetchForeignCity } = require('../../server/city');
const { fetchHotHouseList } = require('../../server/housing')
const regeneratorRuntime = require('../../libs/regenerator-runtime.js')
let app = getApp()

Page({
  data: {
    city: [],
    foreignCity: [],
    from:'',
  },
  onLoad(options) {
    this.setData({//注册房东达人跳转选择城市页面，自带form=landlord参数
      from: options.from || '',
      activeTabNumber: +options.activeTabNumber || 0,
    })
    wx.showNavigationBarLoading()
    this.init()
  },
  init() {
    this.getCityList()
    this.getForeignCity();
  },
  onShow(){
    this.selectComponent("#im-message").imLogin()
  },
  /**
   * 路由管理
   */
  navigateTo(params = {}, url = '/pages/housing/list/index') {
    let pages = getCurrentPages()
    if (pages.length === 3) {
      wx.navigateBack({
        url
      })
    } else {
      wx.redirectTo({
        url,
      })
    }
  },
  getCityList() {
    let params = {
      pageSize: 5000,
      existCity: true
    }
    Promise.all([getCityList(params), fetchHotHouseList()])
      .then(values => {
        let [ cityResult, heatCityResult ] = values
        let { list : city = [] } = cityResult.data
        let { data: heatCity = [] } = heatCityResult
        
        this.setData({
          city,
          heatCity
        })
        wx.hideNavigationBarLoading()
      })
      .catch((e) => {
        console.log(e)
        wx.hideNavigationBarLoading()
        wx.showToast({icon: 'none', title: '网络原因无法加载'})
      })
  },
  async getForeignCity() {
    const { data: foreignCity } = await fetchForeignCity();
    wx.setStorageSync('foreignCity', foreignCity);
    this.setData({
      foreignCity,
    })
  },
  getDetail(e){
    // 是否从注册房东达人跳转过来，在globalData添加landlordCity变量
    if (this.data.from === 'landlord') {
      app.globalData.landlordCity = e.detail
    } else {
      const { searchParams } = app.globalData;
      
      searchParams.cleanParams('keywordParams');
      searchParams.cleanParams('locationParams');
      searchParams.cleanParams('cityParams');
      searchParams.cleanParams('roomParams');
      searchParams.cleanParams('tagParams');
      searchParams.cityParams = {
        cityName: e.detail.name
      }
      this.navigateTo()
    }
  },
  goToCurrentLocal(e) {
    const { localName, currentCity } = e.detail
    const location = e.detail.location.split(',')
    const [longitude, latitude] = location
    const { searchParams } = app.globalData;
    searchParams.cleanParams('keywordParams');
    searchParams.cleanParams('locationParams');
    searchParams.cleanParams('cityParams');
    searchParams.cityParams = {
      cityName: currentCity
    }
    searchParams.keywordParams = {
      keywordDummy: localName
    }
    searchParams.locationParams = {
      latitude,
      longitude,
    }
    this.navigateTo()
  },
  input(e){
    this.value = e.detail.value
  },
  searchMt(){
    // 当没有输入的时候，默认inputvalue 为 空字符串，因为组件 只能接受 string类型的 数据 
    if(!this.value){
      this.value = '';
    }
    this.setData({
      value: this.value
    })
  }
  
})