// pages/order/guest-details/index.js
const { getGuaranteeSlipList, getOrderDetail } = require('../../../server/order');
const regeneratorRuntime = require('../../../libs/regenerator-runtime');
const openDocument = require('../../../utils/open-document');
const { catchLoading} = require('../../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    guaranteeSlipList: [],
    isForeignCity:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOrderDetailInfo(options.orderId);
    this.setData({
      isForeignCity:options.isForeignCity === 'true' ? true : false
    })
  },
  getOrderDetailInfo(orderId) {
    getOrderDetail(orderId)
      .then(res => {
        let { data } = res
        const guaranteeSlipList = data.guestViews;
        this.setData({ guaranteeSlipList })
        this.loadGuestStatusList(data.bookingNumber)
      })
      .catch(e => {
        console.log(e)
        catchLoading(e)
      })
  },
  //  = '92NF6M'
  async loadGuestStatusList(orderNo) {
    let { guaranteeSlipList } = this.data;
    const { data } = await getGuaranteeSlipList(orderNo);
    if (!data || !data.length) {
      wx.showToast({
        title: '查询入住人',
        icon: 'success', // loading
        duration: 1500,
        mask: true
      });
      return;
    }
    guaranteeSlipList.forEach(item => {
      data.forEach(slipItem => {
        if (slipItem.cardNo && slipItem.cardNo === item.cardNo) {
          item.policyNo = slipItem.policyNo
          item.downLoadUrl = slipItem.downLoadUrl
          item.message = slipItem.message
        }
      })
    })
    this.setData({
      guaranteeSlipList: guaranteeSlipList
    });
  },

  openPolicy(e) {
    const { downloadUrl } = e.currentTarget.dataset;
    openDocument(downloadUrl);
  }
});
