const { getInvoiceTitleList, delInvoiceTitle, addInvoiceTitle } = require('../../../server/invoice')
const { showLoading,catchLoading } = require('../../../utils/util')
const app = getApp()

Page({
  data: {
    isFullScreen: app.globalData.isFullScreen,
    pageNum: 1,
    pageSize: 20,
    listData: [],
    // checked:''
  },
  onLoad: function (options) {
    this.setData({
      from: options.from || '',
      isFromOrder: options.from === 'order'
    })
  },
  onShow: function(e){
    this.selectComponent("#im-message").imLogin()
    let params = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }
    this.init(params)
  },
  init:function(params){
    showLoading()
    getInvoiceTitleList(params)
      .then(res => {
      const { list } = res.data
      // 过滤专用发票
      const newList = []
      list.forEach((item) => {
        if(item.invoiceType !== 3) {
          item['x'] = 0
          newList.push(item)
        }
      })
      this.setData({
        listData: newList
      })
      wx.hideLoading()
    }).catch((e) => {
      catchLoading(e)
    })
  },
  addInvoice: function () {
    wx.navigateTo({
      url: '../operate-invoice-info/index?from=' + this.data.from
    })
  },
  updateInvoice(e) {
    let { item } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/order/operate-invoice-info/index?id=${ item.id }&from=${this.data.from}`
    })
  },
  delInvoice(e) {
    const that = this
    let { item } = e.currentTarget.dataset
    wx.showModal({
      content: '确定要删除该发票抬头吗？',
      success(res) {
        if (res.confirm) {
          showLoading()
          delInvoiceTitle(item.id).then((res) => {
            if (res.success){
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              const params = {
                pageNum: that.data.pageNum,
                pageSize: that.data.pageSize
              }
              that.init(params)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  setX0() {
    this.setData({ x: 0 })
  },
  // 调用微信发票服务
  getWechatInvoice() {
    const that = this
    wx.chooseInvoiceTitle({
      success(res) { 
        delete res.errMsg
        wx.navigateTo({
          url: `../operate-invoice-info/index?from=${that.data.from}&invoiceData=${JSON.stringify(res)}`
        })
      }
    })
  },
  // 更新活动组件
  onUpdataMovable(event){
    const listData = this.data.listData
    const index = event.detail.index
    const item = event.detail.item
    listData[index] = item
    this.setData({listData})
  }
})
