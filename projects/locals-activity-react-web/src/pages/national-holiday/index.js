import React from 'react'
import axios from 'axios'
import adapter from '../../common/adapter'
import HouseList from '../../components/HouseListMuQingJie/HouseList'
import '../2019082zhongqiu/index.css'
import './assets/national.css'
import utils from '../../common/utils'
import {getCoupon, queryUserInfoByToken} from '../../common/api'
import EnvConfig from "../../config/env-config";
import {tabData, tabData2} from './deploy.json'

const JAVA_HOST = EnvConfig.envConfig.api

class App extends React.Component {
	constructor () {
		super()
		this.state = {
			houseList: [],
			houseList2: [],
			tabData: tabData,
			tabData2: tabData2,
			nowTab: 'item1',
			nowTab2: 'item5',
			discount: 0.8,
			token: '',
			phone: '',
			showModel: false,
			showToast: false,
			modelMsg: '',
			move: {},
			isTurned: false,
			channel: ''
		}
	}

	componentWillMount () {
		utils.gioTrack('national_holiday_home_page_onload')

		// 获取数据
		this.getData()
		// 获取url，并解析
		const that = this
		const url = window.location.href
		const params = utils.parseURL(url).params
		// 如果有channel，进行记录
		if (params.channel) {
			const channel = params.channel
			that.setState({channel})
		}
		// 判断url中是否有token，有则判断为已登录状态，将token进行存储
		if (params.token) {
			const token = params.token
			that.setState({token})
			// 获取phone
			that.getUserInfo(token)
		}
	}

	showToast (msg) {
		this.setState({
			modelMsg: msg,
			showToast: true
		})
		setTimeout(() => {
			this.setState({showToast: false})
		}, 3000)
	}

	// 获取phone
	async getUserInfo (token) {
		try {
			const options = {
				headers: {
					'LOCALS-ACCESS-TOKEN': `Bearer ${token}`
				}
			}
			const response = await queryUserInfoByToken({}, options)
			const {errorCode, data} = response
			// token无效去登陆
			if (errorCode === '20113' || errorCode === '20116') {
				adapter.signIn()
				return
			}

			// 有token且有效
			if (data) {
				const phone = data.mobile
				const user_id = data.id
				// 存储phone,id
				this.setState({
					phone,
					user_id
				})
				// 判断是否有过领奖，将isturned设为true
				const isTurned = localStorage.getItem(phone) === '1'
				this.setState({isTurned})
			}
		} catch (e) {
			this.showToast('网络错误，请稍后再试！')
		}
	}

	// 获取优惠券
	receiveCoupon = async () => {
		const {phone, token, channel} = this.state
		if (!token) {
			this.getUserInfo(token)
			return
		}
		utils.gioTrack('national_holiday_receive_coupon_btn')

		const payload = {
			master_uuid: phone
		}
		const _data = {
			activity_id: '1909161503682',
			payload: JSON.stringify(payload)
		}
		try {
			const res = await getCoupon(_data)
			if (res.success) {
				this.setState({
					showModel: true,
					isTurned: true
				})
				// 存下phone在storage
				localStorage.setItem(phone, '1')
				return
			}

			if (res.errorCode === 100004) {
				this.setState({
					showModel: true,
					isTurned: true
				})
				localStorage.setItem(phone, '1')
				return
			}

			this.setState({
				showModel: true,
				isTurned: false
			})
			localStorage.setItem(phone, '1')
		} catch (e) {
			this.showToast('网络错误，请稍后再试！')
		}
	}

	// 获取数据
	getData (type) {
		const that = this
		const _type = type || this.state.nowTab
		let _data = []
		const tabdatas = [...this.state.tabData, ...this.state.tabData2]

		for (let i = 0; i < tabdatas.length; i++) {
			if (_type === tabdatas[i].type) {
				_data = tabdatas[i].ids
			}
		}
		if (_data === []) {
			return
		}
		axios
			.post(
				`${JAVA_HOST}/prod-plus/activity/20190409/house`,
				_data
			)
			.then(function (response) {
				if (response.data.success) {
					const data = response.data.data
					if ('item1#item2#item3#item4'.indexOf(_type) !== -1) {
						that.setState({
							houseList: data.reverse()
						})
					} else {
						that.setState({
							houseList2: data
						})
					}
				}
			})
			.catch(function (error) {
				console.log(error)
			})

		if (!type) {
			axios
				.post(
					`${JAVA_HOST}/prod-plus/activity/20190409/house`,
					this.state.tabData2[0].ids
				)
				.then(function (response) {
					if (response.data.success) {
						const data = response.data.data
						that.setState({
							houseList2: data
						})
					}
				})
				.catch(function (error) {
					console.log(error)
				})
		}
	}

	// 关闭model
	closeModel = () => {
		this.setState({showModel: false})
	}

	// 改变tab
	changeTab (type) {
		if ('item1#item2#item3#item4'.indexOf(type) !== -1) {
			this.setState({
				nowTab: type
			})
		} else {
			this.setState({
				nowTab2: type
			})
		}

		this.getData(type)
	}


	optBtnRender = () => {
		return (
			<span
				className="appointment"
			>立即预约</span>
		)
	}

	lookMoreClick = () => {
		adapter.navigate({method: 'reLaunch', url: '/pages/index/index'})
	}

	jumpToCoupon = () => {
		adapter.navigate({url: '/pages/coupon/index'})
	}

	renderPrice82 = (price) => {
		return Number.parseInt(price * 0.82)
	}

	renderPrice50 = (price) => {
		return price - 50
	}

	render () {
		const self = this
		const {nowTab, nowTab2, tabData, tabData2} = this.state
		return (
			<div id="app" className="shuqiContainer">
				<div className="topImg">
					<img
						src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/national-holiday/topbg.png"
						alt=""
					/>
				</div>
				<div className="main">
					<div className="receiveTicket">
						<div className="discount-row">
							<img className="discount-img"
							     src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/national-holiday/discount0.png"
							     alt=""
							/>
							<img className="discount-img"
							     src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/national-holiday/discount1.png"
							     alt=""
							/>
						</div>
						<img
							className="takeBtn"
							src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/national-holiday/linqu.png"
							onClick={this.receiveCoupon}
							alt=""
						/>
					</div>

					<div className="tabList">
						<div className="title">
							<img
								className="first-project-top"
								src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/national-holiday/project-top0.png"
								alt=""
							/>
						</div>
						<div className="receive-tab">
							{tabData.map(item => {
								return (
									<div
										key={item.type}
										className={`tab-item ${nowTab === item.type ? 'active' : ''}`}
										onClick={function () {
											self.changeTab(item.type)
										}}
									>
										<span>{item.name}</span>
									</div>
								)
							})}
						</div>
						<HouseList
							houseList={this.state.houseList}
							discount={this.state.discount}
							isTurned={this.state.isTurned}
							optBtnRender={this.optBtnRender}
							renderPrice={this.renderPrice82}
						/>

						<img
							className="lookMore"
							onClick={this.lookMoreClick}
							src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/national-holiday/look-more.png"
							alt=""
						/>
					</div>

					<div className="tabList">
						<div className="title">
							<img
								className="first-project-top"
								src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/national-holiday/hot-city.png"
								alt=""
							/>
						</div>
						<div className="receive-tab">
							{tabData2.map(item => {
								return (
									<div
										key={item.type}
										className={`tab-item ${nowTab2 === item.type ? 'active' : ''}`}
										onClick={function () {
											self.changeTab(item.type)
										}}
									>
										<span>{item.name}</span>
									</div>
								)
							})}
						</div>
						<HouseList
							houseList={this.state.houseList2}
							discount={this.state.discount}
							isTurned={this.state.isTurned}
							optBtnRender={this.optBtnRender}
							renderPrice={this.renderPrice50}
						/>

						<img
							className="lookMore"
							onClick={this.lookMoreClick}
							src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/national-holiday/look-more.png"
							alt=""
						/>
					</div>
				</div>

				{this.state.showModel && (
					<div className="ruleTips">
						{this.state.isTurned ? (
							<div className="dialog">
								<div className="dialog-success">
									<img
										className="dialog-img"
										src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/national-holiday/receive-success.png"
										alt=""
									/>
									<div className="jumpToCoupon" onClick={this.jumpToCoupon}/>
								</div>
								<div className="closeBtn">
									<img
										src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/20190717shuqi/shuqi2.0.png"
										alt=""
										onClick={this.closeModel}
									/>
								</div>
							</div>
						) : (
							<div className="dialog">
								<div className="dialog-recived">
									<div className="dialog-recived-container">
										<img
											className="dialog-img"
											src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/national-holiday/have-take.png"
											alt=""
										/>
										<div className="dialog-img2" onClick={this.jumpToCoupon}/>
									</div>
									<div className="jumpToCoupon" onClick={this.jumpToCoupon}/>
								</div>
								<div className="closeBtn">
									<img
										src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/20190717shuqi/shuqi2.0.png"
										alt=""
										onClick={this.closeModel}
									/>
								</div>
							</div>
						)}
					</div>
				)}

				{this.state.showToast && (
					<div className="toast-wrap">
						<div className="toast">
							<p>{this.state.modelMsg}</p>
						</div>
					</div>
				)}

				<div className="imgPreload">
					<img
						src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/national-holiday/have-take.png"
						alt=""
					/>
					<img
						src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/national-holiday/receive-success.png"
						alt=""
					/>
				</div>
			</div>
		)
	}
}

export default App
