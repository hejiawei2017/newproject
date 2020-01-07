const { getPOIs } = require('../../../server/housing')
const { getCityList } = require('../../../server/city');
const { showLoading, catchLoading } = require('../../../utils/util')
const { cityCodeList } = require('../../../utils/dictionary')
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')
const app = getApp()

Page({
  data: {
    // 左侧第一列
    firstColumn: [],
    // 右侧第一列
    secondColumn: [],
    // 右侧第二列
    thirdColumn: [],
    // 第一列点击的index
    firstColumnId: null,
    // 第二列点击的index
    secondColumnId: null,
    // 当前选择项id
    currnetId: '',
    unlimitedObj: {
      id: 'unlimited',
      name: '不限'
    }
  },
  onLoad(options) {
    this.selectComponent("#im-message").imLogin()
    this.from = options.from
    this.isFromMap = this.from === 'map'
  },
  onReady() {
    showLoading()
    this.getPOIs()
  },
  selected(e) {
    const { searchParams } = app.globalData;
    const { item } = e.currentTarget.dataset
    const { code, name, latitude, latitude2, longitude, longitude2 } = item
    let data = {}
    // 存在code代表是city获取的是自己的接口
    if (code) {
      searchParams.cleanParams('keywordParams');
      searchParams.cleanParams('locationParams');
      searchParams.cityParams = {
        areaCode: code,
      }
      searchParams.locationParams = {
        poiName: name
      }
    } else {
      searchParams.cleanParams('keywordParams');
      searchParams.cityParams = {
        areaCode: undefined,
      };
      searchParams.locationParams = {
        poiName: name,
        latitude,
        longitude,
        secondLatitude: latitude2,
        secondLongitude: longitude2
      }
    }
    wx.navigateBack()
  },
  cleanSelect() {
    const { searchParams } = app.globalData;
    searchParams.cleanParams('locationParams');
    searchParams.cleanParams('cityParams');
    searchParams.cleanParams('sortParams');
    wx.navigateBack()
  },
  async getPOIs() {
    try {
      const { cityName } = app.globalData.searchParams.cityParams;
      const cityParams = {
        parentCode: cityCodeList[cityName],
        areaLevel: 4,
        pageSize: 999,
      }
      const [ cityResponse, poisResponse ] = await Promise.all([getCityList(cityParams), getPOIs(encodeURIComponent(cityName))]) 
      const isHasCityList = cityResponse && cityResponse.data && Array.isArray(cityResponse.data.list) && cityResponse.data.list.length > 0
      const { data: poisList } = poisResponse
      const { data: cityData } = cityResponse
      if (!poisList) {
        catchLoading('此城市无商圈数据~', 800, wx.navigateBack)
        
        return 
      }
      let saveList = {}
      // 判断poi数组中是否存在行政区内容
      let isHasDistrict = false
      const newList = poisList.filter(item => {
        // 如果当前城市有“区"列表，且此poi是行政区，则替换poi数据中的nodePois数据
        const isDistrict = item && item.name === "行政区"
        // 只触发一次
        if (!isHasDistrict) {
          isHasDistrict = isDistrict
        }
        if (isHasCityList && isDistrict) {
          item.nodePois = cityData.list
        } else if (isDistrict) {
          // poi数据中有行政区但没有cityList则过滤掉
          return false;
        }
        return true;
      })
      
      // 有cityList数据但没有"行政区"，则生成一条行政区的数据
      if (!isHasDistrict && isHasCityList) {
        newList.unshift({
          id: 'xingzhengqu',
          name: '行政区',
          nodePois: cityData.list
        })
      }
      
      for (let i = 0; i < newList.length; i++) {
        const id = newList[i]['id']
        saveList[id] = newList[i]
      }
      let { secondColumn, thirdColumn, secondColumnId } = this.setAfterColumn(newList[0])

      this.setData({
        firstColumnId: newList[0]['id'],
        secondColumnId,
        firstColumn: saveList,
        secondColumn,
        thirdColumn
      })
      wx.hideLoading()
    } catch(e) {
      catchLoading(e)
    }
  },
  selectFristColumn(e) {
    let { id } = e.currentTarget.dataset.item
    let { firstColumn } = this.data
    let pois = firstColumn[id]
    let { secondColumn, thirdColumn, secondColumnId } = this.setAfterColumn(pois)
    this.setData({
      firstColumnId: id,
      secondColumnId,
      secondColumn,
      thirdColumn
    })
  },
  selectSecondColumn(e) {
    let { item } = e.currentTarget.dataset
    let { id } = item
    let { secondColumn } = this.data
    let thirdColumn = null
    let index = null
    
    // 用户点击了不限
    if (id === 'unlimited') {
      this.cleanSelect()
      return false
    } else {
      for (let key in secondColumn) {
        if ( id === secondColumn[key]['id'] ) {
          index = key
          thirdColumn = secondColumn[key]['nodePois']
          if (thirdColumn && thirdColumn[0]['id'] !== 'unlimited') {
            thirdColumn.unshift(this.data.unlimitedObj)
          }
        }
      }
    }
    // 如果没有第三列则说明第二列是结果
    if (!thirdColumn) {
      this.selected(e)
    } else {
      this.setData({
        secondColumnId: secondColumn[index]['id'],
        thirdColumn: thirdColumn ? thirdColumn : []
      })
    }
  },
  selectThirdColumn(e) {
    let { id } = e.currentTarget.dataset.item
    if (id === 'unlimited') {
      this.cleanSelect()
      return false
    } else {
      this.selected(e)
    }
  },
  setAfterColumn(firstColumn) {
    let secondColumn = []
    let thirdColumn = []
    let secondColumnId = null

    // 第一栏的第一项是否有子集
    if (
      firstColumn.hasNode === 1 
      || (
        Array.isArray(firstColumn.nodePois) 
        && firstColumn.nodePois.length > 0
      )
    ) {
      secondColumn = firstColumn.nodePois
      if (secondColumn[0]['id'] !== 'unlimited') {
        secondColumn.unshift(this.data.unlimitedObj)
      }
      // 第二栏的第二项是否有子集，因第一项添加了不限
      if (
        secondColumn[1]['nodePois'] 
        || (
          Array.isArray(secondColumn[1].nodePois) 
          && secondColumn[1].nodePois.length > 0
        )
      ) {
        thirdColumn = secondColumn[1].nodePois
        secondColumnId = secondColumn[1]['id']
        if (thirdColumn[0]['id'] !== 'unlimited') {
          thirdColumn.unshift(this.data.unlimitedObj)
        }
      }
    }
    return {
      secondColumnId,
      secondColumn,
      thirdColumn
    }
  }
});
