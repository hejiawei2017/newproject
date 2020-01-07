import React from 'react'
import './assets/css/index.css'
import {copyText} from "../../utils/copy"
import {sendVerificationCode, register, login, sendCouponNewUser, registerMemberInfo} from '../../common/api'
import utils from "../../common/utils";

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			phone: '',
			verificationCode: '',
			errorMsg: '',
			errorVisible: false,
			successVisible: false,
			interval: null,
			time: 60,
			isSend: false,
			loading: false,
			channel: ''
		}
	}

	componentWillMount() {
		// 获取url，并解析
		const url = window.location.href
		const params = utils.parseURL(url).params
		if (params.channel === 'hlqj100') {
			this.setState({channel: params.channel})
		}
	}

	componentWillUnmount() {
		if (this.state.interval !== null) {
			clearInterval(this.state.interval)
		}
	}

	// 获取验证码后倒计时逻辑
	countdown = () => {
		const time = this.state.time
		if (time <= 0) {
			this.setState({
				time: 60,
				isSend: false
			})
			clearInterval(this.state.interval)
			return
		}
		this.setState({
			time: time - 1
		})
	}

	handlePhoneChange = (e) => {
		this.setState({
			phone: e.target.value
		})
	}
	handleCodeChange = (e) => {
		this.setState({
			verificationCode: e.target.value
		})
	}

	receive = (e) => {
		if (!/^\d{11}$/.test(this.state.phone)) {
			const errorMsg = `手机号格式错误，请重新填写。`
			this.showTipDialog(errorMsg)
			return
		}
		if (!/^\d{4}$/.test(this.state.verificationCode)) {
			const errorMsg = `验证码格式错误，请重新填写。`
			this.showTipDialog(errorMsg)
			return
		}
		const params = {
			mobile: this.state.phone,
			authCode: this.state.verificationCode,
			authType: 1,
			appId: 4,
			platform: 'H5'
		}
		this.submit(params)
	}

	showTipDialog(msg) {
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

	copy = () => {
		copyText('Locals路客精品民宿', () => {
			this.showTipDialog('已复制到粘贴板')
		})
	}

	/**
	 * 提交之后帮新用户注册并发放优惠券，旧用户会收到“已领券”提示
	 * @param params
	 */
	submit(params) {
		this.setState({loading: true})
		register(params).then(res => {
			// gio埋点，统计通过齐家网跳转进来活动页，输入电话号码点击领取按钮用户总数
			if (this.state.channel === 'hlqj100') {
				window.gio('track', 'hlqj100All')
			}

			/**
			 * 情况：
			 * 1.注册报错，错误码不为20103【用户已存在】，直接抛错误提示框
			 * 2.注册报错，错误码为20103【用户已存在】，先帮用户自动登录，再发优惠券
			 * 3.注册成功，接口帮用户自动登录，直接发优惠券
			 */
			// 1
			if (!res.success && res.errorCode !== '20103') {
				this.setState({loading: false})
				this.showTipDialog(res.errorMsg)
				return
			}

			// 2
			const {mobile, authCode, appId, platform} = params
			const loginParams = {mobile, authCode, appId, platform}
			const couponParams = {
				phone: mobile,
				userInfo: JSON.stringify({mobile}),
				activity_id: '1907161811164'
			}
			const options = {}
			if (res.errorCode === '20103') {
				login(loginParams).then(resLogin => {
					if (!resLogin.success) {
						this.setState({loading: false})
						this.showTipDialog(resLogin.errorMsg)
						return
					}
					options.headers = {
						'LOCALS-ACCESS-TOKEN': `Bearer ${resLogin.data}`
					}
					/**
					 * 用户登录成功之后，先查询会员资格，无则帮他领取会员资格
					 */
					registerMemberInfo({}, options).then(resMember => {
						if (!resMember.success) {
							this.setState({loading: false})
							return
						}
						this.sendCoupon(couponParams, options)// 发券
					})
				})
				return
			}

			// gio埋点，统计通过齐家网跳转进来活动页，输入电话号码点击领取按钮新注册用户
			if (this.state.channel === 'hlqj100') {
				window.gio('track', 'hlqj100Register')
			}

			// 3
			options.headers = {
				'LOCALS-ACCESS-TOKEN': `Bearer ${res.data}`
			}
			/**
			 * 用户登录成功之后，先查询会员资格，无则帮他领取会员资格
			 */
			registerMemberInfo({}, options).then(resMember => {
				if (!resMember.success) {
					this.setState({loading: false})
					return
				}
				this.sendCoupon(couponParams, options)// 发券
			})
		})
	}

	sendCoupon(params, options) {
		sendCouponNewUser(params, options).then(res => {
			if ((!res.success && res.errorCode === 100004)
				|| res.errorMsg.indexOf('超过该优惠券的领取次数') > -1) {// errorCode=100004【数据已存在】，errorMsg包含超过该优惠券的领取次数，都提示无法重复领取
				this.setState({loading: false})
				this.showTipDialog(`您已经领取过该红包，无法重复领取哦！`)
				return
			}
			if (!res.success) {
				this.setState({loading: false})
				this.showTipDialog(res.errorMsg)
				return
			}
			this.setState({
				loading: false,
				successVisible: true
			})
		})
	}

	closeSuccessDialog = () => {
		this.setState({
			successVisible: false
		})
	}

	getVerificationCode = () => {
		if (!/^\d{11}$/.test(this.state.phone)) {
			const errorMsg = `手机号格式错误，请重新填写。`
			this.showTipDialog(errorMsg)
			return
		}
		const params = {
			mobile: this.state.phone
		}
		sendVerificationCode(params).then(res => {
			if (res.success) {
				this.setState({
					isSend: true,
				})
				this.setState({
						interval: setInterval(() => {
							this.countdown()
						}, 1000)
					}
				)
			}
		})
	}

	render() {
		const {errorVisible, errorMsg, successVisible, time, isSend, loading} = this.state
		return (
			<div className="tik-tok-container">
				<div className="header">
					<div className="header-title1">新人红包</div>
					<div className="header-title2">首单立减</div>
					<div className="header-title3">覆盖全球 65+ 城市 超 15000+套个性民宿</div>
				</div>
				<div className="red-packet">
					<input type="tel" maxLength="11" placeholder="请输入手机号" className="input-field"
					       onChange={this.handlePhoneChange}/>
					<div className="verification-code-field">
						<input type="tel" maxLength="4" placeholder="请输入验证码" className="verification-code"
						       onChange={this.handleCodeChange}/>
						{isSend ? <span className="count-down">{time}秒</span> :
							<i className="verification-btn" onClick={this.getVerificationCode}></i>}
					</div>
					<div className="receive-btn" onClick={this.receive}></div>
				</div>
				<i className="coin-icon"></i>
				<div className="explain">活动解释权归路客民宿所有</div>
				{
					errorVisible &&
					<div className="tip-dialog">
						{errorMsg}
					</div>
				}
				{
					successVisible &&
					<div className="mask">
						<div className="success-dialog">
							<div className="success-dialog-title">
								<h3 className="title">恭喜您</h3>
								<h3 className="title">获得100元红包</h3>
							</div>
							<p className="success-dialog-content">点击下方按钮可复制“Locals路客精品民宿”，在微信搜索框粘贴该信息，打开路客精品民宿小程序，在“我的-我的钱包-优惠券”即可查看。</p>
							<div className="copy-btn" onClick={this.copy}></div>
							<i className="close-btn" onClick={this.closeSuccessDialog}></i>
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
		)
	}
}

export default App

