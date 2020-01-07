const app = getApp()
const {
	showLoading,
	catchLoading,
	gioTrack
} = require('../../../utils/util')
const {
	tradeOrder,
	getServiceTypes
} = require('../../../server/business-trip')
const moment = require('../../../utils/dayjs.min.js')
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({
	data: {
		houeseData: {}, // 房屋信息
		serverType: [], // 服务类型基础数据
		serverChoosed: '0', // 选择的服务类型
		serverDate: '选择日期', // 选择的日期
		remark: '' // 备注
	},

	onLoad() {
		wx.hideShareMenu()
		this.initData()
	},

	/**
	 * 初始化数据
	 */
	initData() {
		const data = JSON.parse(decodeURIComponent(this.options.item))
		this.setData({
			houeseData: data // 添加房子信息
		})
		this.getDateArea() // 获取服务日期起始时间
		// 获取服务类型基础数据
		const userId = wx.getStorageSync('userInfo').id
		getServiceTypes({
			memberId: userId
		}).then(res => {
			if (res.success) {
				this.setData({
					serverType: res.data
				})
			}
		}).catch(e => {
			catchLoading(e)
		})
	},
	getDateArea() {
		const {
			checkinDate = '', checkoutDate = ''
		} = this.data.houeseData
		const startDate = this.formatDateJoiner(checkinDate)
		const endDate = this.formatDateJoiner(checkoutDate)
		this.setData({
			startDate,
			endDate
		})
	},
	formatDateJoiner(dataStr = '') {
		console.log(dataStr.replace(/\//g, '-'))
		return dataStr.replace(/\//g, '-') || ''
	},

	/**
	 * 服务类型选择处理
	 * @param {*} e 
	 */
	bindServeChange(e) {
		this.setData({
			serverChoosed: e.detail.value
		})
	},

	/**
	 * 日期选择处理
	 * @param {*} e 
	 */
	bindDateChange(e) {
		this.setData({
			serverDate: e.detail.value
		})
	},

	/**
	 * 备注填写处理
	 * @param {*} e 
	 */
	bindRemarkChange(e) {
		this.setData({
			remark: e.detail.value
		})
	},

	/**
	 * 提交
	 */
	bindSubmit() {
		// 验证信息
		if (this.data.serverDate === '选择日期' || !(new Date(this.data.serverDate))) {
			catchLoading('请选择一个合法日期')
			return
		}
		// if (!this.data.remark) {
		// 	catchLoading('请输入备注')
		// 	return
		// }

		const {
			userInfo
		} = app.globalData

		// 订单提交
		tradeOrder({
			memberServiceOrderId: this.data.serverType[this.data.serverChoosed].memberServiceOrderId,
			orderId: this.data.houeseData.bookingId,
			orderRandomId: this.data.houeseData.randomId,
			memberId: userInfo.id,
			serviceDate: this.data.serverDate,
			remark: this.data.remark

		}).then(res => {
			if (res.success) {
				gioTrack('order_trade_success')

				// 兑换成功提示框之后跳转兑换记录页面
				wx.showModal({
					showCancel: false,
					confirmText: '好的',
					title: '提交成功',
					content: '管家会与您进行联系，请保证通讯畅通',
					success(res) {
						if (res.confirm) {
							// 跳转后返回不到当前页面
							wx.redirectTo({
								url: '/pages/business-trip/trade-log/index'
							})
						}
					}
				})

			} else {
				catchLoading(e.errorDetail || e.errorMsg || '兑换失败！')
			}
		}).catch(e => {
			catchLoading(e.errorDetail || e.errorMsg || '兑换失败！')
		})
	}
})