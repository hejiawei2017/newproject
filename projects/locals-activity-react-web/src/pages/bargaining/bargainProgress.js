import React from "react";
import CountDown from '../../components/CountDown/CountDown'
import ActivityProgress from '../../components/Progress/ActivityProgress'
import './assets/bargain-progress.css'
import {hashHistory} from 'react-router';
import adapter from "../../common/adapter";
import {sendCouponActivity, bargainPrice} from "../../common/api";
import deploy from './deploy'
import utils from "../../common/utils";

class BargainProgress extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			hadBargain: false
		}
	}

	componentDidMount () {
		this.setHadBargain(this.props)
	}

	componentWillReceiveProps (nextProps, nextContext) {
		this.setHadBargain(nextProps)
	}

	setHadBargain (props) {
		const {orderId, isHelper} = props
		const hadBargain = this.findBargainOrderId(orderId) && isHelper // 订单ID在已帮砍订单数组中且当前用户是帮砍人，当前砍价订单的已帮砍状态为true
		this.setState({hadBargain})
	}

	bargain = async (e) => {
		utils.gioTrack('bargain_help_bargain_btn')

		this.props.changeParentState({
			loading: true
		})

		const {token, userInfo, userId, orderId, createrId} = this.props
		const params = {
			orderId,
			createrId,
			helperId: userId,
			helperInfo: userInfo
		}
		const options = {
			headers: {
				'LOCALS-ACCESS-TOKEN': `Bearer ${token}`
			}
		}
		const bargainRes = await bargainPrice(params, options)
		if (!bargainRes.success) {
			this.props.changeParentState({
				hadReceivedCoupon: true,
				visibleBargainErrorDialog: true,
				errorMsg: '您已为好友砍价过请勿重复砍价',
				loading: false
			})
			return
		}

		this.addBargainOrderId(orderId) // 帮砍成功后，存储已帮砍订单ID。已帮砍订单，不再显示“帮砍”按钮，显示“帮助分享”按钮

		this.sendCoupon(bargainRes.data.bprice)

		/**
		 * 重新查询详情
		 */
		this.props.refreshBargainInfo({orderId, createrId})
	}

	sendCoupon (amount) {
		const {token, userInfo} = this.props
		const params = {
			phone: userInfo.mobile,
			userInfo: JSON.stringify(userInfo),
			activity_id: deploy.activity_id
		}
		const options = {
			headers: {
				'LOCALS-ACCESS-TOKEN': `Bearer ${token}`
			}
		}
		sendCouponActivity(params, options).then(res => {
			if ((!res.success && res.errorCode === 100004)
				|| res.errorMsg.indexOf('超过该优惠券的领取次数') > -1) {// errorCode=100004【数据已存在】，errorMsg包含超过该优惠券的领取次数，都提示无法重复领取
				this.props.changeParentState({
					amount,
					hadReceivedCoupon: true,
					visibleBargainSuccDialog: true,
					loading: false
				})
				return
			}
			if (!res.success) {
				this.props.changeParentState({
					hadReceivedCoupon: false,
					visibleBargainErrorDialog: true,
					errorMsg: '系统错误，请稍后重试',
					loading: false
				})
				return
			}
			this.props.changeParentState({
				amount,
				hadReceivedCoupon: false,
				visibleBargainSuccDialog: true,
				loading: false
			})
		}).catch(error => {
			this.props.changeParentState({
				hadReceivedCoupon: false,
				visibleBargainErrorDialog: true,
				errorMsg: '系统错误，请稍后重试',
				loading: false
			})
		})
	}

	addBargainOrderId (orderId) {
		const bargainOrderIdsStr = window.localStorage.getItem('bargainOrderIds')
		const bargainOrderIds = bargainOrderIdsStr === null ? [] : JSON.parse(bargainOrderIdsStr)
		if (bargainOrderIds.includes(orderId)) {
			return
		}
		bargainOrderIds.push(orderId)
		window.localStorage.setItem('bargainOrderIds', JSON.stringify(bargainOrderIds))
	}

	findBargainOrderId (orderId) {
		const bargainOrderIdsStr = window.localStorage.getItem('bargainOrderIds')
		const bargainOrderIds = bargainOrderIdsStr === null ? [] : JSON.parse(bargainOrderIdsStr)
		return bargainOrderIds.includes(orderId)
	}

	joinIn = (e) => {
		utils.gioTrack('bargain_join_in_btn')
		hashHistory.push('/')
	}

	share = (e) => {
		utils.gioTrack('bargain_share_friends_btn')
		const {createrId, orderId} = this.props
		const path = encodeURIComponent(`act1908011111356?o=${orderId}&ci=${createrId}`)
		const pages = `/pages/h5/index?url=${path}`
		adapter.skipToPoster({
			title: `帮我点一下，都可以拿奖金`,
			path: `${pages}`,
			imageUrl: `https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/bargaining/bargain-poster.jpg`
		});
	}

	render () {
		const {endTime, progress, type, isEndBargainOrder} = this.props
		const {hadBargain} = this.state
		return (
			<div className="bargaining-progress-container">
				<h3 className="progress-title">
					{
						type === 'share' && `邀请好友砍价得免单`
					}
					{
						type === 'bargain' && `帮助好友砍价可得¥100红包`
					}
				</h3>
				<div className="bargaining-count-down">
					{!isEndBargainOrder && <CountDown endTime={endTime}></CountDown>}
					{isEndBargainOrder && <p className="bargain-end">活动已结束</p>}
				</div>
				<div className="amount-row">
					已砍
					<span className="amount">{progress.bargainingAmount}</span>
					元，还差
					<span className="amount">{progress.remainingAmount}</span>
					元
				</div>
				<ActivityProgress percent={progress.percent} showInfo={progress.showInfo}
				                  successPercent={progress.successPercent}/>
				{type === 'share' && <div className="share-btn tada" onClick={this.share}></div>}
				{type === 'bargain' &&
				<div className="btn-row">
					{/*帮助人已经帮砍过的订单，显示“帮助分享”按钮*/}
					{hadBargain &&
					<div className="share-btn-sm" onClick={this.share}></div>
					}
					{/*帮助人未帮砍过的订单，显示“帮砍”按钮*/}
					{!hadBargain &&
					<div className="bargain-btn" onClick={this.bargain}></div>
					}
					<div className="join-in-btn" onClick={this.joinIn}></div>
				</div>
				}
			</div>
		)
	}
}

export default BargainProgress
