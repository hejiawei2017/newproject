const app = getApp();
const { showLoading,catchLoading } = require('../../../utils/util')
const { getInvoice } = require('../../../server/mine')
const { getInvoiceList } = require('../../../server/invoice')
Page({
  data: {
    isFullScreen: app.globalData.isFullScreen,
    invoiceData:[],
    isflag:0,
    flag:true,
    invoicePrice:-1,
    invoiceServicePrice:0,
    chooseIndex:-1,
    isLoading:true,
    activeIndex:'0',
    successModal:false,
    invoiceDetail:{},
    hasNextPage:true,
    pageNum:1,
    pageSize:20,
  },
  onReady: function () {
    this.selectComponent("#im-message").imLogin()
    if(app.globalData.userInfo){
      this.init();
    }
  },
  init: function(){
    let self = this
    self.setData({
      isLoading:true,
    })
    showLoading()
    getInvoice().then(res => {
      wx.hideLoading()
      if(res.success){
        const data = res.data
        const invoiceData = data.filter(item => item.orderPrice !== 0)
        self.setData({
          invoiceData,
          isLoading: false
        })
      }
    }).catch((e) => {
      catchLoading(e)
      self.setData({
        isLoading:false,
      })
    })
  },
  operateInvoice: function(){
    wx.navigateTo({
      url:'../../order/operate-invoice/operate-invoice?from=invoiceList'
    })
  },
  _cancelEventFn() {
    this.selectComponent("#im-message").imLogin()
  },
  chooseInvoice(e){
    const index = e.currentTarget.dataset.index
    if (index === this.data.chooseIndex) return
    const invoiceData = this.data.invoiceData
    this.setData({ 
      chooseIndex: index,
      invoicePrice: invoiceData[index].invoicePrice,
      invoiceServicePrice: invoiceData[index].invoiceServicePrice,
    })
  },
  confirm() {
    const { chooseIndex, invoiceData } = this.data
    if (invoiceData[chooseIndex].invoicePrice === 0){
      wx.showToast({
        title: '抱歉，该订单可开发票金额为0！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    const chooseData = JSON.stringify(invoiceData[chooseIndex])
    wx.navigateTo({
      url: `../../mine/fill-in-invoice/fill-in-invoice?chooseData=${encodeURIComponent(chooseData)}`
    })
  },
  hadInvoice(e) {
    const type = e.currentTarget.dataset.type
    if (type === this.data.activeIndex) return
    this.setData({ 
      activeIndex: type,
      invoiceData: [] 
    })
    this.setData({ 
      pageNum:1,
      hasNextPage:true
    })
    if(type === '1') this.getHadInvoice() 
    else this.init()
  },
  // 获取已开发票
  getHadInvoice() {
    if (!this.data.hasNextPage) return
    let self = this
    self.setData({
      isLoading: true,
    })
    showLoading()
    const userInfo = wx.getStorageSync('userInfo')
    const data = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      userId: userInfo.id
    }
    getInvoiceList(data).then(res => {
      wx.hideLoading()
      if (res.success) {
        if(!res.data) {
          self.setData({ isLoading: false })
          return
        }
        const invoiceData = [...this.data.invoiceData,...res.data.list]
        invoiceData.filter((item) => {
          return item.invoiceStatus !== 4
        })
        self.setData({
          pageNum: this.data.pageNum + 1,
          hasNextPage: res.data.hasNextPage,
          invoiceData,
          isLoading: false
        })
      }
    }).catch((e) => {
      catchLoading(e)
      self.setData({
        isLoading: false,
      })
    })
  },
  onReachBottom: function () {
    if(this.data.activeIndex === '1') this.getHadInvoice()
  },
  showDetail(e){
    const item = e.currentTarget.dataset.item
    this.setData({
      invoiceDetail: item,
      successModal: true,
    })
  },
  closeModal(){
    this.setData({
      invoiceDetail: [],
      successModal: false,
    })
  },
  catchClick(){ return }
})