const { showLoading, catchLoading, isHasLogin } = require('../../../utils/util')
const moment = require('../../../utils/dayjs.min.js')
const { getOrderList } = require('../../../server/business-trip')
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

const orderStatus = { // 订单状态基础数据
	1100: "已删除",
	1101: "咨询",
	1201: "咨询_同意",
	1210: "咨询_拒绝",
	1102: "待付款",
	1207: "待入住",
	1208: "入住中",
	1105: "退款中",
	1106: "已取消",
	1104: "已退房",
	1109: "已关闭",
}


Page({
	data: {
		isHasLogin: false, // 登录状态
		orderDisableList: [], // 不可用订单列表
		orderValidList: [], // 可用订单列表
		isHasLogin: isHasLogin(),  // 登录状态
		orderStatusMap: { // 订单状态基础数据
			1100: "已删除",
			1101: "咨询",
			1201: "咨询_同意",
			1210: "咨询_拒绝",
			1102: "待付款",
			1207: "待入住",
			1208: "入住中",
			1105: "退款中",
			1106: "已取消",
			1104: "已退房",
			1109: "已关闭",
		}
	},

	onShow() {
		wx.hideShareMenu()
		this.selectComponent("#auth-drawer-box").checkRole() // 登录
	},

	async _cancelEventFn() {
	  if (isHasLogin()) {
			this.setData({
		  	isHasLogin: true
			})
			this.getOrderList()
	  }
	},

	/**
	 * 获取订单
	 */
	async getOrderList () {
		try {
			showLoading()
			const res = await getOrderList()
			this.filterData(res.data.list)

		} catch (e) {
      		catchLoading(e)
		}
		wx.hideLoading();
	},

	/**
	 * 过滤出可用订单和不可用订单
	 * @param {*} dataList 所有订单数据
	 */
	filterData (dataList) {
		const tmpDisable = []
		const tmpValid = []
		dataList.forEach(item => {
			item.createTime = this.formatDate(item.createTime)
			item.checkinDate = this.formatDate(item.checkinDate)
			item.checkoutDate = this.formatDate(item.checkoutDate)

			if ((item.orderStatus === '1207' || item.orderStatus === '1208') && item.countryName === '中国') {
				tmpValid.push(item)
			} else {
				tmpDisable.push(item)
			}
		})
		console.log(tmpValid)
		this.setData({
			orderDisableList: tmpDisable,
			orderValidList: tmpValid,
		})
	},

	/**
	 * 选择订单
	 * @param {*} e 
	 */
	chooseOrder (e) {
		const itemData = e.currentTarget.dataset.item
		// console.log('itemData', itemData)
		// console.log('itemData JSON', JSON.stringify(itemData))
		// return
		const url = `/pages/business-trip/order-trade/index?item=${encodeURIComponent(JSON.stringify(itemData))}`
		wx.navigateTo({
			url,
		})
	},

	formatDate (times) {
		return moment(times).format('YYYY/MM/DD')
	}
})