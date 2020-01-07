const { getDistrict } = require('../../../server/map')
const { getHouseList } = require('../../../server/housing')
const { showLoading, catchLoading, arrayToString, deepCompare } = require('../../../utils/util')
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')
const moment = require('../../../utils/dayjs.min.js');
const overlapData = require('../../../libs/overlap-data/index.js');
const app = getApp()

Page({
  // 搜索房源的经纬度
  latitude: 0,
  longitude: 0,
  // 搜索此经纬度的半径距离(km)内的房源
  distance: 2,
  changeTimes: 0,
  data: {
    item: null,
    selectHouseIndex: null,
    houses: [],
    markers: [],
    markerDatas: [],
    scaleCount: 15,
    isHiddenHouse: true,
    isHiddenCenterPoint: false,
    // 初始化本地经纬度
    presentLatitude: 0,
    presentLongitude: 0,
    poiName: '',
    defaultHouseImage: app.globalData.defaultHouseImage,
    checkDate: ''
  },
  onLoad() {
    this.selectComponent("#im-message").imLogin();
    this.map = wx.createMapContext('map');
  },
  onShow() {
    this.init();
  },
  async init() {
    const { searchParams } = app.globalData;
    const { latitude, longitude, poiName } = searchParams.locationParams;
    this.latitude = parseFloat(latitude || 0);
    this.longitude = parseFloat(longitude || 0);
    const paramsGlobal = searchParams.getParams();
    // 深对比searchParamsDummy和params，为false时重新请求，否则不请求
    const isEqualParams = deepCompare(this.searchParamsDummy, paramsGlobal);
    this.searchParamsDummy = { ...paramsGlobal };

    this.setData({
      checkDate: `${moment(paramsGlobal.endDate).format('MM.DD')}-${moment(paramsGlobal.beginDate).format('MM.DD')}`
    })
    if (!isEqualParams) {
      try {
        // 获取当前选择的城市，然后获取城市的经纬度
        this.setData({
          poiName: poiName || '',
          changeTimes: searchParams.roomParamsChangeTimes || 0
        })
        // 是否有经纬度，否则获取当前城市的经纬度
        if (this.latitude && this.longitude) {
          this.getCityPostion({
            latitude: this.latitude,
            longitude: this.longitude
          })
        } else {
          // 获取城市的经纬度
          this.getCityCenter()
        }
      } catch(e) {
        console.log(e)
      }
    }
  },
  getCityHouseList() {
    const { searchParams } = app.globalData;
    const { cityName } = searchParams.cityParams;
    return getHouseList({cityName})
  },
  reloadMap() {
    this.setData({
      markers: [],
      isHiddenHouse: true
    })
  },
  getCityCenter() {
    // 获取当前选择的城市，然后获取城市的经纬度
    const { searchParams } = app.globalData;
    const { cityName: city, areaCode } = searchParams.cityParams;
    const { poiName } = searchParams.locationParams;
    showLoading()
    getDistrict({
      keywords: areaCode || poiName || city,
      subdistrict: 0
    })
      .then(res => {
        if (res.data && res.data.status) {
          let center = res.data.districts[0].center.split(',')
          this.getCityPostion({
            latitude: parseFloat(center[1]),
            longitude: parseFloat(center[0])
          })
        } else {
          Promise.reject('无法获取城市center经纬度')
        }
        wx.hideLoading()
      })
      .catch(e => {
        catchLoading(e)
      })
  },
  // 获取城市经纬度的房源
  getCityPostion({longitude, latitude}) {
    this.latitude = latitude
    this.longitude = longitude
    this.setData({
      presentLatitude: latitude,
      presentLongitude: longitude
    }, this.setHousesMaps)
    // this.getRegion(() => {
    //   this.setHousesMaps()
    // })
  },
  // 获取当前定位坐标
  getLocationPostion() {
    showLoading()
    wx.getLocation({
      type: 'wgs84',
      altitude: true,//开启精确定位，但会影响定位速度
      success: res => {
        this.latitude = res.latitude
        this.longitude = res.longitude
        this.setData({
          presentLatitude: res.latitude,
          presentLongitude: res.longitude
        })
        this.getRegion(() => {
          this.setHousesMaps()
        })
      }
    })
  },
  // 设置地图园块
  getCirclesObject(latitude, longitude) {
    return [{
      radius: this.distance * 1000,
      latitude,
      longitude,
      fillColor: '#e843591f',
      color: '#e843591f'
    }]
  },
  // 拖动地图或缩放地图触发
  bindregionchange(e) {
    if (e.type === 'begin') {
      // 显示
      this.processCenterPointHidden(false)
    }
  },
  // 更新marker时触发，在bindregionchange之后
  bindupdated(e) {
    // 隐藏
    this.processCenterPointHidden(true)
  },
  processCenterPointHidden(display = true) {
    this.centerPointId && clearTimeout(this.centerPointId)
    this.centerPointId = setTimeout(() => {
      this.setData({
        isHiddenCenterPoint: display
      })
    }, 200)
  },
  // 获取当前地图的对角线的西南经纬度 东北经纬度
  getRegion(callback) {
    this.map.getRegion({
      success: res => {
        let { northeast, southwest } = res
        let distance = this.getDistance(
          northeast.latitude,
          northeast.longitude,
          southwest.latitude,
          southwest.longitude
        )
        this.distance = distance / 2 

        if (typeof callback === 'function') {
          callback()
        }
      }
    })
  },
  // 获取两个经纬度之间的距离,此为直径
  getDistance(lat1, lng1, lat2, lng2){
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var  b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b/2),2)));
    s = s * 6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
  },
  // 获取地图中心点
  getCenterLocation(callback) {
    this.map.getCenterLocation({
      success: res => {
        this.latitude = res.latitude
        this.longitude = res.longitude
        if (typeof callback === 'function') {
          callback()
        }
      }
    })
  },
  setHousesMaps() {
    let params = app.globalData.searchParams.getParams();

    // 设置园块
    this.setData({
      circles: this.getCirclesObject(this.latitude, this.longitude)
    })
    if (params.endDate || params.beginDate) {
      params.endDate = moment(params.endDate).format('YYYY-MM-DD');
      params.beginDate = moment(params.beginDate).format('YYYY-MM-DD');
    }
    params = {
      ...params,
      pageSize: 50,
      latitude: this.latitude,
      longitude: this.longitude,
      distance: this.distance,
    }
    wx.showNavigationBarLoading()
    // 节流取消上次的请求
    app.requestTask && app.requestTask.abort()
    getHouseList(params)
      .then(res => {
        const { data } = res
        const { list } = data
        let houses = list.map(item => ({
          id: item.id,
          title: item.title,
          stars: item.stars,
          booked: item.booked,
          location: item.location,
          bedNumber: item.bedNumber,
          roomNumber: item.roomNumber,
          houseImages: item.houseImages,
          toiletNumber: item.toiletNumber,
          tenantNumber: item.tenantNumber,
          commentStatis: item.commentStatis,
          standardPrice: item.standardPrice,
          originPrice: item.originPrice,
          otherTenantNumber: item.otherTenantNumber,
          publicToiletNumber: item.publicToiletNumber,
        }))
        
        let markers = this.createNewMarkers(res.data.list)
        this.setData({
          houses,
          markers,
        })
        wx.hideNavigationBarLoading()
        wx.hideLoading()
      })
      .catch(e => {
        console.log('取消请求', e)
      })
  },
  createNewMarkers(list = [], markerId) {
    if (!Array.isArray(list)) {
      throw new Error('type of list must be array');
    }
    const systemInfo = wx.getSystemInfoSync();
    const data = overlapData.overlap({ data: list });
    const mergePrice = overlapData.genPrimaryKey(data, 'standardPrice', data =>
      Math.min(...data.map(item => item.standardPrice))
    );
    const mergeBooked = overlapData.genPrimaryKey(mergePrice, 'booked', data => data.every(item => item.booked));

    this.setData({ markerDatas: mergeBooked });
    return mergeBooked.map(item => {
      let [latitude, longitude] = item.base.split(',');
      let marker = null;
      let callout = {
        borderWidth: 0,
        content: ` ¥${Math.round(item.standardPrice)} `,
        color: '#fff',
        fontSize: 12,
        borderRadius: 2,
        bgColor: '#e84358',
        textAlign: 'center',
        padding: systemInfo.platform === 'ios' ? 3 : 6,
        display: 'ALWAYS',
        textAlign: 'center'
      };

      if (markerId === item.id) {
        callout = {
          ...callout,
          bgColor: '#ff7b8d',
          color: '#fff',
          padding: systemInfo.platform === 'ios' ? 5 : 8
        };
      }

      // 当前范围下所有的房源都被预定了
      if (item.booked) {
        callout = {
          ...callout,
          bgColor: '#f5f5f5',
          color: '#242424',
        };
      }

      marker = {
        callout,
        // 空的图片，解决不让微信地图原生的标记显示
        iconPath: '/assets/placeholder-image.png',
        id: item.id,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        width: 1,
        height: 1
      };

      if (item.data.length > 1) {
        marker.label = {
          content: systemInfo.platform === 'ios' ? `${item.data.length}` : ` ${item.data.length} `,
          color: '#e84358',
          fontSize: 9,
          borderColor: '#e84358',
          borderWidth: 1,
          borderRadius: systemInfo.platform === 'ios' ? 10 : 16,
          bgColor: '#fff',
          textAlign: 'center',
          padding: 3,
          anchorX: 14,
          anchorY: -37
        }
      }

      return marker;
    });
  },
  markertap(e) {
    let { markerId } = e
    let { houses, markerDatas } = this.data
    let item = null
    
    const currentMarkerData = markerDatas[markerId];
    const markers = this.createNewMarkers(houses, markerId);
    if (currentMarkerData.data.length !== 1) {
      app.globalData.__current_location_houses = currentMarkerData.data;
      wx.navigateTo({
        url: '/pages/housing/current-location-houses/index',
      });
      return;
    }
    const houseDetail = currentMarkerData.data[0];
    let [ latitude, longitude ] = houseDetail.location.split(',')
    this.setData({
      item: {
        ...houseDetail,
        stars: Math.round(houseDetail.stars),
        tenantTotal: parseInt(houseDetail.tenantNumber) + parseInt(houseDetail.otherTenantNumber),
      },
      markers,
      isHiddenHouse: false,
      selectHouseIndex: 0,
      presentLatitude: latitude,
      presentLongitude: longitude
    })
    return;
  },
  selectHouse() {
    getApp().mtj.trackEvent('map_detail')
    let { id } = this.data.item
    if (!id) {
      return false
    }
    wx.navigateTo({
      url: '/pages/housing/detail/index?houseId=' + id
    })
  },
  clickButton(e) {
    let { type } = e.currentTarget.dataset
    this.setData({
      isShowHouse: false
    })
    switch(type) {
      case "location":
        getApp().mtj.trackEvent('map_move_to_location')
        this.moveToLocation()
        break;
      case "refresh":
        getApp().mtj.trackEvent('map_refresh')
        this.refreshLocation()
        break;
    }
  },
  moveToLocation() {
    this.map.moveToLocation()
    // 待微信修复bug将此代码删掉
    setTimeout(() => {
      this.getCenterLocation(this.setHousesMaps)
    }, 800)
  },
  refreshLocation() {
    // 更新中心点后获取房源
    this.getCenterLocation(this.setHousesMaps)
  },
  //区域搜索
  openPoisSearch() {
    getApp().mtj.trackEvent('map_pois');
    wx.navigateTo({
      url: '/pages/housing/poi-search/index?from=map'
    })
  },
  //打开筛选
  openScreenSearch() {
    getApp().mtj.trackEvent('map_filter');
    wx.navigateTo({
      url: '/pages/housing/screen-search/index?from=map'
    })
  },
  clickArrow(e) {
    getApp().mtj.trackEvent('map_arrow')
    let { type } = e.currentTarget.dataset
    let { houses, selectHouseIndex } = this.data
    let willIndex = null
    switch(type) {
      case "last":
        willIndex = selectHouseIndex - 1
        if (willIndex < 0) {
          willIndex = houses.length - 1
        }
        break;
      case "next":
        willIndex = selectHouseIndex + 1
        if (willIndex >= houses.length) {
          willIndex = 0
        }
        break;
    }
    if (willIndex !== null) {
      this.markertap({
        markerId: houses[willIndex]['id']
      })
    }
  }
})