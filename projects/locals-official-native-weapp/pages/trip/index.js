const { showLoading, catchLoading, gioTrack, isHasLogin } = require('../../utils/util')
const { getOrders,delTrip } = require('../../server/order')
const { getHouseDetail } = require('../../server/housing')
const {createBargain, getBargainStatus, getBargainStatusList} = require('../../server/hd')
const {getUserDetail} = require('../../server/mine')
const regeneratorRuntime = require('../../libs/regenerator-runtime')
const app = getApp()

// 进行中
const HAVA_IN_HEAD = "1"
// 已完成
const COMPLETED = "2"
// 已关闭
const CLOSED = "3"

Page({
  data: {
    isFixed: false,
    haveInHeadList: null,
    completedList: null,
    closedList: null,
    isLoading: false,
    // 对应tabs
    tabs: ["进行中", "已退房", "已关闭"],
    isHasNextPage: [false, false, false],
    pageNum: [1, 1, 1],
    pageSize: 10,
    isUpperLoading: false,
    nowTime: Date.parse(new Date()),
    countDownList:[],
    activeIndex: 0,
    sliderLeft: 0,
    defaultHouseImage: 'https://oss.localhome.cn/new_icon/pic_lose.png',
    isLogin: false
  },
  onPageScroll({ scrollTop }) {
    let isFixed = false
    if (scrollTop > 1) {
      isFixed = true
    }
    this.setData({
      isFixed
    })
  },
  async onLoad() {
    getApp().mtj.trackEvent('menu_trips');
  },
  onShow () {
    this.onRefresh()
    this.checkIsLogin()
  },
  // 检查是否已登录
  checkIsLogin() {
    const isLogin = isHasLogin()
    this.setData({ isLogin })
    if(isLogin) this.getOrderList()
  },
  onRefresh() {
    const { isRefreshOrderTrip = false } = app.globalData
    if (isRefreshOrderTrip) {
      app.globalData.isRefreshOrderTrip = false
      wx.startPullDownRefresh()
    }
  },
  tabClick (e) {
    let { activeIndex } = e.detail

    this.setData({
      activeIndex
    })

    this.checkIsLogin()
  },
  // 获取token后执行的回调
  _cancelEventFn() {
    this.checkIsLogin()
    this.selectComponent("#im-message").imLogin()
  },
  getListName(activeIndex) {
    switch(activeIndex) {
      case 0:
        return 'haveInHeadList';
      case 1:
        return 'completedList';
      case 2:
        return 'closedList';
    }
  },
  getOrderList() {
    let { activeIndex } = this.data;
    let listName = this.getListName(activeIndex);

    if (!this.data[listName]) {
      showLoading()
      this.setData({
        [`pageNum[${activeIndex}]`]: 1,
        [listName]: null
      })
      let status = '';
      switch(listName) {
        case 'haveInHeadList':
          status = HAVA_IN_HEAD;
          break;
        case 'completedList':
          status = COMPLETED;
          break;
        case 'closedList':
          status = CLOSED
          break;
      }
      this.getTripRecord(status)
    }
  },
  diffGetTripRecord() {
    // 区别当前选择了进行中、已完成两个模块的下拉更新
    let { activeIndex } = this.data
    let func

    switch (activeIndex) {
      case 0:
        func = () => {
          this.getTripRecord(HAVA_IN_HEAD)
        }
        break;
      case 1:
        func = () => {
          this.getTripRecord(COMPLETED)
        }
        break;
      case 2:
          func = () => {
            this.getTripRecord(CLOSED)
          }
          break;
    }
    return func
  },
  onPullDownRefresh() {
    let { activeIndex } = this.data
    this.setData({
      [`pageNum[${activeIndex}]`]: 1
    }, this.diffGetTripRecord())
  },
  getActiveIndex(orderState) {
    switch(orderState) {
      case HAVA_IN_HEAD:
        return 0;
      case COMPLETED:
        return 1;
      case CLOSED:
        return 2;
    }
  },
  getTripRecord(orderState = HAVA_IN_HEAD) {
    let activeIndex = this.getActiveIndex(orderState)
    let listName = this.getListName(activeIndex);
    let params = {
      pageNum: this.data.pageNum[activeIndex],
      pageSize: this.data.pageSize,
      orderState
    }
    getOrders(params)
      .then(async res => {
        let { list } = res.data
        const isCancelArray = ['1100', '1104', '1106', '1109', '1210', '1105']
        list.forEach((item) => {
          item['isCancelOrder'] = isCancelArray.indexOf(item.orderStatus) !== -1
          item['x'] = 0
          // 此字段可能房源数据丢失时会报错，添加判断避免问题
          if (item.cityName) {
            item.cityName = item.cityName.replace(/(市|城区)/, '')
          } else {
            item.cityName = '国内'
          }
          if (!item.imgPath) {
            item['imgPath'] = this.data.defaultHouseImage
          }
        })
        if (listName !== 'closedList') list = await this.queryListBargainOrderStatus(list, listName)
        if (this.data.pageNum[activeIndex] === 1) {
          this.setData({
            [listName]: list,
            [`isHasNextPage[${activeIndex}]`]: res.data.hasNextPage
          })
        } else {
          this.setData({
            [listName]: this.data[listName].concat(list),
            [`isHasNextPage[${activeIndex}]`]: res.data.hasNextPage
          })
        }
        if (res.data.hasNextPage) {
          this.setData({
            [`pageNum[${activeIndex}]`]: this.data.pageNum[activeIndex] + 1
          })
        }
        this.setData({
          isUpperLoading: false,
          isLoading: false
        })
        //this.countDown()
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
      .catch(e => {
        this.setData({
          isUpperLoading: false
        })
        catchLoading(e)
        wx.stopPullDownRefresh()
      })
  },
  onReachBottom() {
    let { isHasNextPage, activeIndex } = this.data
    if (isHasNextPage[activeIndex]) {
      this.setData({
        isLoading: true
      }, this.diffGetTripRecord())
    }
  },
  taplist: function(){
    wx.navigateTo({
      url: '/pages/housing/list/index'
    })
  },
  toDetails(e) {
    let id = e.currentTarget.dataset.id
    let orderStatus = e.currentTarget.dataset.status
    if(orderStatus === '1102') gioTrack('trip_waiting_pay');
    wx.navigateTo({
      url: '/pages/trip/detail-v2/index?bookingId=' + id
    })
  },
  toMap: function(e){
    let id = e.currentTarget.dataset.houseid
    let title = e.currentTarget.dataset.title
    let address = e.currentTarget.dataset.address
    getHouseDetail(id).then((res)=>{
      let latitude = res.data.latitude;
      let longitude = res.data.longitude;
      wx.openLocation({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        name: title,
        address: address,
        scale: 15
      })
    })
  },
  evaluate (e) {
    let bookingid = e.currentTarget.dataset.bookingid.replace(' ', '')
    wx.navigateTo({
      url: '/pages/order/evaluation/evaluation?bookingId=' + bookingid
    })
  },
  countDown(){
    let newTime = new Date().getTime();
    let endTimeList = this.data.haveInHeadList;
    let countDownArr = [];
    endTimeList.forEach(o => {
      let endTime = new Date(o.createTime).getTime();
      let obj = null;
      if (newTime - endTime < (15*60*1000)){
        let time = ((15*60*1000) -(newTime - endTime)) / 1000;
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        if(hou < 10){
          hou = '0' + hou
        }
        if(min < 10){
          min = '0' + min
        }
        if(sec < 10){
          sec = '0' + sec
        }
        obj = {
          day: day,
          hou: hou,
          min: min,
          sec: sec
        }
      }else{
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00'
        }
      }
      countDownArr.push(obj);
    })
    this.setData({ countDownList: countDownArr})
    setTimeout(this.countDown,1000);
  },
  goToHouseLise() {
    wx.navigateTo({
      url: '/pages/housing/list/index'
    })
  },
  imageError(e) {
    console.log(e)
  },
  delTrip(e) {
    const that = this
    const bookingId = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const activeIndex = this.data.activeIndex
    if( activeIndex === 0 ) return
    wx.showModal({
      content: '确定要删除该行程吗？',
      success (res) {
        if (res.confirm) {
          delTrip(bookingId).then((res) => {
            if(res.success){
              if(activeIndex === 1) {
                const completedList = that.data.completedList
                completedList[index].x = 0
                completedList.splice(index,1)
                that.setData({ completedList })
              }else if(activeIndex === 2) {
                const closedList = that.data.closedList
                closedList[index].x = 0
                closedList.splice(index,1)
                that.setData({ closedList })
              }
              wx.showToast({
                title: '删除成功！',
                icon: 'success',
                duration: 2000
              })
            }
          })
        }
      }
    })
  },
  // 更新活动组件
  onUpdataMovable(event){
    const dataName = this.data.activeIndex === 1 ? 'completedList' : 'closedList'
    const listData = this.data[dataName]
    const index = event.detail.index
    const item = event.detail.item
    listData[index] = item
    this.setData({[dataName]:listData})
  },
  /**
   * 创建砍价活动
   * @param e
   */
  startBargain(e) {
    gioTrack('order_list_page_start_bargain')

    const userInfo = wx.getStorageSync('userInfo')
    const createrId = userInfo.id
    const orderId = e.target.dataset.id
    createBargain({orderId, createrId, createrInfo: userInfo}).then(res => {
      if (!res.success) {
        wx.showToast({
          title: res.errorMsg,
          duration: 2000
        })
        return
      }
      this.toPageBargain(orderId)
    })
  },
  /**
   * 直接跳转到砍价活动
   * @param e
   */
  viewBargain(e) {
    gioTrack('order_list_page_view_progress')
    const orderId = e.target.dataset.id
    this.toPageBargain(orderId)
  },
  toPageBargain(orderId){
    const url = `https://i.localhome.cn/v/1908011111356/#/activity?o=${orderId}`
    const page = `/pages/h5/index?url=${encodeURIComponent(url)}`
    wx.navigateTo({
      url: page
    })
  },
  async queryListBargainOrderStatus(list) {
    const userInfo = wx.getStorageSync('userInfo');
    const createrId = userInfo.id
    try {
      /**
       * 砍价活动状态:
       * bargainIsEnd: false:进行中；true:已结束
       */
      if (list === null || list.length === 0) {
        return
      }
      const queryList = list.map(e => {
        return {creater_id: createrId, order_id: e.bookingId}
      })
      const statusListResult = await getBargainStatusList(queryList)
      const statusList = statusListResult.data
      /**
       * 砍价按钮类型bargainBtnType：0.无按钮；1.立即砍价赢免单；2.查看奖励金
       */
      list.every(order => {
        if (order.totalPrice === null || order.totalPrice === 0 || (order.totalPrice - order.depositPrice === 0)) {// 实际支付金额为0元的订单，无按钮
          order.bargainBtnType = 0;
          return true;
        }
        const bargainStatus = statusList.find(e => e.order_id === order.bookingId)
        const {status, isEnd, isHousekeeper} = bargainStatus
        if (isHousekeeper) { // 管家不能参与砍价活动
          order.bargainBtnType = 0;
          return true;
        }
        if ((!isEnd && status === 0) || status === 1) {// 1.砍价活动进行中，砍价订单状态为未开始；2.砍价订单状态为进行中；显示“立即砍价赢免单”按钮
          order.bargainBtnType = 1;
          return true;
        }
        if (status === 2) {// 砍价订单状态已结束，显示“查看奖励金”按钮
          order.bargainBtnType = 2;
          return true;
        }
        order.bargainBtnType = 0;// 默认无按钮
        return true;
      })
      return list
    } catch (e) {
      console.info('e', e)
    }
  },
  goLogin() {
    this.selectComponent('#auth-drawer-box').checkRole()
  }
})
