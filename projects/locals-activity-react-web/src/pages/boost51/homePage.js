/*GLOBAL location */
import React from 'react';
// import { browserHistory } from 'react-router';
import axios from 'axios';
import adapter from '../../common/adapter';
import HouseList from '../../components/HouseListBoost/HouseList';
import './index.css';
import utils from '../../common/utils';
import { statisticsEvent, statisticsJoin, getCoupon } from '../../common/api'
import EnvConfig from '../../config/env-config'
const Host = EnvConfig.envConfig.apiBoost;
// const Host = "http://tp.localhome.cn:9999/api"
const UserHost = EnvConfig.envConfig.api;
const houseInfo = require('./boost.json');
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user_id: '',
			reEntry: "1",
			houseList: [],
			nowTab: 'item1',
			discount: 0.3,
			token: '',
			phone: '',
			showModel: false,
			ruleVisible: false,
			resultVisible: false,
			errorVisible: false,
			modelMsg: '恭喜您获得8折优惠券',
			move: {},
			isTurned: true,
			openTips: false,
			channel: '',
			visible: false,
			curTicketIndex: 0,
			houseListData: [],
			houseTicketData: [],
			panicVisible: false,
			lastResult: "",
			tabDataInfo: [{
				name: "亲子必买", 
				type: "item1"
			},{ 
				name: "浪漫美宿",
				type: "item2"
			}, { 
				name: "舒适度假",
				type: "item3"
			}, { 
				name: "网红打卡",
				type: "item4"
			}]
		};
		this.container = null;
	}
	componentWillMount() {
		// // 获取数据
		this.getData();
		// 获取url，并解析
		const that = this
		const url = window.location.href;
		// 如果有channel，进行记录
		if (utils.parseURL(url).params.channel) {
			const channel = utils.parseURL(url).params.channel;
			that.setState({ channel });
		}
		// 判断url中是否有token，有则判断为已登录状态，将token进行存储
		if (utils.parseURL(url).params.token) {
			const token = utils.parseURL(url).params.token;
			that.setState({ token });
			// 获取phone
			that.getphone(token)
		}
		// 判断url中是否有reEntry，如果有的话正常跳转
		if (utils.parseURL(url).params.r) {
			const reEntry = utils.parseURL(url).params.r;
			that.setState({ reEntry });
			// 获取phone
		}
	}
	componentDidMount() {
		window.addEventListener('scroll', this.onScrollHandle.bind(this));
		const that = this;
		const {tabDataInfo} = this.state;
		tabDataInfo.forEach((item, index)=>{
			item.is_active = false;
			if(index === 0) {
				item.is_active = true;
				this.setState({
					nowTab: item.type
				})
			}
		})
		this.setState({
			tabDataInfo
		})
		axios.get(`https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/dataHouse.json`,{
			params:{  
				timestamp: new Date().getTime()
			}
		})
		.then(function (response) {
			if(response.data) {
				that.setState({
					houseListData: response.data.houseSource,
					houseTicketData: response.data.houseTicket,
					shopItems: response.data.shopItems,
					lastResult: response.data.lastResult ? response.data.lastResult : "",
				})
			} else{
				that.setState({
					houseListData: [],
					houseTicketData: [],
					shopItems: [],
					lastResult: ""
				})
			}	
		})
		.catch(function (err){
			
		})
	}
	onScrollHandle = (event) => {
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		const { curFix } = this.state;
		const height = 183 * 3;
		const curNum = curFix + height;
		if (scrollTop >= curFix && scrollTop < curNum) {
			this.setState({
				curTicketIndex: 0
			})
		}
		else if (scrollTop >= curNum && scrollTop < (curNum + height)) {
			this.setState({
				curTicketIndex: 1
			})
		} else if (scrollTop >= (curNum + height) && scrollTop < curNum + (2 * height)) {
			this.setState({
				curTicketIndex: 2
			})
		} else if (scrollTop < curNum) {
			this.setState({
				curTicketIndex: 0
			})
		}
	}
	getWinnerResult = () => {
		let that = this;
		axios.get(`${Host}/report/index/previousPeriod`, {params:{
			activity_id: "1904222209237",
			payload: that.state.user_id
		}}).then((response)=>{
			if(response.data.success) {
				let resultVisible = true;
				this.setState({
					resultSuc: 6,
					resultVisible: resultVisible
				})
			} 
		}).catch(err=>{
			console.log(err,"err")
		})
	} 
	// 获取phone
	getphone(token) {
		const that = this
		axios
			.get(`${UserHost}/platform/user/user-info-detail`, {
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json; charset=UTF-8',
					'LOCALS-ACCESS-TOKEN': 'Bearer ' + token
				}
			})
			.then(function (response) {
				// token无效去登陆
				if (response.data.errorCode === "20113") {
					adapter.signIn();
					return
				}
				// 有token且有效
				if (response.data.data.platformUser) {
					const phone = response.data.data.platformUser.mobile
					const user_id = response.data.data.platformUser.id
					// 存储phone,id
					that.setState({
						phone,
						user_id
					})
					// 判断是否有过抽奖，将isturned设为true
					try {
						const _phone = localStorage.getItem(phone)
						if (_phone && _phone === '1') {
							that.setState({ isTurned: true })
						}
					} catch (error) {
						console.log(error)
					}
					that.reportingJoin()
				} else {
					that.setState({
						modelMsg: '网络错误，请稍后再试！',
						showModel: true,
					})
					setTimeout(() => { that.setState({ showModel: false }) }, 3000)
				}
			})
			.catch(function (error) {
				that.setState({
					modelMsg: '网络错误，请稍后再试！',
					showModel: true,
				})
				setTimeout(() => { that.setState({ showModel: false }) }, 3000)
			});
	}
	// 获取优惠券
	getCoupon() {
		const that = this
		const phone = {
			master_uuid: that.state.phone
		}
		const _data = {
			activity_id: "1904102011314",
			payload: JSON.stringify(phone)
		}
		getCoupon(_data).then((res) => {
			if (res.success) {
				that.setState({
					showModel: true,
					isTurned: true
				})
				// 上报统计
				if (that.state.channel !== '') { that.reporting() }
				// 存下phone在storage
				const localstroage = window.localStorage;
				localstroage.setItem(that.state.phone, 1);
			} else {
				if (res.errorCode === 100004) {
					that.setState({
						modelMsg: '您已获得优惠，赶紧预订吧！',
						showModel: true,
						isTurned: true
					})
					const localstroage = window.localStorage;
					localstroage.setItem(that.state.phone, 1);
				} else {
					that.setState({
						modelMsg: '抽取失败，请重试',
						showModel: true,
						isTurned: false,
					})
				}
			}
			setTimeout(() => { that.setState({ showModel: false }) }, 3000)
		}).catch(function (error) {
			console.log(error);
		});
	}
	// 上报领券信息
	reporting() {
		const _data = {
			user_id: this.state.user_id,
			event: 'attend',
			share_user: this.state.channel,
			activity_name: 'zhuhai20190409',
		}
		statisticsEvent(_data).then(res => { console.log(res) })
	}
	// 上报进入信息
	reportingJoin() {
		const _data = {
			ticket_id: 'zhuhai20190409',
			share_user_id: this.state.channel,
			join_user_id: this.state.user_id
		}
		statisticsJoin(_data).then(res => { console.log(res) })
	}
	// 获取数据
	getData(type) {
		const that = this;
		const _type = type || this.state.nowTab
		let _data = [];
		for (let i = 0; i < houseInfo.length; i++) {
			if (_type === houseInfo[i].type) {
				_data = houseInfo[i].ids;
			}
		}
		if (_data === []) {
			return;
		}
		axios
			.post(`${UserHost}/prod-plus/activity/20190409/house`, _data)
			.then(function (response) {
				if (response.data.success) {
					const data = response.data.data;
					that.setState({
						houseList: data,
					});
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	// 关闭model
	closeModel() {
		this.setState({ showModel: false })
	}
	// 改变tab
	changeTab(type) {
		this.setState({
			nowTab: type,
		});
		this.getData(type);
	}
	// 打开规则说明
	openTip() {
		this.setState({ openTips: true })
	}
	closeRuleTip() {
		this.setState({ openTips: false })
	}
	clearClick(e) { e.stopPropagation() }
	// 转跳逻辑
	jumpPage(url) {
		adapter.navigate({ url: `/pages/${url}/index?channel=zhuhai01` });
	}
	entryShare = (item) => {
		if (!this.state.token) {   //先登录
			adapter.signIn();
			return
		}
		if(item.open !== "true") {
			return;
		}
		let path,
		shareOptionUrl;
			// eslint-disable-next-line no-restricted-globals
		path = encodeURIComponent(`${location.origin}${location.pathname}#/sharePage?r=${this.state.reEntry}&d=${item.dataIndex}`);
			// eslint-disable-next-line no-restricted-globals
		shareOptionUrl = encodeURIComponent(`${location.origin}${location.pathname}#/sharePage?r=${2}&i=${this.state.user_id}`);
		adapter.navigate({ url: `/pages/h5/index?url=${path}&shareOption=1&shareOptionUrl=${shareOptionUrl}` });
	}
	showRule = () => {
		this.setState({
			visible: true
		})
	}
	closeModel = () => {
		this.setState({
			visible: false
		})
	}
	affChange = (affixed) => {
		console.log(affixed, "affixed")
		let scrollTop = 0;
		if (affixed) {
			scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
			this.setState({
				curFix: scrollTop
			})
		}
	}

	closeRuleModel = () => {
		this.setState({
			ruleVisible: false
		})
	}
	closeResultModel = (e) => {
		e.stopPropagation();
		this.setState({
			resultVisible: false
		})
	}
	activityRule = () => {
		this.setState({
			ruleVisible: true
		})
	}
	entryOffer = (e) => {  //领券
		e.stopPropagation();
		adapter.navigate({ url: `/pages/coupon/index` });
	}
	winnerResult = () => {
		if (!this.state.token) {   //先登录
			adapter.signIn()
			return
		}
		this.getWinnerResult();	
	}

	selectTab = (dataIndex) => {
		console.log(dataIndex,"dataIndex")
		const {tabDataInfo} = this.state;
		tabDataInfo.forEach((item,index)=>{
			if(dataIndex === index) {
				item.is_active = true;
				this.setState({
					nowTab: item.type
				})
				this.getData(item.type);
			}else {
				item.is_active = false;
			}
		})
		this.setState({
			tabDataInfo
		})
	}

	buyNow = (item) => {
		if (!this.state.token) {   //先登录
			adapter.signIn();
			return
		}
		let that = this;
		axios
		.put(`${Host}/report/index/receive_coupon`, {
			activity_id: "1904222209237",
			payload: that.state.user_id+'|'+item.ID
		})
		.then(function (response) {
			if (response.data.success) {
				that.setState({
					resultSuc: 2,
					resultVisible: true
				})
			} 
			else {
				that.setState({
					resultSuc: 2,
					resultVisible: true
				})
			}
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	closePanicTip = () => {
		this.setState({
			panicVisible: false
		})
	}

	closeErrorTip = () => {
		this.setState({
			errorVisible: false
		})
	}

	renderModal = () => {
		let resultVisible = this.state.resultVisible
		let resultSuc = this.state.resultSuc 
		let modalDom;
		switch (resultSuc) {
			case 0:  
			modalDom = (
				<div className="model resultNo">
					<div>
						<div className="model_text">
						</div>
						<img className="bg" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E8%8E%B7%E5%BE%97%E8%B5%84%E6%A0%BC%E5%BC%B9%E7%AA%97.png" alt=""/>
					</div>
					<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E5%85%B3%E9%97%AD.png" className="backBtn" onClick={this.closeResultModel.bind(this)} alt='' />
				</div>
			)
			break;
			case 1:  
			modalDom = (
				<div className="model resultSuc">
					<div>
						<div className="model_text">
							<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E6%8C%89%E9%92%AE%20%E6%8B%B7%E8%B4%9D.png" alt=""/>
						</div>
						<img className="bg" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E4%BB%8A%E6%97%A5%E5%B7%B2%E6%8A%A2%E5%AE%8C.png" alt=""/>
					</div>
					<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E5%85%B3%E9%97%AD.png" className="backBtn" onClick={this.closeResultModel.bind(this)} alt='' />
				</div>
			)
			break;
			case 2:  
			modalDom = (
				<div className="model resultSuc">
					<div>
						<div className="model_text"  onClick={  (e) => { this.entryOffer(e) } }>
							<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E6%8C%89%E9%92%AE%20%E6%8B%B7%E8%B4%9D.png" alt=""/>
						</div>
						<img className="bg" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost/%E4%BB%8A%E6%97%A5%E5%B7%B2%E6%8A%A2%E5%AE%8C.png" alt=""/>
					</div>
					<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E5%85%B3%E9%97%AD.png" className="backBtn" onClick={this.closeResultModel.bind(this)} alt='' />
				</div>
			)
			break;
			default:
			modalDom = (
				<div className="model resultSuc lastResult">
					<div>
						
						<div className="resultSucBox">
							<div className="model_text">
								<div className="resultList" >{ this.state.lastResult}</div>
							</div>
							<img className="bg" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/WechatIMG94.png" alt=""/> 
						</div>
					</div>
					<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E5%85%B3%E9%97%AD.png" className="backBtn" onClick={this.closeResultModel.bind(this)} alt='' />
				</div>
			)
			break;
		}

		return resultVisible && <div className='ruleTips' onClick={this.closeResultModel.bind(this)}>
			{modalDom}
		</div>
	}

	render() {
		const { houseListData = [], houseTicketData, tabDataInfo } = this.state;
		const self = this;
		return (
			<div className='app' id="app" >
			
				<div className="pageBox">
					<img className="headBoxImage" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/homePage.png" alt='' />
				</div>
				<div className="fixedBox">
					<div className="fixedBoxItem" onClick={this.activityRule}>
						<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E6%B4%BB%E5%8A%A8%E8%A7%84%E5%88%99.png" alt="" />
					</div>
					<div className="fixedBoxItem" onClick={this.winnerResult}>
						<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E8%8E%B7%E5%A5%96%E7%BB%93%E6%9E%9C.png" alt="" />
					</div>
				</div>
				<div className="homePage" >
					<div className="panic_section">
						<div className="panicTitle">
							<p className="weightTitle"><span className="line"></span>·<span className="mainTitle">预留珍稀美宿 邀好友0元住</span>·<span className="line"></span></p>
							<p className="subTitle">4.25-5.4日 每晚10:00准点开抢</p>
						</div>
						<div className="renderImage">
							{
								houseListData.map((item, index) => {
									return (
										<div className="headBox" key={index} onClick={function(){ self.entryShare(item) } }>
											<img className="headBoxImage" src={item.imgUrl} alt='' />
											<div className="topBar">
												<div className="top">TOP</div>
												<div className="num">{`0${index+1}`}</div>
											</div>
										</div>
									)
								})
							}
						</div>
					</div>
					{/* 抢券 */}
					<div className="panic_section">
						<div className="panicTitle">
							<p className="weightTitle"><span className="line"></span>·<span className="mainTitle">网红城市有房 抢1-5折神券</span>·<span className="line"></span></p>
							<p className="subTitle">4.25-5.4日 每晚10:00准点开抢</p>
						</div>
						<div>
							<div className="panic_ticket" ref={(node) => { this.container = node }}>
								{
									houseTicketData.map((item, index) => {
										return (
											<div className="headBox" key={index} onClick={function(){self.buyNow(item)}}>
												<img className="headBoxImage" src={item.imgUrl} alt='' />
											</div>
										)
									})
								}
							</div>
						</div>
					</div>
				</div>
				<div className="house_section">
					<div className="panicTitle">
						<p className="weightTitle"><span className="line"></span>·<span className="mainTitle">五一爆款民宿 正在热抢中</span>·<span className="line"></span></p>
						<p className="subTitle">先领券，再预定</p>
					</div>
					<div className="tab_section">
						<div className="tab_card">
							{
								tabDataInfo.map((item, index) => {
									return <div key={index} className={`tab_card_item ${item.is_active === true && 'active'}`}  onClick={()=>{ this.selectTab(index) }}>{item.name}</div>
								})
							}
						</div>
					</div>
					<HouseList
						houseList={this.state.houseList}
						discount={this.state.discount}
						isTurned={this.state.isTurned}
					/>
				</div>
	
				{	
					this.state.panicVisible &&
					<div className='ruleTips' onClick={this.closePanicTip.bind(this)}>
						<div className="model panic">
							<div className="resultSucBox"  onClick={  (e) => { this.entryOffer(e) } }>
								<img className="bg" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E6%8A%A2%E5%88%B8%E6%88%90%E5%8A%9F.png" alt=""/> 
								<div className="model_text">
									<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E6%8C%89%E9%92%AE%20%E6%8B%B7%E8%B4%9D.png" alt=""/>
								</div>
							</div>
							<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E5%85%B3%E9%97%AD.png" className="backBtn" onClick={this.closePanicTip.bind(this)} alt='' />
						</div>
					</div>
				}

				{	
					this.state.errorVisible &&
					<div className='ruleTips' onClick={this.closeErrorTip.bind(this)}>
						<div className="model error" >
							<img className="bg" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/WechatIMG88.png" alt=""/> 
							<div className="model_text" >
								<div>{this.state.errorMsg}</div>
							</div>
							<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E5%85%B3%E9%97%AD.png" className="backBtn" onClick={this.closeErrorTip.bind(this)} alt='' />
						</div>
					</div>
				}
				{
					this.state.ruleVisible &&
					<div className='ruleTips' onClick={this.closeRuleModel.bind(this)}>
						<div className="model rule">
						<img className="bg" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E6%A0%87%E9%A2%98%20%E6%8B%B7%E8%B4%9D.png" alt=""/> 
							<div className="model_text">
								{
									<div className="auto_dialog">
										<p>活动规则：</p>
										<p>一、预留珍稀美宿，邀好友0元住</p>
										<p>1.活动时间：4.25-5.4</p>
										<p>2.活动对象：新老用户，活动期间每人每天仅限参与一次活动</p>
										<p>3.优惠可享入住时间：4.25-5.31</p>
										<p>4.参与方式：用户可在微信小程序的活动页参与邀请好友抢0元住，每天限量房源参与0元住活动。用户通过分享活动页的方式，邀请好友助力，每天22点开始到次日21点结算，每个房源邀请人数分别最多的用户可以获得该房源的1晚免单资格，所有用户在参与活动结束时均可获得50元无门槛和满1000减120元，邀请好友数量可以在邀请页面的排行榜查询</p>
										<p>5.获奖结果：获奖结果可以在活动主页面的浮窗“获奖结果”上查看，获奖用户会有工作人员主动进行联系，也可以到微信公众号“Locals路客精品民宿”留言</p>
										<p>二、网红城市有房，抢1-5折神券</p>
										<p>1.活动时间：4.25-5.4</p>
										<p>2.优惠可用时间：4.25-5.4</p>
										<p>3.参与方式：活动页面每天22点限量发放优惠券，用户每人每天每种优惠券限领一张，若优惠券发放完毕，则显示已领完，用户仍可获得50元无门槛和满1000减120元（非节假日使用）</p>
										<p>4.优惠券使用方式以实际发放为准</p>
										<p>三、五一爆款民宿，正在热抢中</p>
										<p>房源展示价格为优惠券后最低价格，实际价格以商品页为准</p>
										<p>*本活动最终解释权归路客所有`</p>
									</div>
								}
							</div>
							<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E5%85%B3%E9%97%AD.png" className="backBtn" onClick={this.closeRuleModel.bind(this)} alt='' />
						</div>
					</div>
				}
				{this.renderModal()}
			</div>
		);
	}
}

export default App;
