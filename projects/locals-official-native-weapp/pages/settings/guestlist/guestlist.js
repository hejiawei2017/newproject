const app = getApp();
const { getGuests, delGuests } = require('../../../server/mine')
const { showLoading, catchLoading } = require('../../../utils/util')
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({
  cacheSelectedArray: [],
  data: {
    isFullScreen: app.globalData.isFullScreen,
    list: null,
    isOrder: false,
    maxCount: null
  },
  onLoad(options) {
    const isOrder = options.isOrder === '1'
    if (isOrder) {
      wx.setNavigationBarTitle({ title: '选择入住人' })
    }
    this.setData({
      isOrder,
      maxCount: options.maxCount || null
    })
  },
  onShow() {
    // 页面显示
    this.selectComponent("#im-message").imLogin()
    const { list } = this.data
    if (!list) {
      this.init()
    }
  },
  async init(){
   try {
      // 获取已选择的入住人
      showLoading()
      let params = {
        pageNum: 1,
        pageSize: 100
      }
      const { data } = await getGuests(params)
      const { list } = data
      wx.hideLoading()
      // 处理选择入住人的记录
      let guestObj = {}
      app.globalData.selectGuest.forEach(item => {
        guestObj[item.guestId] = true
        this.setCacheGuestArray(item.guestId, true)
      })
      const newList = list.map(v => {
        v.guestId
        // this.cacheSelectedArray 避免进入添加入住人或修改入住人信息时，返回后把选择的结果清空了
        return Object.assign({}, v, {
          checked: !!guestObj[v.guestId] || this.cacheSelectedArray.includes(v.guestId)
        })
      })
      
      this.setData({
        list: newList
      })
   } catch(e) {
      catchLoading(e)
   }
  },
  // 添加或修改
  navigateToAdd(e) {
    const { isOrder, maxCount } = this.data
    let id = null
    if (e && e.currentTarget && e.currentTarget.dataset) {
      id = e.currentTarget.dataset.id
    }
    let url = '../guestadd/guestadd'
    const getSign = () => {
      let markIndex = url.indexOf('?')
      return markIndex === -1 ? '?' : '&'
    }
    let method = 'navigateTo'
    // 如果是订单进来的话，进入添加是重定向，添加成功后也是重定向回到列表
    if (isOrder) {
      url += `${getSign()}from=order&maxCount=${maxCount}`
    }
    if (id) {
      url += `${getSign()}id=${id}`
    }
    wx[method]({
      url
    })
  },
  checkboxChange(e) {
    const { guestId } = e.currentTarget.dataset
    const { list } = this.data
    const newList = list.map(item => {
      if (item.guestId === guestId) {
        item.checked = !item.checked
        this.setCacheGuestArray(guestId, item.checked)
      }
      return item
    })
    this.setData({
      list: newList
    })
  },
  setCacheGuestArray(guestId, isAdd = false) {
    const index = this.cacheSelectedArray.indexOf(guestId)
    if (index === -1 && isAdd) {
      // 添加
      this.cacheSelectedArray.push(guestId)
    } 
    if (!isAdd) {
      // 删除
      this.cacheSelectedArray.splice(index, 1)
    }
  },
  addmay() {
    this.navigateToAdd()
  },
  confirmGuests: function () {
    let selectGuest = this.data.list.map( (v) => {
      if(v.checked){
        return v;
      }
    }).filter(o => o)
    let { maxCount } = this.data
    if (maxCount && selectGuest.length > maxCount) {
      wx.showModal({
        icon: 'none',
        content: `当前民宿最大可住人数 ${maxCount} 人`,
        showCancel: false,
        confirmText: '知道了'
      })
    } else {
      app.globalData.selectGuest = selectGuest
      wx.navigateBack()
    }
  }
})