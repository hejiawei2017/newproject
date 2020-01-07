import React from 'react';
import Image from '../../components/Image/Image';
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'
import '../businessTravel/assets/index.scss'
import {sendVerificationCode, login, giftPack, importStaffs, queryUserInfoByToken} from '../../common/api'
import {hashHistory} from 'react-router'
import utils from "../../common/utils";
import adapter from "../../common/adapter";

const OSS_PATH = 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/businessTravel'
export default class HomePage extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			banners: [
				`${OSS_PATH}/business-travel-banner0.png`,
				`${OSS_PATH}/business-travel-banner1.png`,
				`${OSS_PATH}/business-travel-banner2.png`
			],
			services: [
				{icon: `${OSS_PATH}/silver-icon1.png`, name: '专属管家'},
				{icon: `${OSS_PATH}/silver-icon0.png`, name: '行李寄存'},
				{icon: `${OSS_PATH}/silver-icon2.png`, name: '现场接待'},
				{icon: `${OSS_PATH}/silver-icon3.png`, name: '延迟退房'}
			],
			introductions: [
				`${OSS_PATH}/intro-img0.png`,
				`${OSS_PATH}/intro-img1.png`,
				`${OSS_PATH}/intro-img2.png`
			],
			discounts: [
				`${OSS_PATH}/discount0.png`,
				`${OSS_PATH}/discount1.png`,
				`${OSS_PATH}/discount2.png`
			],
			mobile: '',
			verificationCode: '',
			isSend: false,
			time: 60,
			interval: null,
			tipVisible: false,
			errorVisible: false,
			errorMsg: '',
			loading: false
		};
	}

	componentDidMount () {
		document.title = '送您一张路客银卡'
		new Swiper('.swiper-container', {
			autoplay: true,
			loop: true,
			speed: 1000,
			freeMode: true,
			allowTouchMove: false
		})
	}

	componentWillUnmount () {
		const {interval} = this.state
		if (interval !== null) {
			clearInterval(interval)
		}
	}

	// 获取验证码后倒计时逻辑
	countdown = () => {
		const {time, interval} = this.state
		if (time <= 0) {
			this.setState({
				time: 60,
				isSend: false
			})
			clearInterval(interval)
			return
		}
		this.setState({
			time: time - 1
		})
	}

	handleCodeChange = (e) => {
		this.setFormItem(e, 'verificationCode')
	}

	handleMobileChange = (e) => {
		this.setFormItem(e, 'mobile')
	}

	setFormItem (e, prop) {
		const value = e.target.value
		if (value == null || value.trim() === '') {
			return
		}
		this.setState({
			[prop]: value.trim()
		})
	}

	getVerificationCode = async () => {
		const {mobile} = this.state
		if (!/^\d{11}$/.test(mobile)) {
			const errorMsg = `手机号格式错误，请重新填写。`
			this.showErrorDialog(errorMsg)
			return
		}
		this.setState({loading: false})
		const params = {
			mobile
		}
		try {
			const res = await sendVerificationCode(params)
			if (!res.success) {
				this.setState({loading: false})
				this.showErrorDialog(res.errorMsg || res.errorDetail)
				return
			}

			this.setState({
					loading: false,
					isSend: true,
					interval: setInterval(() => {
						this.countdown()
					}, 1000)
				}
			)
		} catch (e) {
			this.setState({loading: false})
			this.showErrorDialog(e.errorMsg || e.errorDetail)
		}

	}

	receive = async (e) => {
		if (!this.validate()) {
			return
		}
		utils.gioTrack('jnby_silver_vip_apply_btn')

		this.setState({loading: true})

		/**
		 * 1.登录：旧用户直接登录；新用户自动注册后登录
		 * 2.发券
		 * 3.查找用户信息
		 * 4.记录操作
		 */
		const {mobile, verificationCode} = this.state
		const params = {
			mobile,
			authCode: verificationCode,
			authType: 1,
			appId: 4,
			platform: 'H5'
		}
		let options = {}

		try {
			// 1.登录：旧用户,直接登录；新用户,自动注册后登录
			const loginRes = await login(params)
			if (!loginRes.success) {
				this.setState({loading: false})
				this.showErrorDialog(loginRes.errorMsg || loginRes.errorDetail)
				return
			}

			// 2.发券
			options.headers = {
				'LOCALS-ACCESS-TOKEN': `Bearer ${loginRes.data}`
			}
			const giftRes = await giftPack({mobiles: [mobile], giftPackCode: 'JNBYSILVER'}, options)
			if (!giftRes.success) {
				this.setState({loading: false})
				this.showErrorDialog(giftRes.errorMsg || giftRes.errorDetail)
				return
			}

			// 3.查找用户信息
			const userInfoRes = await queryUserInfoByToken({}, options)
			const userInfo = userInfoRes.data

			// 4.记录操作
			await importStaffs({
				importitems: [{
					name: userInfo.username,
					phone: mobile,
					importer: 'yiqizou',
					remark: ''
				}]
			}, options)

			if (giftRes.data && Array.isArray(giftRes.data.data) && giftRes.data.data.length > 0 &&
				(giftRes.data.data[0].indexOf('您的机会已用过了') > -1 || giftRes.data.data[0].indexOf('您已超过该优惠券的领取次数'))) {
				this.setState({loading: false})
				this.showTipDialog()
				return
			}
			this.setState({loading: false})
			hashHistory.push('/successSilver')
		} catch (e) {
			this.setState({loading: false})
			this.showErrorDialog(e.errorMsg || e.errorDetail)
		}
	}

	backToHome = (e) => {
		e.stopPropagation()
		utils.gioTrack('jnby_silver_vip_back_to_home_btn')
		adapter.navigate({method: 'reLaunch', url: '/pages/index/index'})
	}

	/**
	 * 校验数据合法性
	 */
	validate () {
		const {mobile, verificationCode} = this.state
		if (!/^\d{11}$/.test(mobile)) {
			this.showErrorDialog('手机号格式错误，请重新填写。')
			return false
		}
		if (!/^\d{4}$/.test(verificationCode)) {
			this.showErrorDialog('验证码格式错误，请重新填写。')
			return false
		}
		return true
	}

	showTipDialog () {
		this.setState({
			tipVisible: true
		})
	}

	showErrorDialog (msg) {
		this.setState({
			errorMsg: msg,
			errorVisible: true
		})
		setTimeout(() => {
			this.setState({
				errorVisible: false
			})
		}, 1500)
	}

	closeErrorDialog = (e) => {
		this.closeDialog(e, {
			errorMsg: '',
			errorVisible: false
		})
	}

	closeTipDialog = (e) => {
		this.closeDialog(e, {tipVisible: false})
	}

	closeDialog (e, state) {
		const target = e.target
		if (!target.classList.contains('mask')) {
			return
		}
		this.setState(state)
	}

	render () {
		const {banners, services, isSend, time, loading, errorVisible, errorMsg, introductions, tipVisible, discounts} = this.state
		return (
			<div className="home-container">
				<div className="swiper-container">
					<div className="swiper-wrapper">
						{
							banners.map((item, index) => {
								return (
									<div className="swiper-slide" data-id={index} key={index}>
										<Image className="banner" alt="" src={item}/>
									</div>
								)
							})
						}
					</div>
				</div>

				<img className="book-btn" alt="" onClick={this.backToHome}
				     src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/businessTravel/book-btn.png"/>

				<div className="arc-shaped"
				     src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/businessTravel/arc-shaped.png"/>

				<div className="home-body">
					<div className="discount-title-row">
						<img className="title-img silver-title"
						     src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/jnby/silver-vip-jnby-title.png"
						     alt=""/>
						<i className="silver-vip"></i>
					</div>

					<div className="main-discount-row">
						<div className="main-discount silver-main-discount">
							<div className="main-discount-inner">
								<p className="discount">9.6折</p>
								<p className="discount-name">预定优惠</p>
							</div>
						</div>
						<div className="main-discount silver-main-discount">
							<div className="main-discount-inner">
								<p className="discount">100元</p>
								<p className="discount-name">新人红包</p>
							</div>
						</div>
					</div>

					<div className="service-list">
						{
							services.map((item, index) => {
								return (
									<div className="service-item" key={index}>
										<img className="service-icon" src={item.icon}/>
										<p className="service-name">{item.name}</p>
									</div>
								)
							})
						}
					</div>

					<div className="silver-introduction"></div>

					<div className="user-form silver-user-form">
						<input type="tel" maxLength="11" placeholder="请输入您的手机号" className="input-field"
						       onChange={this.handleMobileChange}/>
						<div className="verification-code-field">
							<input type="tel" maxLength="4" placeholder="请输入验证码" className="verification-code"
							       onChange={this.handleCodeChange}/>
							{isSend ? <span className="count-down">{time}秒</span> :
								<span className="verification-btn" onClick={this.getVerificationCode}>发送验证码</span>}
						</div>
						<div className="silver-receive-btn" onClick={this.receive}></div>
					</div>

					<div className="more-welfare mb-20"></div>
					<div className="discounts">
						{
							discounts.map((item, index) => {
								return (
									<img className="discount-item" key={index} src={item}/>
								)
							})
						}
					</div>

					<h2 className="footer-title">路客精品民宿 2000万年轻人的新选择</h2>

					<div className="introduction-row">
						{
							introductions.map((item, index) => {
								return (
									<img className="intro-item" key={index} src={item}/>
								)
							})
						}
					</div>

					<div className="footer-services">
						<h3 className="footer-services-title">
							八重安心保障
						</h3>
						<div className="footer-services-body"></div>
					</div>
				</div>

				{/*弹窗、loading*/}
				{
					errorVisible &&
					<div className="mask" onClick={this.closeErrorDialog}>
						<div className="error-dialog">
							<p className="error-msg">{errorMsg}</p>
						</div>
					</div>
				}
				{
					tipVisible &&
					<div className="mask" onClick={this.closeTipDialog}>
						<div className="tip-dialog">
							<div className="main-tip silver-main-tip">您已领取过</div>
							<div className="second-tip">赶紧去预订吧</div>
							<div className="back-to-home-btn" onClick={this.backToHome}></div>
						</div>
					</div>
				}
				{
					loading &&
					<div className="mask">
						<img className="loading" alt=""
						     src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/loading.gif"/>
					</div>
				}
			</div>
		);
	}
}
