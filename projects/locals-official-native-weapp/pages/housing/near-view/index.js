const app = getApp()
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')
const { getAllCollct } = require('../../../server/mine')
const { isHasLogin, catchLoading } = require('../../../utils/util')
const { getHouseList,getCustomerTag, postCollct } = require('../../../server/housing')
const cityArr = [{cityName:'成都',cityCode:510100},{cityName:'重庆',cityCode:500100},{cityName:'广州',cityCode:440100},{cityName:'北京',cityCode:110100},{cityName:'西安',cityCode:610100},{cityName:'珠海',cityCode:440400},{cityName:'武汉',cityCode:420100},{cityName:'青岛',cityCode:370200},{cityName:'杭州',cityCode:330100},{cityName:'厦门',cityCode:350200}]

Page({
  isToLower: false,
  data: {
    pageNum: 1,
    pageSize: 15,
    bannerUrl: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/nearview/%E6%9A%91%E6%9C%9F%E7%83%AD%E9%97%A8.jpg',
    cityArr: cityArr,
    selectedCode:510100,
    selectedName:'成都',
    targetTagIds:'1157908631992528896',
    targetTagName:null,
    isLoading: true,
    emptyHouse: false,
    collectList: null,
    isHasNextPage: true,
    featuredHouses: null,
    selectedCityIndex: null,
    like: 'https://oss.localhome.cn/localhomeqy/like2.png',
    unlike: 'https://oss.localhome.cn/localhomeqy/like.png'
  },
  async onLoad() {
    this.selectComponent("#im-message").imLogin()
    await this.init()
  },
  async signInCallback() {
    if (this.willDoSomething) {
      const [ method, params ] = this.willDoSomething.split(':')
      switch(method) {
        case 'collection':
          const paramsArray = params.split('&')
          let paramsObj = {}
          paramsArray.forEach(item => {
            const [ key, value ] = item.split('=')
            paramsObj[key] = value
          })
          await this.getCollct()
          await this.collection(paramsObj)
          break;
      }
      this.willDoSomething = ''
    }
  },
  // onPullDownRefresh() {
  //   this.init()
  // },
  async init() {
    wx.showNavigationBarLoading()
    await this.getCustomerTag()
    wx.hideNavigationBarLoading()
  },
  async getCustomerTag() {
    const { targetTagIds } = this.data
    const params = {
      status: 1,
      pageNum: 1,
      isSearch: 1,
      pageSize: 30
    }
    const response = await getCustomerTag(params)
    let { list } = response.data;
    const targetTag = list.filter(item => item.id === targetTagIds)
    if(!targetTag || targetTag.length === 0) { 
      this.setData({ isLoading:false })
      return
    }
    this.setData({
      targetTagName:targetTag[0].name,
    }, this.getCustomerTagHouses)
  },
  async getCustomerTagHouses() {
    const { pageNum, pageSize, selectedCode,targetTagIds, isHasNextPage, featuredHouses } = this.data
   
    if (!isHasNextPage) {
      return
    }
    const params = {
      pageNum,
      pageSize,
      cityCode:selectedCode,
      allTagIds:targetTagIds,
      limitImage: 3,
      rankingSort: 0 
    }
    const response = await getHouseList(params)
    const { data } = response
    const { list, hasNextPage } = data
    const newList = list.map(item => {
      item.toiletNumber = (item.toiletNumber || 0) + (item.publicToiletNumber || 0)
      if (item.houseImages) {
        item.houseImages.forEach((image, index) => {
          // 大于0获取更小的图
          if (index > 0) {
            image.imagePath = `${image.imagePath}?x-oss-process=image/resize,w_400/quality,Q_100`
          } else {
            image.imagePath = `${image.imagePath}?x-oss-process=image/resize,w_600/quality,Q_100`
          }
        })
      }
      // 筛选出最近景点
      if (Array.isArray(item.hotScenicSpots) && item.hotScenicSpots.length > 0) {
        let hotScenicSpotsShow = {distance:null,hotScenicSpot:''}
        const hotScenicSpots = item.hotScenicSpots
        hotScenicSpots.forEach(item2 => hotScenicSpotsShow = item2.distance < hotScenicSpotsShow.distance || !hotScenicSpotsShow.distance ? item2 : hotScenicSpotsShow)
        item['hotScenicSpotsShow'] = hotScenicSpotsShow
      }
      if (item.cityName) {
        item.cityName = item.cityName.replace(/(市|城区)/g, '')
      }
      return item
    })

    this.setData({
      // 需求只需要显示15个数据，所以不做分页。如需分页  将 false 改为 hasNextPage
      isHasNextPage: false,
      isLoading: false,
      emptyHouse: !newList || !newList.length,
      pageNum: hasNextPage ? pageNum + 1 : pageNum,
      featuredHouses: pageNum === 1 ? newList : [].concat(featuredHouses, newList),
    }, () => {
      // 获取收藏列表
      this.getCollct()
      this.setIsToLower()
    })
  },
  async getCollct() {
    let { collectList } = this.data
    if (Array.isArray(collectList)) {
      collectList.forEach(item => {
        this.updateHouseListFavStatus(item.houseSourceId, true)
      })
    } else {
      const response = await getAllCollct()
      const { data } = response
      // loop 修改房源收藏状态
      data.forEach(item => {
        this.updateHouseListFavStatus(item.houseSourceId, true)
      })
      this.setData({
        collectList: data
      })
    }
  },
  updateHouseListFavStatus(houseSourceId, success) {
    let { featuredHouses } = this.data
    const newList = featuredHouses.map(item => {
      if (item.id === houseSourceId) {
        item['isFav'] = !!success
      }
      return item
    })
    this.setData({
      featuredHouses: newList
    })
  },
  async collection(e) {
    let houseNo = ''
    let houseSourceId = ''
    if (e && e.houseSourceId) {
      houseSourceId = e.houseSourceId
      houseNo = e.houseNo
    } else {
      const { id, houseNo: tempHouseNo } = e.currentTarget.dataset.houseInfo
      houseSourceId = id
      houseNo = tempHouseNo
    }
    const { featuredHouses } = this.data
    const params = {
      houseSourceId
    }
    // 判断是否登录，否则唤起登录
    if (!isHasLogin()) {
      this.willDoSomething = `collection:houseSourceId=${houseSourceId}&houseNo=${houseNo}`
      this.selectComponent("#auth-drawer-box").showAuthBox()
    } else {
      const response = await postCollct(params)
      const { data } = response
      const newList = featuredHouses.map(item => {
        if (item.id === houseSourceId) {
          item['isFav'] = data === 'create'
        }
        return item
      })
      this.setData({
        featuredHouses: newList
      })
      getApp().mtj.trackEvent('landing_page_like', {
        house_no: houseNo,
        status: data === 'create' ? '喜欢' : '取消喜欢', 
      });
      if (data === 'create') {
        wx.showToast({
          title: '收藏成功~',
          icon: 'none'
        })
      } else if (data === 'delete') {
        const { collectList } = this.data
        const newList = collectList.filter(item => item.id === houseSourceId)
        this.setData({
          collectList: newList
        })
        wx.showToast({
          title: '已取消收藏~',
          icon: 'none'
        })
      }
    }
  },
  selectCityArr(e) {
    const { item,from } = e.currentTarget.dataset
    const { selectedCode } = this.data
    const { cityCode, cityName } = item
    if(from === 'bottom'){
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }
		if (cityCode !== selectedCode) {
      this.setData({
        pageNum: 1,
        selectedCode: cityCode,
        selectedName: cityName,
        isLoading: true,
        featuredHouses: [],
        isHasNextPage: true,
      }, () => {
        this.getCustomerTagHouses()
      })
    }
  },
  skipTo(e) {
    const { type } = e.currentTarget.dataset
    let url = ''
    switch(type) {
      case 'detail':
        const { houseInfo } = e.currentTarget.dataset
        const { id, houseNo } = houseInfo
        getApp().mtj.trackEvent('landing_housing_detail', {
          from: '精选栏目',
          house_no: houseNo, 
        });
        url = `/pages/housing/detail/index?houseId=${id}`
        break;
    }
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  onReachBottom(e) {
    // 判断是否到底，限制只执行一次，执行结束后修改isToLower
    if (!this.isToLower) {
      this.isToLower = true
      let { emptyHouse, isLoading, isHasNextPage } = this.data
      if (
        !emptyHouse 
        && !isLoading 
        && isHasNextPage
      ) {
        this.setData({
          isLoading: true
        })
        this.getCustomerTagHouses()
      }
    }
  },
  setIsToLower() {
    this.isToLower = false
  },
  skipToPoster(e) {
    const { houseInfo } = e.currentTarget.dataset
    let { standardPrice, title, id, houseImages, houseNo } = houseInfo;
    if (Array.isArray(houseImages) && houseImages.length > 0) {
      // 记录横版主图，用于分享封面以及海报生成
      const filterPic = houseImages.filter(x => x.module === '主图(横图)');
      let houseImgPath = ''
      if (filterPic.length !== 0){
        houseImgPath = filterPic[0].imagePath
      } else {
        houseImgPath = houseImages[0].imagePath
      }
      getApp().mtj.trackEvent('landing_page_share', {
        house_no: houseNo, 
      });
      wx.navigateTo({
        url: `/pages/housing/poster/index?price=${standardPrice}&title=${title}&houseId=${id}&houseImgPath=${houseImgPath}`
      }) 
    } else {
      catchLoading('没有图片!无法分享')
    }
  },
  jumpMore() {
    const { selectedName, targetTagIds } = this.data
    const searchParams = app.globalData.searchParams
    searchParams.tagParams = {
      allTagIds: targetTagIds
    }
    wx.navigateTo({
      url:`/pages/housing/list/index?selectCityName=${selectedName}市`
    })
  },
  jumpCitySel() {
    wx.redirectTo({
      url:`/pages/searcharea/searcharea`
    })
  }
})