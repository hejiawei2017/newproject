const { gioTrack } = require('../../utils/util')
const { getLocationInfo, convertLocation } = require('../../server/map')
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      value: [],
      observer: function () {
        this.init()
      }
    },
    heatCity: {
      type: Object,
      value: {}
    },
    foreignData: {
      type: Array,
      value: [],
      observer: function () {
        this.initForeign()
      }
    },
    myCity: {
      type: String,
      value: "",
    },
    // 用于外部组件搜索使用
    search:{
      type:String,
      value:"",
      observer: function (newVal) {
        this.value = newVal;
        this.searchMt();
      }
    },
    initSelectTab: {
      type: Number,
      value: 0,
    },
  },

  data: {
    isFullScreen: app.globalData.isFullScreen,
    // 国内列表
    list: [],
    // 海外列表
    foreignList: [],
    // 国内列表字母
    rightArr: [],
    // 海外右侧字母展示
    rightForeignArr: [],
    // 跳转到那个字母
    jumpNum: '',
    // //跳转海外到那个字母
    jumpForeignNum: '',
    currentCity: '',
    currentItem: null,
    currentForeignItem: null,
    localName: '',
    address: '',
    location: '',
    indexWrap: {},
    tabs: ['国内', '海外'],
  },
  ready() {
    // this.init()
    if (!this.data.currentCity) {
      this.getCity()
    }
  },
  methods: {
    init() {
      let { data } = this.data;
      this.resetRight(data, 'list', 'rightArr');
      this.setHeatCity();
      this.setRightWrapData();
    },
    initForeign() {
      let { foreignData } = this.data;
      this.resetRight(foreignData, 'foreignList', 'rightForeignArr');
      this.setForeignCity();
      this.setFoeignRightWrapData();
    },
    tabClick(e) {
      const { activeIndex } = e.detail;
      switch(activeIndex) {
        case 0:
          this.setRightWrapData();
          break;
        case 1:
          this.setFoeignRightWrapData();
          break;
      }
      gioTrack('searcharea_tab', { tag_name: activeIndex === 0 ? '国内' : '海外'});
    },
    setRightWrapData() {
      const that = this;
      setTimeout(() => {
        // 获取右侧索引
        const query = wx.createSelectorQuery().in(that)
        query.select('.list-right-wrapper-china').boundingClientRect()
        query.select('.list-right-wrapper-china .right-item').fields({
          size: true
        })
        query.exec((res) => {
          this.setData({
            indexWrap: res[0],
            indexItem: res[1]
          })
        })
      }, 0)
    },
    setFoeignRightWrapData() {
      const that = this;
      setTimeout(() => {
        // 获取右侧索引
        const query = wx.createSelectorQuery().in(that)
        query.select('.list-right-wrapper-foreign').boundingClientRect()
        query.select('.list-right-wrapper-foreign .right-item').fields({
          size: true
        })
        query.exec((res) => {
          this.setData({
            indexForeignWrap: res[0],
            indexForeignItem: res[1]
          })
        })
      }, 0)
    },
    setForeignCity() {
      let { foreignData, foreignList, rightForeignArr } = this.data;
      let heatForeignCity = [];
      let firstRightArr = '热'
      let firstData = {
        title: '热门城市',
        type: 'hot',
        item: []
      }
      foreignData.forEach(item => {
        if (item.heat === 1) {
          firstData.item.push({
            name: item.name,
            code: item.code,
            id: item.id
          })
        }
      })
      foreignList.unshift(firstData)
      rightForeignArr.unshift(firstRightArr)
      this.setData({
        foreignList,
        rightForeignArr,
      })
    },
    setHeatCity() {
      let { list = [], rightArr = [], heatCity = [] } = this.data
      if (heatCity) {
        let firstRightArr = '热'
        let firstData = {
          title: '热门城市',
          type: 'hot',
          item: []
        }
        heatCity.forEach((item, index) => {
          if (index < 8) {
            firstData.item.push({
              name: item.city.name,
              code: item.city.code,
              id: item.city.code
            })
          }
        })

        list.unshift(firstData);
        rightArr.unshift(firstRightArr);

        this.setData({
          list,
          rightArr,
        })
      }
    },
    // 数据重新渲染
    resetRight(data, listField, rightField) {
      let rightArr = []
      let resetData = []
    
      for (let i in data) {
        let word = data[i].firstWordFirstLetterPinYin.toUpperCase()
        // 处理数组
        if (word) {
          if (rightArr.indexOf(word) === -1) {
            rightArr.push(word);
            resetData.push({
              title: word,
              item: [
                {
                  name: data[i].name,
                  code: data[i].code,
                  id: data[i].id
                }
              ]
            })
          } else {
            let index = rightArr.indexOf(word)
            resetData[index]['item'].push({
              name: data[i].name,
              code: data[i].code,
              id: data[i].id
            })
          }
        }
      }

      resetData.sort((a, b) => {
        return a.title > b.title ? 1 : -1
      })

      rightArr.sort((a, b) => {
        return a > b ? 1 : -1
      })
      
      this.setData({
        [listField]: resetData,
        [rightField]: rightArr
      })
    },
    getCity() {
      wx.getLocation({
        type: 'gcj02',
        success: res => {
          var longitude = res.longitude
          var latitude = res.latitude
          this.loadCity(longitude, latitude)
        }
      })
    },
    // 右侧字母点击事件
    jumpMt(e) {
      let { id: jumpNum, area } = e.currentTarget.dataset;
      const isClickForeigh = area === 'foreign';
      this.setData({
        [isClickForeigh ? 'jumpForeignNum' : 'jumpNum']: `index${jumpNum}`,
        [isClickForeigh ? 'currentForeignItem' : 'currentItem']: jumpNum,
      })
    },
    // 列表点击事件
    detailMt(e) {
      let detail = e.currentTarget.dataset.detail;
      let myEventOption = {
        bubbles: false,//事件是否冒泡
        composed: false,//事件是否可以穿越组件边界
        capturePhase: false //事件是否拥有捕获阶段
      } // 触发事件的选项
      this.triggerEvent('detail', detail, myEventOption)
    },
    // 点击当前位置
    goToCurrentLocal() {
      let myEventOption = {
        bubbles: false,//事件是否冒泡
        composed: false,//事件是否可以穿越组件边界
        capturePhase: false //事件是否拥有捕获阶段
      } // 触发事件的选项
      this.triggerEvent('goToCurrentLocal', {
        localName: this.data.localName,
        address: this.data.address,
        location: this.data.location,
        currentCity: this.data.currentCity
      }, myEventOption)
    },
    locationMt(e) {
      let detail = e.currentTarget.dataset.detail;
      
      let myEventOption = {
        bubbles: false,//事件是否冒泡
        composed: false,//事件是否可以穿越组件边界
        capturePhase: false //事件是否拥有捕获阶段
      } // 触发事件的选项
      this.triggerEvent('detail', {name: detail}, myEventOption)
    },
    // 获取搜索输入内容
    input(e) {
      this.value = e.detail.value;
      this._search();
    },
    bindconfirm (e) {
      this._search();
    },
    // 基础搜索功能
    searchMt() {
      this._search();
    },
    _search(){
      let data = this.data.data;
      let newData = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].name.indexOf(this.value) > -1) {
          newData.push(data[i]);
        }
      }
      this.resetRight(newData);
    },
    loadCity(longitude, latitude) {
      convertLocation(`${longitude},${latitude}`)
        .then(res => {
          getLocationInfo(res.data.locations)
            .then(res => {
              let { addressComponent, formatted_address } = res.data.regeocode
              let { province, city, streetNumber } = addressComponent

              city = typeof city === 'string' ? city : ''
              province = typeof province === 'string' ? province : ''
              city = city ? city : province

              this.setData({
                currentCity: city || '',
                localName: streetNumber.street || '',
                address: formatted_address || '',
                location: streetNumber.location || ''
              });
            })
            .catch(this.cannotGetCity)
        })
        .catch(this.cannotGetCity)
    },
    bindSearchKeyword() {
      wx.redirectTo({
        url: '/pages/searchkeyword/searchkeyword'
      })
    },
    touchMoveIndex_china(e) {
      const { indexWrap, indexItem, rightArr } = this.data;
      let { top, height: wrapHeight } = indexWrap;
      if (!top || !wrapHeight) {
        return
      }
      let { height: itemHeight } = indexItem;
      let offsetTop = e.touches[0].pageY - top
      let index = null
      if (offsetTop > 0) {
        index = Math.round(offsetTop / itemHeight) - 1
        index = index < 0 ? 0 : index
      } else {
        index = 0
      }
      if (offsetTop > wrapHeight || index >= rightArr.length) {
        index = rightArr.length - 1
      }
      if (this.data.currentItem !== index) {
        wx.showToast({
          icon: 'none',
          title: rightArr[index]
        })
        this.setData({
          jumpNum: `index${index}`,
          currentItem: index
        })
      }
    },
    touchMoveIndex_foreign(e) {
      const { indexForeignWrap, indexForeignItem, rightForeignArr } = this.data;
      let { top, height: wrapHeight } = indexForeignWrap;
      if (!top || !wrapHeight) {
        return
      }
      let { height: itemHeight } = indexForeignItem;
      let offsetTop = e.touches[0].pageY - top
      let index = null
      if (offsetTop > 0) {
        index = Math.round(offsetTop / itemHeight) - 1
        index = index < 0 ? 0 : index
      } else {
        index = 0
      }
      if (offsetTop > wrapHeight || index >= rightForeignArr.length) {
        index = rightForeignArr.length - 1
      }
      if (this.data.currentForeignItem !== index) {
        wx.showToast({
          icon: 'none',
          title: rightForeignArr[index]
        })
        this.setData({
          jumpForeignNum: `index${index}`,
          currentForeignItem: index
        })
      }
    },
    touchLeave() {
      wx.hideToast()
    },
  }
})
