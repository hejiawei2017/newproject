import React from "react";
import ScrollList from './scrollList'
import BargainBuddy from './bargainBuddy'
import BargainProgress from './bargainProgress'
import BargainHeader from './bargainHeader'
import RuleDialog from './ruleDialog'
import moment from 'moment'
import './assets/index.css'
import Result from "./result";
import SuccessDialog from "./successDialog"
import ErrorDialog from "./errorDialog"
import adapter from "../../common/adapter"
import utils from "../../common/utils";
import {players} from './players'
import {queryUserInfoByToken, queryBargainDetail, queryBargainFriends} from '../../common/api'

/*活动主页面*/
class ActivityPage extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			orderId: '', // 订单id
			token: '',
			userInfo: null,
			userId: '', // 当前页面操作人id
			createrId: '', // 此砍价订单活动页面的创建人id
			isHelper: false, // 当createrId和userId存在，且不相等的时候，就是帮助人在帮创建人砍价
			endTime: null,
			progress: {
				percent: 0,
				remainingAmount: 0,
				bargainingAmount: 0,
				showInfo: true
			},
			amount: 0,// 本次好友帮砍的金额
			visibleRuleDialog: false,
			visibleBargainSuccDialog: false,
			visibleBargainErrorDialog: false,
			errorMsg: '您已为好友砍价过，请勿重复砍价',
			loading: false,
			hadReceivedCoupon: false, // 是否已经领取过100元新人优惠券
			type: 'share', // share模式显示"分享给好友"按钮；bargain模式显示"砍价"和"我也想参加"按钮;
			isEndBargainOrder: false,// 当前砍价订单活动是否已结束
			allPlayer: players,
			friends: []
		}
	}

	async componentDidMount () {
		// 获取url，并解析
		const url = window.location.href
		const params = utils.parseURL(url).params
		// 无token的一律要跳转去登录，一进入砍价活动主页面，就必须登录。
		if (!params.token) {
			adapter.signIn()
			return
		}
		if (!params.o) {
			alert('错误：查询不到合法的订单ID')
			return
		}
		// 记录订单id、创建人id
		const orderId = params.o
		this.setState({orderId, token: params.token})
		let createrId = ''
		if (params.ci) {
			createrId = params.ci
		}

		/**
		 * 初始化
		 */
		try {
			const userInfo = await this.initShowType(params.token, createrId)
			const userId = createrId || userInfo.id // 如果有创建人id，则此砍价订单是创建人创建的，无则是本人创建的
			this.setState({createrId: userId})
			await this.refreshBargainInfo({orderId, createrId: userId})
		} catch (e) {
			console.log(`e:${JSON.stringify(e)}`)
		}
	}

	/**
	 * 初始化砍价活动详情
	 */
	async initBargainDetail ({orderId, createrId}) {
		const detailRes = await queryBargainDetail({orderId, createrId})
		const detail = detailRes.data
		const percent = detail.total_price > 0 ? parseInt(detail.bargain_price / detail.total_price * 100) : 0
		const remainingAmount = (detail.total_price * 100 - detail.bargain_price * 100) / 100
		this.setState({
			progress: {
				percent,
				remainingAmount,
				bargainingAmount: detail.bargain_price,
				showInfo: true
			},
			endTime: moment(detail.end_time)
		})

		// 当前砍价订单活动是否已结束
		if (detail.total_price === detail.bargain_price || moment().diff(detail.end_time) > 0) {
			this.setState({
				isEndBargainOrder: true
			})
		}
	}

	/**
	 * 初始化帮助砍价的好友
	 */
	async initFriends (orderId) {
		const friendsRes = await queryBargainFriends(orderId)
		const friends = friendsRes.data
		this.setState({
			friends: friends.map(e => {
				return {
					avatarUrl: e.helper_info.avatar,
					nickName: e.helper_info.nickName,
					bargainPrice: e.bargain_price
				}
			})
		})
	}

	refreshBargainInfo = async ({orderId, createrId}) => {
		await this.initBargainDetail({orderId, createrId})
		await this.initFriends(orderId)
	}

	/**
	 * 初始化显示类型（此处只处理bargain和share类型）
	 *  1.点别人的分享页进来的，是帮助人(有userId，有createrId，userId!==createrId)，则type=bargain,isHepler=true
	 *  2.从订单结算页跳转过来的，是本人（有userId，无createrId，userId!==createrId），则type=share,isHepler=false
	 *  3.点自己的分享页进来的，是本人（有userId，有createrId，userId===createrId），则type=share,isHepler=false
	 */
	async initShowType (token, createrId) {
		const userInfoRes = await queryUserInfoByToken({}, {
			headers: {
				'LOCALS-ACCESS-TOKEN': `Bearer ${token}`
			}
		})
		const userInfo = userInfoRes.data

		const userId = userInfo.id
		if (createrId !== '' && userId !== createrId) {
			this.setState({
				userId,
				userInfo,
				type: 'bargain',
				isHelper: true
			})
			return Promise.resolve(userInfo)
		}
		if (
			(createrId === '' && userId !== createrId)
			|| (createrId !== '' && userId === createrId)
		) {
			this.setState({
				userId,
				userInfo,
				type: 'share'
			})
		}
		return Promise.resolve(userInfo)
	}

	changeState = (state) => {
		this.setState(state)
	}

	showRuleDialog = () => {
		this.setState({
			visibleRuleDialog: true
		})
	}

	render () {
		const {
			endTime, progress, friends, allPlayer, visibleRuleDialog, type, amount,
			orderId, userId, userInfo, token, isHelper, visibleBargainSuccDialog, visibleBargainErrorDialog,
			errorMsg, loading, hadReceivedCoupon, createrId, isEndBargainOrder
		} = this.state
		const progressConfig = {
			endTime,
			progress,
			type,
			userId,
			orderId,
			userInfo,
			token,
			createrId,
			isEndBargainOrder,
			isHelper
		}
		return (
			<div className="bargaining-container">
				{/*头图*/}
				<BargainHeader showRuleDialog={this.showRuleDialog}></BargainHeader>
				<div className="all-container">
					{/*砍价进度框*/}
					{
						((type === 'share' && !isEndBargainOrder) || type === 'bargain') &&
						<BargainProgress {...progressConfig} changeParentState={this.changeState}
						                 refreshBargainInfo={this.refreshBargainInfo}></BargainProgress>
					}
					{/*砍价结果框*/}
					{
						(type === 'share' && isEndBargainOrder) &&
						<Result amount={progress.bargainingAmount} isHelper={isHelper}></Result>
					}
					{/*砍价好友*/}
					<BargainBuddy isHelper={isHelper} friends={friends}></BargainBuddy>
					{/*大家都在玩*/}
					<ScrollList players={allPlayer}></ScrollList>
				</div>
				{visibleRuleDialog && <RuleDialog changeParentState={this.changeState}/>}
				{visibleBargainSuccDialog && <SuccessDialog amount={amount} hadReceivedCoupon={hadReceivedCoupon}
				                                            changeParentState={this.changeState}/>}
				{visibleBargainErrorDialog &&
				<ErrorDialog errorMsg={errorMsg} changeParentState={this.changeState}></ErrorDialog>
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

export default ActivityPage;
