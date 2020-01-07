const {
  getInvoiceTitleList,
  addInvoice
} = require('../../../server/invoice')
const {
  showLoading,
  catchLoading
} = require('../../../utils/util')
const app = getApp()

Page({

  data: {
    isFullScreen: app.globalData.isFullScreen,
    pageNum: 1,
    pageSize: 30,
    listData: [],
    invoiceTitleData: {},
    titleName: '',
    email: '',
    phoneNumber: '',
    taxCode: '',
    address: '',
    registeredAddress: '',
    registeredPhoneNum: '',
    depositBank: '',
    bankAccount: '',
    invoiceData: {},
    showDetail:false
  },

  onLoad: function(options) {
    const invoiceData = decodeURIComponent(options.chooseData)
    if (invoiceData) {
      this.setData({
        invoiceData: JSON.parse(invoiceData)
      })
    }
  },

  onShow: function() {
    let params = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }
    this.init(params)
  },

  init: function(params) {
    showLoading()
    getInvoiceTitleList(params).then((res) => {
      const list = res.data.list
      // 过滤专用发票
      const newList = list.filter(item => item.invoiceType !== 3)
      this.setData({
        listData: newList
      })
      wx.hideLoading()
    }).catch((e) => {
      catchLoading(e)
    })
  },

  chooseInvoiceId(e) {
    const data = e.currentTarget.dataset.data
    if (data.id === this.data.invoiceTitleData.id) {
      this.setData({showDetail: true})
      return
    }
    this.setData({
      invoiceTitleData: data,
      showDetail:true
    })
  },

  // 显示选择页面
  changeInvoice(){
    this.setData({
      showDetail:false
    })
  },

  jumpToAdd() {
    wx.navigateTo({
      url: `../../order/operate-invoice-info/index?from=fillInInvoice`
    })
  },

  chooseType(e) {
    const type = e.currentTarget.dataset.type
    if (type === this.data.chooseType) return
    this.setData({
      chooseType: type
    })
  },

  raiseType(e) {
    const type = e.currentTarget.dataset.type
    if (type === this.data.raiseType) return
    this.setData({
      raiseType: type
    })
  },

  changeData(e) {
    let {
      type
    } = e.currentTarget.dataset
    let {
      value
    } = e.detail
    if (type) {
      this.setData({
        [type]: String(value).trim()
      })
    }
  },

  confirm() {
    const invoiceData = this.data.invoiceData
    const invoiceTitleData = this.data.invoiceTitleData
    const data = {
      bookingCode: invoiceData.bookingCode,
      tripCode: invoiceData.randomId,
      bookingUsername: invoiceData.bookingUsername,
      bookingPhoneNumber: invoiceData.bookingPhoneNumber,
      orderPrice: invoiceData.orderPrice,
      platform: invoiceData.platform,
      invoiceTitleId: invoiceTitleData.id,
      invoicePrice: invoiceData.invoicePrice,
      servicePrice: invoiceData.invoiceServicePrice,
      invoiceType: invoiceTitleData.invoiceType,
      titleType: invoiceTitleData.titleType,
      titleName: invoiceTitleData.titleName,
      phoneNumber: invoiceTitleData.phoneNumber,
      email: invoiceTitleData.email,
      taxCode: invoiceTitleData.taxCode,
      registeredAddress: invoiceTitleData.registeredAddress,
      registeredPhoneNum: invoiceTitleData.registeredPhoneNum,
      bankAccount: invoiceTitleData.bankAccount,
      depositBank: invoiceTitleData.depositBank,
      address: invoiceTitleData.address,
      username: invoiceTitleData.username,
      content:'住宿服务费',
    }
    addInvoice(data).then((res)=>{
      if (res.success){
        const orderId = res.data
        wx.redirectTo({
          url: `/pages/mine/invoice-pay/invoice-pay?outTradeNo=${orderId}&invoiceServicePrice=${invoiceData.invoiceServicePrice}&invoiceData=${JSON.stringify(data)}`
        })
      }
    })
  },

})