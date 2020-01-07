const app = getApp();
const moment = require('../../../utils/dayjs.min.js');
const { getAllCollct } = require('../../../server/mine');
const { fetchForeignCity } = require('../../../server/city');
const { cityCodeList, sortList } = require('../../../utils/dictionary');
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js');
const { getHouseList, getCustomerTag } = require('../../../server/housing');
const { isHasLogin, throttle, arrayToString, deepCompare,gioTrack } = require('../../../utils/util');
const { FOREIGN_NAME } = require('../../../common/const');

Page({
  poiName: '',
  isToLower: false,
  inter: null,
  houseListIds: [],
  pageNum: 1,
  pageSize: 10,
  isShowAuth: false,
  collectList: [],
  allTagIds: '',
  data: {
    defaultAvatar: app.globalData.defaultAvatar,
    houseList: null,
    isUpperLoading: false,
    isLoading: true,
    isRequestError: false,
    isHasNextPage: true,
    inputShowed: false,//输入框开
    isHasClickScreenSearch: false,
    isHasClickScopeSearch: false,
    isHasClickKeyword: false,
    poiId: '',
    ad1Text: '选择价格和入住人数\n更精准找到你想要的民宿',
    ad2Text: '不知道住哪里合适？\n试试这里选择热门商圈',
    ad3Text: '想查找指定位置民宿\n试试点这里搜索',
    emptyHouse: false,
    // 头部的动画
    headerAnimationData: {},
    isHasLogin: isHasLogin(),
    isForeignCity: false,
    cityName: null,
    showMoreTag: false,
    styleTags:[],
    temporaryTags:[],
    showTagImg:false,
    tagBgImg:null,
    isChooseTags:false,
    tagAnimationData:{},
    navbarAnimationData:{}
  },
  onLoad(options) {
    let { selectCityName, from } = options
    const searchParams = app.globalData.searchParams
    // 直接搜索某个城市的房源
    if (selectCityName) {
      searchParams.cityParams = { cityName: selectCityName };
    }
    // 判断为海外民宿标签
    if (selectCityName === FOREIGN_NAME) {
      // 设置tagId
      searchParams.tagParams = {
        allTagIds: '1059368807866712066',
      }
    }

    this.selectComponent("#im-message").imLogin();
    let { windowHeight } = wx.getSystemInfoSync();
    this.windowHeight = windowHeight;
  },
  async getForeignCity() {
    const { data: foreignCity } = await fetchForeignCity();
    wx.setStorageSync('foreignCity', foreignCity);
  },
  onShow() {
    this.setData({
      isHasLogin: isHasLogin(),
      showMoreTag: false
    })
    this.init();
  },
  resetHouseParams() {
    this.houseListIds = [];
    this.pageNum = 1;
  },
  getSortLabel() {
    const { sortParams } = app.globalData.searchParams;
    const key = Object.keys(sortParams)[0];
    let sortLabel = '';
    sortList.some(item => {
      if (item.key === key && item.value === sortParams[key]) {
        sortLabel = item.label;
        return true;
      }
      return false;
    })
    return sortLabel;
  },
  async init() {
    // 如果是直接传入城市时，则获取国外城市来判断是否国外城市
    if (this.options.selectCityName) {
      await this.getForeignCity();
    }
    const { searchParams } = app.globalData;
    console.log(searchParams)
    const paramsGlobal = searchParams.getParams();
    const { beginDate, endDate } = searchParams.dateParams;
    const { cityName } = searchParams.cityParams;
    const { poiName } = searchParams.locationParams;
    // 深对比searchParamsDummy和params，为false时重新请求，否则不请求
    const isEqualParams = deepCompare(this.searchParamsDummy, paramsGlobal);
    this.searchParamsDummy = { ...paramsGlobal };
    if (!isEqualParams) {
      const sortLabel = this.getSortLabel();
      this.resetHouseParams();
      // will delete
      const isNotNeedShowCity = ['成都市','重庆市','广州市','西安市','武汉市','青岛市','南京市','海口市'];
      const showMainTag = isNotNeedShowCity.some(i => i === cityName);
      // will delete
      this.setData({
        isForeignCity: this.getisForeignCity(),
        sortLabel,
        showMainTag,  // will delete
        houseList: [],
        poiName: poiName || '位置',
        keyword: searchParams.getKeyword() || '',
        searchEndDate: endDate,
        searchStartDate: beginDate,
        changeTimes: searchParams.roomParamsChangeTimes,
        cityName,
      }, this.getHouses);
      this.getCustomerTag();
      this.setNavigationBarTitle(cityName);
    }
  },
  setNavigationBarTitle(cityName) {
    wx.setNavigationBarTitle({
      title: cityName ? cityName : '所有城市',
    })
  },
  // 判断是否国外城市
  getisForeignCity() {
    const { searchParams } = app.globalData;
    return searchParams.isForeignCity;
  },
  signInCallback(){
    if (isHasLogin()) {
      this.setData({
        isHasLogin: true
      })
      // 点击登录后重新获取收藏列表
      if(this.isShowAuth){
        this.getCollct()
      } 
    }
  },
  getCollct() {
    let { collectList } = this
    if (Array.isArray(collectList) && collectList.length > 0) {
      collectList.forEach(item => {
        this.updateHouseListFavStatus(item, true)
      })
    } else {
      getAllCollct()
        .then(res => {
          collectList = res.data
          let collectArray = []
          // loop 修改房源收藏状态
          collectList.forEach(item => {
            const { houseSourceId } = item
            collectArray.push(houseSourceId)
            this.updateHouseListFavStatus(houseSourceId, true)
          })
          this.collectList = collectArray
        })
        .catch(e => {
          console.log('collect error')
        })
    }
  },
  getHouses() {
    const { searchParams } = app.globalData;
    const { pageNum } = this;
    let paramsGlobal = searchParams.getParams();
    paramsGlobal.pageNum = pageNum;
    if (paramsGlobal.endDate || paramsGlobal.beginDate) {
      paramsGlobal.endDate = moment(paramsGlobal.endDate).format('YYYY-MM-DD');
      paramsGlobal.beginDate = moment(paramsGlobal.beginDate).format('YYYY-MM-DD');
    }
    // 海外民宿请求不带cityName字段
    if (paramsGlobal.cityName === FOREIGN_NAME) {
      Reflect.deleteProperty(paramsGlobal, 'cityName');
    }
    wx.showNavigationBarLoading()
    this.setData({
      isLoading: true,
    })
    getHouseList(paramsGlobal)
    .then(res => {
      let { list } = res.data
      this.setData({
        emptyHouse: false
      })
      if (Array.isArray(list) && list.length > 0) {
        // 过滤已存在的房源id
        let newlist = list.filter(item => {
          if (this.houseListIds.indexOf(item.id) === -1) {
            let tags = []
            // 将标签合并
            if (Array.isArray(item.bizTag) && item.bizTag.length > 0) {
              tags = tags.concat(item.bizTag)
            }
            if (Array.isArray(item.customTag) && item.customTag.length > 0) {
              tags = tags.concat(item.customTag)
            } 
            item.isForeignCity = tags.some(i => i.tagName === '海外民宿');
            // 处理距离poi的距离
            if (item.locationDistance) {
              let locationDistance = parseInt(item.locationDistance)
              if (locationDistance >= 1000) {
                locationDistance = locationDistance / 1000
                locationDistance = locationDistance.toFixed(1) + '公里'
              } else {
                locationDistance = locationDistance + '米'
              }
              item['locationDistance'] = locationDistance
            }
            item['commentStatis'] = item.commentStatis ? item.commentStatis : item.commentCoun
            item['tags'] = tags
            if (item.label) {
              const label = item.label
              const labels = label.split(',')
              item['labels'] = labels
            }else{
              item['labels'] = []
            }
            // 处理stars
            item['stars'] = item.stars ? item.stars.toFixed(1) : '5.0'
            item['starsAverage'] = item.starsAverage ? item.starsAverage.toFixed(1) : '5.0'
            // 检查房东头像是否存在
            if (!item.landlord) {
              item['landlord'] = {}
            }
            if (!item['landlord']['avatar']) {
              item['landlord']['avatar'] = this.data.defaultAvatar
            }
            // 如果是lotel，则修改houseImages为lotelPhotoPath的数据
            if (item.houseSourceType === 2 && Array.isArray(item.lotelPhotoPath)) {
              item.houseImages = item.lotelPhotoPath.map((item, index) => ({ id: index, imagePath: item  }))
            }
            // 筛选出最近景点
            if (Array.isArray(item.hotScenicSpots) && item.hotScenicSpots.length > 0) {
              let hotScenicSpotsShow = {distance:null,hotScenicSpot:''}
              const hotScenicSpots = item.hotScenicSpots
              hotScenicSpots.forEach(item2 => hotScenicSpotsShow = item2.distance < hotScenicSpotsShow.distance || !hotScenicSpotsShow.distance ? item2 : hotScenicSpotsShow)
              item['hotScenicSpotsShow'] = hotScenicSpotsShow
            }
            // 优化内存
            this.deleteObj(item, ['designNameImageOss', 'rankingNumber', 'designerInfo', 'navigationInfo', 'housingInfo', 'summary', 'houseType', 'clearPrice', 'weekPrice', 'deposit', 'countryCode', 'countryName', 'areaCode', 'areaName', 'cityCode', 'cityEnName', 'provinceName', 'provinceCode', 'address', 'houseArea', 'createTime', 'facilities'])
            delete item['landlord']['introduce']
            delete item['landlord']['nickName']
            delete item['landlord']['sex']
            return true
          } else {
            return false
          }
        })
        // 储存房屋id列表
        let listIds = newlist.map(item => {
          if (item) {
            return item.id
          }
        })

        const isNoData = newlist.length < this.pageSize

        this.houseListIds = this.pageNum === 1 ? listIds : this.houseListIds.concat(listIds)
        this.setData({
          isLoading: false,
          emptyHouse: false,
          isRequestError: false,
          isUpperLoading: false,
          isHasNextPage: res.data.hasNextPage,
          houseList: this.pageNum === 1 ? newlist : this.data.houseList.concat(newlist)
        }, this.setIsToLower)
        this.pageNum = this.pageNum + 1
        // 获取收藏列表
        this.getCollct() 
      } else {
        if (!this.data.emptyHouse) {
          this.setData({
            emptyHouse: true
          })
          this.getLocalHouses()
        } else {
          this.setData({
            isLoading: false
          })
        }
      }
      wx.hideNavigationBarLoading()
      wx.hideLoading()
    })
    .catch((e) => {
      console.log(e)
      this.setData({
        isLoading: false,
        isRequestError: true
      })
      this.setIsToLower()
      wx.hideNavigationBarLoading()
      wx.hideLoading()
    })
  },
  deleteObj(item, keys = []) {
    keys.forEach(key => {
      delete item[key]
    })
  },
  setIsToLower() {
    this.isToLower = false
  },
  getLocalHouses() {
    const { cityParams } = app.globalData.searchParams;
    let params = {
      pageSize: 10,
      cityName: cityParams.cityName,
      cityCode: cityParams.cityCode,
    }
    getHouseList(params)
    .then(res => {
      let list = res.data.list
      // 对列表数据处理
      list.forEach((item, index) => {
        let tags = []
        // 将标签合并
        if (Array.isArray(item.bizTag) && item.bizTag.length > 0) {
          tags = tags.concat(item.bizTag)
        }
        if (Array.isArray(item.customTag) && item.customTag.length > 0) {
          tags = tags.concat(item.customTag)
        }
        list[index]['tags'] = tags
        // 处理stars
        list[index]['stars'] = Math.round(item.stars)
        // 检查房东头像是否存在
        if (!item.landlord) {
          list[index]['landlord'] = {}
        }
        if (!list[index]['landlord']['avatar']) {
          list[index]['landlord']['avatar'] = this.data.defaultAvatar
        }
      })
      
      this.setData({
        houseList: this.pageNum === 1 ? list : this.data.houseList.concat(list),
        isLoading: false,
        isRequestError: false,
        isUpperLoading: false,
        isHasNextPage: res.data.hasNextPage,
      })
      this.pageNum = this.pageNum + 1
      // 获取收藏列表
      this.getCollct() 
      wx.hideLoading()
    })
  },
  showInput() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput() {
    this.setData({
      inputShowed: false
    });
  },
  cleanInput() {
    const { searchParams } = app.globalData;
    const keyword = app.globalData.searchParams.getKeyword();
    if (keyword) {
      this.resetHouseParams();
      searchParams.cleanAll(['cityName']);
      this.setData({
        keyword: '',
        houseList: [],
      })
      this.resetHouseParams();
      this.init();
    }
  },
  inputTyping(e) {
    clearTimeout(this.inter)
    this.inter = setTimeout(() => {
      wx.showLoading({
        title: '加载中...'
      })
      this.setData({
        inputVal: e.detail.value,
      })
      this.resetHouseParams();
      this.getHouses();
    }, 500)
  },
  // 点击标题切换当前页时改变样式
  swichNav(e) {
    const { id, key, label, categoryType, code } = e.target.dataset
    const { searchParams } = app.globalData;
    let { navTabs } = this.data;
    navTabs[key]['selected'] = !navTabs[key]['selected']

    // 设置所有标签为false
    for (let k in navTabs) {
      if (key !== parseInt(k)) {
        navTabs[k]['selected'] = false
      }
    }
    let { allTagIds = '' } = searchParams.tagParams; 
    allTagIds = allTagIds !== '' ? allTagIds.split(',') : []
    if (allTagIds.indexOf(id) === -1) {
      navTabs.forEach(item => {
        const index = allTagIds.indexOf(item.id)
        if (index !== -1) allTagIds.splice(index, 1)
      })
      allTagIds.push(id)
    } else {
      allTagIds.splice(allTagIds.indexOf(id), 1)
    }
    allTagIds = arrayToString(allTagIds)
    searchParams.cleanParams('tagParams');
    searchParams.tagParams = {
      allTagIds,
    }
    
    // gios上报
    gioTrack('list_tag_click', {
      tag_name:label
    });

    // 路客lotel
    if (code === '0rnk07') {
      getApp().mtj.trackEvent('index_biz_locals_lotel');
    }

    // 商务精选
    if (code === 'vn709x') {
      getApp().mtj.trackEvent('housing_biz_choiceness');
    }
    // 行政会所
    if (code === 'rekzs8') {
      getApp().mtj.trackEvent('housing_biz_administration');
    }
    // 路客精品
    if (code === 'xzie95') {
      getApp().mtj.trackEvent('housing_biz_great_pieces');
    }

    // 海外民宿
    if (code === '4su26u') {
      getApp().mtj.trackEvent('index_biz_overseas'); 
    }

    if (allTagIds && allTagIds.includes('1059368807866712066')) {
      // 需要搜索所有房源,暂存起cityName，当点击海外以外的标签则重新设置cityName
      this.cityNameDummy = searchParams.cityParams.cityName;
      searchParams.cityParams = {
        cityName: null,
      }
      wx.setNavigationBarTitle({
        title: '海外'
      })
    } else if (this.cityNameDummy) {
      searchParams.cityParams = {
        cityName: this.cityNameDummy,
      }
      wx.setNavigationBarTitle({
        title: this.cityNameDummy,
      })
    }

    this.setData({
      navTabs,
      houseList: [],
    })
    this.resetHouseParams();
    this.init()
  },
  swichStyles (e) {
    const { key, label } = e.target.dataset
    let { styleTags } = this.data;
    styleTags[key]['selected'] = !styleTags[key]['selected']
    // gios上报
    gioTrack('list_tag_click', {
      tag_name: label
    });
    this.setData({
      styleTags
    })
  },
  //日历选择
  bindDateSelectTap() {
    getApp().mtj.trackEvent('housing_date');
    wx.navigateTo({
      url: '/pages/datepicker/date-select?from=houselist'
    })
  },
  //排序搜索
  openSortSearch(e) {
    getApp().mtj.trackEvent('housing_sort');
    wx.navigateTo({
      url: '/pages/housing/sort-search/index'
    })
  },
  //区域搜索
  openPoisSearch(e) {
    let { currentTarget } = e
    let { dataset } = currentTarget
    let { position } = dataset
    if (position === 'ad') {
      getApp().mtj.trackEvent('housing_ads_position');
    } else {
      getApp().mtj.trackEvent('housing_position');
    }

    gioTrack('list_filter', {
      tag_name: position === 'ad' ? '位置查找' : '位置按钮'
    });
    
    wx.navigateTo({
      url: '/pages/housing/poi-search/index'
    })
  },
  //打开筛选
  openScreenSearch(e) {
    let { currentTarget } = e
    let { dataset } = currentTarget
    let { position } = dataset
    if (position === 'ad') {
      getApp().mtj.trackEvent('housing_ads_filter');
    } else {
      getApp().mtj.trackEvent('housing_filter');
    }
    gioTrack('list_filter', {
      tag_name: position === 'ad' ? '价格人数' : '筛选按钮'
    });
    
    wx.navigateTo({
      url: '/pages/housing/screen-search/index'
    })
  },
  bindSearchKeyword(e) {
    const { currentTarget } = e
    const { dataset } = currentTarget
    const { position } = dataset
    const { searchParams } = app.globalData;
    let url = '';
    if (position === 'ad') {
      getApp().mtj.trackEvent('housing_ads_search');
    } else {
      getApp().mtj.trackEvent('housing_search_keyword');
    }
    gioTrack('list_filter', {
      tag_name: position === 'ad' ? '热门商圈' : '关键字查找'
    });
    if (searchParams.isForeignCity) {
      url = '/pages/searcharea/searcharea?activeTabNumber=1';
    } else {
      url = '/pages/searchkeyword/searchkeyword';
    }
    wx.navigateTo({
      url
    })
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
        this.getHouses()
      }
    }
  },
  bindscrolltoupper(e) {
    this.setData({
      isUpperLoading: true,
    })
    this.resetHouseParams();
    this.getHouses()
  },
  onSearch() {
    this.openScreenSearch()
    this.setData({
      houseList: []
    })
    this.resetHouseParams();
    this.getHouses()
  },
  bindlogin() {
    // 判断是否登录，否则唤起登录
    if (!isHasLogin()) {
      this.isShowAuth = true
      this.selectComponent("#auth-drawer-box").showAuthBox()
    } 
  },
  bindCollection(e) {
    const { houseSourceId, success } = e.detail
    const index = this.collectList.indexOf(houseSourceId)
    if (success) {
      if (index === -1) {
        this.collectList.push(houseSourceId)
      }
    } else {
      if (index >= 0) {
        this.collectList.splice(index, 1)
      }
    }
  },
  updateHouseListFavStatus(houseSourceId, success) {
    let houseList = this.data.houseList
    houseList.forEach((item, index) => {
      if (item.id === houseSourceId) {
        houseList[index]['isFav'] = success ? true : false
      }
    })
    this.setData({
      houseList
    })
  },
  // 业务标签
  async getCustomerTag() {
    let params = {
      //categoryType: 1000,
      pageNum: 1,
      pageSize: 100,
      status: 1,
      isSearch: 1,
    }
    if (!this.allTagList) {
      const { data } = await getCustomerTag(params);
      const { list } = data;
      this.allTagList = list;
    }
    const { searchParams } = app.globalData;
    const { allTagIds = '' } = searchParams.tagParams;
    // 显示业务标签和优惠标签
    const showCategoryType = ['1000', '1002']
    
    // will delete
    const mainActivityArray = ['国庆特惠']; 
    // will delete
    let newList = []
    // 显示风格特色
    let styleTags = []
    // 是否需要高亮风格特色按钮
    let isChooseTags = false
    this.allTagList.forEach(item => {
      if (showCategoryType.includes(item.categoryType)) {
        const isHasSelected = allTagIds.includes(item.id);
        const isMain = mainActivityArray.includes(item.name);
        newList.push({
          isMain, // will delete
          id: item.id,
          code: item.code,
          label: item.name,
          show: item.show,
          image:item.image,
          categoryType: item.categoryType,
          selected: isHasSelected,
          describe: item.describe,
        })
      } else if (item.categoryType === '1004'){
        const isHasSelected = allTagIds.includes(item.id);
        isChooseTags = isHasSelected ? true : isChooseTags
        styleTags.push({
          id: item.id,
          code: item.code,
          label: item.name,
          categoryType: item.categoryType,
          selected: isHasSelected,
        })
      }
    })
    this.setData({
      navTabs: newList,
      styleTags,
      isChooseTags
    })
    this.checkNeedShowTagImg()
  },
  showMoreTagFn() {
    const { showMoreTag, styleTags, temporaryTags } = this.data
    this.setData({
      showMoreTag: !showMoreTag,
      showTagImg: false
    })
    if(showMoreTag) {
      this.checkNeedShowTagImg()
      // 主动关闭,将存储返回到上一次搜索状态
      this.setData({
        styleTags: JSON.parse(JSON.stringify(temporaryTags))
      })
    }else{
      // gios上报
      gioTrack('list_tag_click', {
        tag_name: '风格特色展开按钮'
      });
      // 存储数据，如主动关闭则重置数据，返回到上一次搜索数据
      this.setData({
        temporaryTags: JSON.parse(JSON.stringify(styleTags))
      })
    }
  },
  // 监听房源列表滚动
  onPageScroll(e) {
    let { scrollTop } = e
    let windowHeight = this.windowHeight
    let deltaY = scrollTop - this.scrollTop
    this.throttleScroll(deltaY, scrollTop, windowHeight)
    this.checkHeightShow(scrollTop)
  },
  // 检查滑动的高度是否要显示标签图片
  checkHeightShow(scrollTop) {
    const tagAnimation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
      transformOrigin: '100% 100% 0'
    })
    if(scrollTop <= 0){
      tagAnimation.opacity(1).step()
      this.setData({ 
        tagAnimationData: tagAnimation.export()
      })
      this.checkNeedShowTagImg()
    }else if(scrollTop !== 0 && this.data.showTagImg){
      tagAnimation.opacity(0).step()
      this.setData({ 
        tagAnimationData: tagAnimation.export(),
        showTagImg:false
      })
    }
  },
  throttleScroll: throttle(function(deltaY, scrollTop, windowHeight) {
    this.bindPageScroll(deltaY, scrollTop, windowHeight)
  }, 200, 1000),
  bindPageScroll(deltaY, scrollTop, windowHeight) {
    this.scrollTop = scrollTop
    if (Math.abs(deltaY) > 10) {
      let headerAnimation = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease',
        transformOrigin: '100% 100% 0'
      })
      
      if (deltaY > 0 && scrollTop > windowHeight) {
        headerAnimation.translateY(-160).opacity(0).step()
      } else {
        headerAnimation.translateY(0).opacity(1).step()
      }
  
      this.setData({
        headerAnimationData: headerAnimation.export()
      })
    }
  },
  // 清空选中多选标签
  cleanTags() {
    let { styleTags } = this.data;
    // 设置所有标签为false
    for (let k in styleTags) {
      styleTags[k]['selected'] = false
    }
    this.setData({
      styleTags,
    })
    gioTrack('list_tag_click', {
      tag_name: '风格特色-清空'
    });
  },
  // 搜索房源
  goSearch() {
    const { searchParams } = app.globalData;
    let { navTabs, styleTags } = this.data;
    let { allTagIds = '' } = searchParams.tagParams;
    let newAllTagIds = []
    const radioTabs = navTabs.filter(item => allTagIds.indexOf(item.id) !== -1)
    const chooseTags = styleTags.filter(item => item.selected)
    if (chooseTags.length > 0){
      for (let i in chooseTags) { newAllTagIds.push(chooseTags[i].id) }
    }
    if (radioTabs.length > 0) {
      for (let k in radioTabs) { newAllTagIds.push(radioTabs[k].id) }
    }
    
    allTagIds = arrayToString(newAllTagIds)
    searchParams.cleanParams('tagParams');
    searchParams.tagParams = { allTagIds }
    // gios上报
    gioTrack('list_tag_click', {
      tag_name: '风格特色-房源搜索'
    });

    
    this.setData({
      showMoreTag: false,
      isChooseTags: chooseTags.length > 0 ? true : false
    })
    this.checkNeedShowTagImg()
    this.resetHouseParams();
    this.init()
  },
  // 检查是否需要显示标签图片
  checkNeedShowTagImg() {
    let { navTabs, showMoreTag } = this.data;
    const { searchParams } = app.globalData;
    let { allTagIds = '' } = searchParams.tagParams;
    const radioTabs = navTabs.filter(item => allTagIds.includes(item.id) && item.show && item.image)
    const needShow = radioTabs.length > 0 && !showMoreTag ? true : false
    this.setData({
      showTagImg: needShow,
      tagBgImg: needShow ? radioTabs[0].image : null,
      tagBgLabel: needShow ? radioTabs[0].label : null,
      tagBgDescribe: needShow ? radioTabs[0].describe : null,
    })
  },
  // 列表广告点击(暂时写死)
  openListAd() {
    gioTrack('list_ad_pp');
    wx.navigateTo({
      url: '/pages/h5/index?url=https%3A%2F%2Fi.localhome.cn%2Fv%2F1909161503682%2F%23%2F%3Fchannel%3Dgqcx&title=国庆抢8折特惠，长假住精品民宿！ '
    })
  }
})