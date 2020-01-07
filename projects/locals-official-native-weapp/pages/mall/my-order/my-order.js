const { myOrderList, claimList, mallTempConfig, mallRelevance } = require('../../../server/mall')
const { showLoading, catchLoading, maskPhone, weekNumToCN } = require('../../../utils/util')
const dayjs = require('../../../utils/dayjs.min.js');

const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    relevances: {},
    orderlist: [],
    claimList: [],
    tabs: ['我购买的', '赠送给我的'],
    pageNum: 1,
    pageNumArray: [1, 1],
    hasNextPageArray: [true, true],
    pageSize: 20,
    activeIndex: 0,
    photoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHBvaW50ZXItZXZlbnRzPSJub25lIiB3aWR0aD0iMTYwcHgiIGhlaWdodD0iMTYwcHgiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTkyLCA1NywgNDMpOyI+PHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgeT0iNTAlIiB4PSI1MCUiIGR5PSIwLjM1ZW0iIHBvaW50ZXItZXZlbnRzPSJhdXRvIiBmaWxsPSIjZmZmZmZmIiBmb250LWZhbWlseT0iSGVsdmV0aWNhTmV1ZS1MaWdodCxIZWx2ZXRpY2EgTmV1ZSBMaWdodCxIZWx2ZXRpY2EgTmV1ZSxIZWx2ZXRpY2EsIEFyaWFsLEx1Y2lkYSBHcmFuZGUsIHNhbnMtc2VyaWYiIHN0eWxlPSJmb250LXdlaWdodDogNDAwOyBmb250LXNpemU6IDYwcHg7Ij5MTzwvdGV4dD48L3N2Zz4='
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { activeIndex = 0 } = options

    mallRelevance()
    .then((res) => {
      console.info(res)
      this.setData({
        relevances: res,
        activeIndex: parseInt(activeIndex)
      })
      wx.hideShareMenu()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    mallTempConfig().then(res => {
      this.setData({
        config: res
      })
      this.getOrderList(this.data.activeIndex);
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  getArrayName(index) {
    switch (index) {
      case 0:
        return 'orderlist'
      case 1:
        return 'claimList'
    }
  },

  tabClick(e) {
    let { activeIndex } = e.detail

    this.setData({
      activeIndex
    })
    const { hasNextPageArray } = this.data
    let arrayName = this.getArrayName(activeIndex)
    let targetArray = this.data[arrayName]
    if (targetArray.length === 0 && hasNextPageArray[activeIndex]) {
      this.getOrderList(activeIndex)
    }
  },

  getOrderList(index = 0) {
    const { pageNumArray, pageSize } = this.data
    showLoading();
    let self = this
    this.setData({
      isLoading: true,
    })
    const data = {
      pageNum: pageNumArray[index],
      pageSize,
    }
    const call = 0 === index ? myOrderList({ ...data, tradeType: 1 }) : claimList({ ...data, userId: app.globalData.userInfo.id })
    call.then(res => {
      this.handleData(res, index)
    }).catch((e) => {
      wx.hideLoading()
      catchLoading(e)
      self.setData({
        isLoading: false,
      })
    })
  },

  handleData(res, index) {
    wx.hideLoading()
    wx.stopPullDownRefresh();
    if (res.success) {
      if (index === 0) { //我的订单数据
        if (res.data.tradeViewList.length === 0) {
          this.setData({
            [`hasNextPageArray[${index}]`]: false
          })
          return 0;
        }
        let orderlist = this.data.orderlist
        if (orderlist.length === 0) {
          const payUser = {
            userId: res.data.userId,
            nickName: res.data.nickName,
            avatar: res.data.avatar
          }
          this.setData({
            payUser
          })
        }
        this.setData({
          orderlist: orderlist.concat(this.formatOrderListData(res.data.tradeViewList))
        })
        return;
      }

      if (index === 1) { //我的领取
        let { claimList } = this.data
        let { list, hasNextPage } = res.data
        this.setData({
          claimList: claimList.concat(this.formatClaimListData(list)),
          [`hasNextPageArray[1]`]: hasNextPage
        })
        return;
      }
    }
  },

  formatOrderListData(data) {
    return data.map(e => {
      return { ...e, maskPhone: maskPhone(e.givefriendMobile), transhint: this.orderHint(e.expressInfo) }
    })
  },

  orderHint(expressInfo) {
    if (!expressInfo) {
      return ''
    }
    if (!expressInfo.expressCompanyName || !expressInfo.expressNo) {
      return ''
    }
    return `已发货  ${expressInfo.expressCompanyName}  单号：（${expressInfo.expressNo}）`
  },

  formatClaimListData(data) {
    return data.map(e => {
      return { ...e, maskPhone: maskPhone(e.receiverMobile), transhint: this.claimHint(e.expressCompany, e.expressNo) }
    })
  },

  claimHint(expressCompany, expressNo) {
    if (!expressCompany) {
      return ''
    }
    if (!expressNo) {
      return ''
    }
    let name = ''
    switch (parseInt(expressCompany)) {
      case 1:
        name = '德邦'
        break;
      case 2:
        name = '顺丰'
        break;
      case 3:
        name = '圆通'
        break;
      case 4:
        name = '中通'
        break;
      case 5:
        name = '韵达'
        break;
    }
    return `已发货  ${name}  单号：（${expressNo}）`
  },

  //物流送达预计
  getDeliveryDate(time) {
    let deliveryInfo = ''
    let afterDate
    if (dayjs(time).hour() > 17) {
      afterDate = dayjs(time).add(4, 'day')
    } else {
      afterDate = dayjs(time).add(3, 'day')
    }
    return `预计${(dayjs(afterDate).month() + 1)}月${dayjs(afterDate).date()}日(周${weekNumToCN(dayjs(afterDate).day())})送达，请注意查收`

  },

  navHardCode({ currentTarget: { dataset: { itemid } } }) {
    let id = 1
    
    if (this.data.relevances[itemid]) {
      id = this.data.relevances[itemid]
    }

    wx.navigateTo({
      url: `../item/item?id=${id}`
    })
  },

  imgClick({ currentTarget: { dataset: { url } } }) {
    wx.previewImage({
      urls: [url] // 需要预览的图片http链接列表
    })

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const { activeIndex } = this.data
    const arrayName = this.getArrayName(activeIndex)
    this.setData({
      [arrayName]: [],
      [`pageNumArray[${activeIndex}]`]: 1,
      [`hasNextPageArray[${activeIndex}]`]: true
    })
    this.getOrderList(activeIndex);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let { activeIndex, hasNextPageArray, pageNumArray } = this.data
    let isHasNextPage = hasNextPageArray[activeIndex]

    if (!isHasNextPage) {
      return false
    }

    this.setData({
      [`pageNumArray[${activeIndex}]`]: pageNumArray[activeIndex] + 1
    })
    this.getOrderList(activeIndex);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    const item = e.target.dataset.item
    if (item) {
      const user = this.data.payUser
      return {
        title: `您的好友发福利啦`,
        path: `/pages/mall/claim/claim?userId=${user.userId}&avatar=${user.avatar}&nickName=${user.nickName}&orderId=${item.orderInfo.id}&itemId=${item.items[0].itemId}&payment=${item.orderInfo.payment}&num=${item.items[0].num}`,
        imageUrl:
          item.items[0].picUrl
      }
    } else
      return 0;

  }
})