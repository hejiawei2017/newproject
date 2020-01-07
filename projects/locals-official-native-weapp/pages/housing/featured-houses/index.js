const app = getApp()
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')
const { getAllCollct } = require('../../../server/mine')
const { isHasLogin, catchLoading } = require('../../../utils/util')
const { getHouseList, getCustomerTag, getFeaturedCity, postCollct } = require('../../../server/housing')

Page({
  isToLower: false,
  data: {
    pageNum: 1,
    pageSize: 20,
    bannerUrl: '',
    tagList: null,
    cityList: null,
    isLoading: true,
    selectedId: null,
    emptyHouse: false,
    collectList: null,
    cityListRange: null,
    isHasNextPage: true,
    featuredHouses: null,
    selectedCityIndex: null,
    cityInfo: {
      cityCode: "",
      cityName: "全国"
    },
    like: 'https://oss.localhome.cn/localhomeqy/like2.png',
    unlike: 'https://oss.localhome.cn/localhomeqy/like.png'
  },
  async onLoad(options) {
    this.selectComponent("#im-message").imLogin()
    
    // 通用标签
    const { customTagIds } = options
    this.setData({
      selectedId: customTagIds || ''
    })
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
    await this.getCityList()
    await this.getCustomerTag()
    wx.hideNavigationBarLoading()
  },
  async getCityList() {
    const response = await getFeaturedCity()
    const { cityList } = response
    const newCityList = cityList.map(item => item.cityName)
    // 判断用户的位置是否存在cityList中，有则默认是用户当前位置的城市，没有则默认广州
    const { searchParams } = app.globalData;
    let { cityName = app.globalData.defaultCity } = searchParams.cityParams;
    cityName = cityName.replace(/(市|城区)/g, '')
    const cityIndex = newCityList.indexOf(cityName)
    let data = {
      cityList,
      cityListRange: newCityList
    }
    if (cityIndex > -1) {
      const cityInfo = cityList[cityIndex]
      data.cityInfo = cityInfo
    }
    this.setData(data)
  },
  async getCustomerTag() {
    const { selectedId } = this.data
    const params = {
      categoryType: '1004',
      status: 1,
      pageNum: 1,
      isSearch: 1,
      pageSize: 30
    }
    const response = await getCustomerTag(params)
    let { list } = response.data;
    let tagList = [];
    let selectedItem = null
    
    list.forEach(item => {
      if (selectedId === item.id) {
        selectedItem = item
      }
      tagList.push(item)
    })
    
    // 异步获取通用标签的房源
    // 如果上一页有传customTagIds则请求此id，否则获取getCustomerTag第一个id
    if (!selectedItem) {
      selectedItem = tagList[0]
    }
    this.setData({
      tagList,
      selectedId: selectedItem ? selectedItem.id : '',
      bannerUrl: selectedItem ? `${selectedItem.image}` : '',
    }, this.getCustomerTagHouses)
  },
  async getCustomerTagHouses() {
    const { pageNum, pageSize, selectedId, isHasNextPage, featuredHouses, cityInfo } = this.data
   
    if (!isHasNextPage) {
      return
    }
    const { cityCode } = cityInfo
    const params = {
      pageNum,
      pageSize,
      cityCode,
      customTagIds: selectedId,
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
      if (item.cityName) {
        item.cityName = item.cityName.replace(/(市|城区)/g, '')
      }
      return item
    })

    this.setData({
      isHasNextPage: hasNextPage,
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
  bindPickerChange(e) {
    const { value } = e.detail
    const { cityList } = this.data
    
    this.setData({
      pageNum: 1,
      isLoading: true,
      featuredHouses: [],
      isHasNextPage: true,
      selectedCityIndex: value,
      cityInfo: cityList[value],
    }, this.getCustomerTagHouses)
  },
  selectTag(e) {
    const { item, from } = e.currentTarget.dataset
    const { bannerUrl, selectedId } = this.data
    const { id, image, name } = item
    
		if (id !== selectedId) {
      const eventName = from === 'bottom' ? 'landing_page_bottom_label' : 'landing_page_label'
      getApp().mtj.trackEvent(eventName, {
        tag_name: name, 
      });
      this.setData({
        pageNum: 1,
        selectedId: id,
        isLoading: true,
        featuredHouses: [],
        isHasNextPage: true,
        bannerUrl: `${image}` || bannerUrl,
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
  }
})