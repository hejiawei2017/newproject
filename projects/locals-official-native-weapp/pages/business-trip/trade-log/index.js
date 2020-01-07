const { showLoading, catchLoading } = require('../../../utils/util')
const moment = require('../../../utils/dayjs.min.js')
const { 
	getTradeLog
} = require('../../../server/business-trip')

const { getHouseListByIds } = require('../../../server/housing')

Page({
	data: {
		dataList: []
	},

	onShow () {
		wx.hideShareMenu()
		this.getLogList().then(res => {
			this.getImgsByHouseSourceIds()
		})
	},

	/**
	 * 获取记录列表
	 */
	getLogList () {
		showLoading()
		const userId = wx.getStorageSync('userInfo').id
		return getTradeLog({
			memberId: userId,
			useStatus: 1
		}).then(res => {
			if (res.success) {
				const list = res.data
				list.forEach(el => {
					el.serviceDate = moment(el.serviceDate).format('YYYY-MM-DD')
				})
				this.setData({
					dataList: res.data
				})
				wx.hideLoading()

			} else {
				catchLoading(e.errorMsg)
			}
			
		}).catch(e => {
			catchLoading(e.errorDetail || e)
		})
	},

	/**
	 * 通过房源id查找图片进行展示
	 */
	getImgsByHouseSourceIds () {
		const houseSrcIds = []
		this.data.dataList.forEach(item => {
			houseSrcIds.push(item.bookingHouseSourceId)
		})
		getHouseListByIds({idIn: houseSrcIds.join(',')}).then(res => {
			if (!res.success) return
			const cached = this.data.dataList
			const houseList = res.data
			houseList.forEach(item => {
				const resList = cached.filter(house => house.bookingHouseSourceId === item.id)
				const img = item.imgPath
				resList.forEach(house => {
					house.imgPath = img
				})
			})

			this.setData({
				dataList: cached
			})
		})
	},

	bindServeChange (e) {
		this.setData({
			serverChoosed: e.detail.value
		})
	},

	bindDateChange (e) {
		this.setData({
			serverDate: e.detail.value
		})
	}

})