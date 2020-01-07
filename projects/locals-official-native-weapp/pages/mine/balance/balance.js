const { getWallet, getWalletDetail } = require('../../../server/mine')
const { showLoading, catchLoading } = require('../../../utils/util')
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')
Page({
  data: {
    balence:0,
    benifit:0,
    returnList:[],
    wallet: {
      availableMoney: 0,
      availableConsumerCashMoney: 0
    }
  },
  onShow() {
    this.selectComponent("#im-message").imLogin()
    this.selectComponent("#auth-drawer-box").checkRole()
  },
  signInCallback() {
    this.init()
  },
  async init() {
    try {
      showLoading()
      let wallet = await getWallet()
      let walletDetail = await getWalletDetail({
        pageNum: 1,
        pageSize: 1000
      })
      let walletList = []
      if (
          walletDetail.data 
          && Array.isArray(walletDetail.data.list) 
          && walletDetail.data.list.length > 0
      ) {
        walletList = walletDetail.data.list
      }
      this.setData({
        walletList,
        wallet: wallet.data
      })
      wx.hideLoading() 
    } catch(e) {
      catchLoading(e)
    }
  },
  tojump: function(){
    wx.navigateTo({
      url: '../top-up/index'
    })
  }
})