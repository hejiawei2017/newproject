const { showLoading, catchLoading } = require('../../../utils/util')

Page({
	data: {
	},

	onLoad () {
		wx.hideShareMenu()
	},

	routeToVerify() {
		wx.redirectTo({
			url: '/pages/business-trip/firm-register/index'
		})
	},

	routeToVip() {
		wx.navigateTo({
			url: '/pages/business-trip/vip/index'
		})
	},

})