const app = getApp()
const { getTagList } = require('../../../server/housing');
const { arrayToString } = require('../../../utils/util');
// 变量
const peopleData = [
  {
    id: [1, 2],
    label:'1-2人',
  }, {
    id: [3, 4],
    label: '3-4人',
  }, {
    id: [5, 6],
    label: '5-6人',
  }, {
    id: [7, 8],
    label: '7-8人',
  }, {
    id: [9],
    label: '8人以上',
  }
]
const roomData = [
  {
    id: 1,
    label: '1居室',
  }, {
    id: 2,
    label: '2居室',
  }, {
    id: 3,
    label: '3居室',
  }, {
    id: 4,
    label: '4居室或以上',
  }
]
const bedData = [
  {
    id: 1,
    label: '1张',
  }, {
    id: 2,
    label: '2张',
  }, {
    id: 3,
    label: '3张',
  }, {
    id: 4,
    label: '4张或以上',
  }
]
const matchData = [
  {
    id: 6703,
    label: '电梯',
  }, {
    id: 6215,
    label: '暖气',
  }, {
    id: 6503,
    label: '投影仪',
  }, {
    id: 6216,
    label: '电熨斗/挂熨机',
  }, {
    id: [6309,6310,6311],
    label: '浴缸',
  }, {
    id: 6806,
    label: '停车位',
  }, {
    id: 6604,
    label: '智能门锁',
  }, {
    id: 6212,
    label: '烘干机/干衣机',
  }
]
const correspond = {
  'peopleData':'numberPeople',
  'roomData': 'numberBedroom',
  'bedData': 'numberBed',
  'allTagIds': 'allTagIds',
  'matchData': 'facilities'
}
const rangeData = {
  min:0,
  max:1000,
  value:[0,200,400,600,800,1000]
}
const rangeDataForeign = {
  min:0,
  max:2000,
  value:[0,400,800,1200,1600,2000]
}
Page({
  data: {
    lowValue: 0,
    heightValue: 1000,
    isOnlySeeSpecial: false,
    numberPeople: 0,
    numberBedroom: 0,
    numberBed: 0,
    allTagIds: 0, 
    facilities: 0,
    tags: [],
    // 改变搜索条件的次数
    changeTimes: 0,
    // 部分前端固定数据
    peopleData,
    roomData,
    bedData,
    matchData,
    designData:[],
    preferData:[],
    typeData:[],
    isForeignCity: false,
    rangeSliderData:{}
  },
  onLoad(options) {
    this.from = options.from;
    this.isFromMap = this.from === 'map';
    this.getTagList()
  },
  onShow() {
    this.selectComponent("#im-message").imLogin()
    const { searchParams } = app.globalData;
    const { roomParams = {}, isForeignCity } = searchParams;
    const { allTagIds = '' } = searchParams.tagParams;
    const {
      // 相等的床位数
      bedNumbers = 0,
      // 相等的房间数
      roomNumbers = 0,
      // 相等的可住人
      tenantNumbers = 0,
      // 最低价
      priceGreaterThanEqual = 0,
      // 最高价
      priceLessThanEqual = isForeignCity ? 2000 : 1000,
      // 设施
      facilities = '',
    } = roomParams;
    const rangeSliderData = isForeignCity ? rangeDataForeign : rangeData
    this.setData({
      rangeSliderData,
      isForeignCity,
      facilities,
      allTagIds, 
      heightValue: priceLessThanEqual,
      lowValue: priceGreaterThanEqual,
      numberBed: bedNumbers,
      numberBedroom: roomNumbers,
      numberPeople: tenantNumbers,
    })
  },
  reset() {
    const { searchParams } = app.globalData;
    searchParams.cleanParams('roomParams');
    // 如果当前是海外民宿则不清空tag
    if (!searchParams.isForeignCity) {
      searchParams.cleanParams('tagParams');
    }
    wx.redirectTo({
      url: '/pages/housing/screen-search/index?from=' + this.from
    })
  },
  lowValueChange(e) {
    this.setData({
      lowValue: e.detail.lowValue
    })
  },
  heightValueChange(e) {
    this.setData({
      heightValue: e.detail.heightValue
    })
  },
  onSearch() {
    this.countChoose()
    const { searchParams } = app.globalData;
    let { lowValue, heightValue, allTagIds, facilities, numberPeople, numberBedroom, numberBed, isForeignCity } = this.data
    let pages = getCurrentPages();
    let housePage = null;

    pages.some(item => {
      if (item.route === 'pages/housing/list/index') {
        housePage = item;
      }
    })

    if (housePage) {
      housePage.setData({
        isHasClickScreenSearch: true
      })
    }

    let roomParams = {
      priceGreaterThanEqual: lowValue === 0 ? undefined : lowValue,
      facilities: arrayToString(facilities),
      bedNumbers: arrayToString(numberBed),
      roomNumbers: arrayToString(numberBedroom),
      tenantNumbers: arrayToString(numberPeople),
      // 大于或等于
      bedNumberGreaterThanEqual: numberBed && numberBed.indexOf(4) !== -1 ? '4' : undefined,
      roomNumberGreaterThanEqual: numberBedroom && numberBedroom.indexOf(4) !== -1 ? '4' : undefined,
      tenantNumberGreaterThanEqual: numberPeople && numberPeople.indexOf(9) !== -1 ? '9' : undefined,
    }
    
    // 国内：等于1000则是不限 ；国外：等于2000则是不限 , 后端默认99999
    if(isForeignCity) roomParams.priceLessThanEqual = heightValue === 2000 ? undefined : heightValue
    else roomParams.priceLessThanEqual = heightValue === 1000 ? undefined : heightValue

    let tagParams = {
      allTagIds: arrayToString(allTagIds), 
    }
    
    searchParams.roomParams = roomParams;
    // 如果当前是海外民宿则不修改tag
    if (!searchParams.isForeignCity) {
      searchParams.tagParams = tagParams;
    }
    
    wx.navigateBack()
  },
  // 选择tag
  chooseTag(e){
    const index = e.currentTarget.dataset.index
    const type = e.currentTarget.dataset.type
    const data = this.data[type]
    if (data[index]._selected) {
      data[index]._selected = false
    } else {
      data[index]._selected = true
    }
    this.setData({ [`${type}`]: data })
  },
  // 获取tag
  getTagList(){
    getTagList().then(res => {
      const list = res.data
      let designData = [], preferData = [], typeData = []
      list.map(item => {
        if (item.isSearch !== 1) return
        if (item.categoryId === '1123125017608556546') designData.push(item)
        else if (item.categoryId === '1059367793914691585') typeData.push(item)
        else if (item.categoryId === '1059367657151021023' || item.categoryId === '1059367657151021057') preferData.push(item)
      })
      this.setData({ typeData, designData, preferData})
      this.syncData()
    })
  },
  // 计算已选择类型
  countChoose(){
    let { peopleData, roomData, bedData, designData, preferData, matchData, typeData} = this.data
    const dataArr = [{ data: peopleData, name: 'peopleData' }, 
      { data: roomData, name: 'roomData' }, 
      { data: bedData, name: 'bedData' },
      { data: matchData, name: 'matchData' },
      { data: [...preferData, ...typeData, ...designData], name: 'allTagIds' }]
    dataArr.forEach(item => this.dataChange(item.data, item.name))
  },
  // 数据转化
  dataChange(chooseData, chooseName){
    if (chooseData.length === 0)return
    const dataName = correspond[chooseName]
    let newData = []
    chooseData.filter(item => {
      if (item._selected) item.id instanceof Array ? newData = [...newData, ...item.id] : newData.push(item.id)
    })
    if (newData.length !== 0) this.setData({ [`${dataName}`]: newData }) 
    else this.setData({ [`${dataName}`]: 0})
  },
  // 重置条件同步数据
  syncData() {
    let { numberPeople, numberBedroom, numberBed, allTagIds, facilities, designData, preferData, matchData, typeData } = this.data
    const dataArr = [
      { data: peopleData, data2: numberPeople, name: 'peopleData' }, 
      { data: roomData, data2: numberBedroom, name: 'roomData' }, 
      { data: bedData, data2: numberBed, name: 'bedData' }, 
      { data: designData, data2: allTagIds, name: 'designData' }, 
      { data: preferData, data2: allTagIds, name: 'preferData' }, 
      { data: typeData, data2: allTagIds, name: 'typeData' },
      { data: matchData, data2: facilities, name: 'matchData' },
    ]
    dataArr.map(item => this.syncDataCount(item.data, item.name, item.data2))
  },
  syncDataCount(chooseData, chooseName, data2){
    chooseData.filter(item => {
      if (data2 === 0) {
        item._selected = false
      } else {
        let id = item.id
        if (chooseName === 'peopleData') id = id[0]
        if (typeof data2 === 'string' && data2.indexOf(id) !== -1) {
          item._selected = true
        }
      }
    })
    this.setData({ [`${chooseName}`]: chooseData })
  }
})