import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import adapter from '../../common/adapter';
import './index.css';
import utils from '../../common/utils';
import { statisticsEvent, statisticsJoin, getCoupon } from '../../common/api'
import moment from 'moment'
import EnvConfig from '../../config/env-config'
const Host = EnvConfig.envConfig.apiBoost;
// const Host = "http://tp.localhome.cn:9999/api"
const UserHost = EnvConfig.envConfig.api;
const houseInfo = require('./boost.json');
class App extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			btnVisible: true,
			houseList: [],
			nowTab: 'item1',
			discount: 0.8,
			token: '',
			phone: '',
			showModel: false,
			modelMsg: '恭喜您获得8折优惠券',
			move: {},
			isTurned: false,
			openTips: false,
			channel: '',
			scene: '',
			avatar: '',
			timeObj: {
				h: '00',
				m: '00',
				s: '00'
			},
			end_time: '',
			reEntry: "1",
			houseListData: [],
			houseTicketData: [],
			friendsList: [],
			curData: {},
			curUserInfo: {},
			curTime: '',
			myOrder: '',
			sucVisible: false,
			errorVisible: false,
			resultVisible: false,
			leaderboard: []
		};
		this.timer = null;
	}
	componentWillMount() {
		// // 获取url，并解析
		const that = this
		const url = window.location.href;
		// 如果有channel，进行记录
		if (utils.parseURL(url).params.channel) {
			const channel = utils.parseURL(url).params.channel;
			that.setState({channel});
		}
		// 判断url中是否有token，有则判断为已登录状态，将token进行存储
		if (utils.parseURL(url).params.token) {
			const token = utils.parseURL(url).params.token;
			that.setState({token});
			//   获取phone
			that.getphone(token)
		}
		if (utils.parseURL(url).params.scene) {
			const scene = utils.parseURL(url).params.scene;
			that.setState({scene});
		}
		if (utils.parseURL(url).params.r) {
			const reEntry = utils.parseURL(url).params.r;
			
			that.setState({reEntry});
		}
		if (utils.parseURL(url).params.d) {
			const curIndex = utils.parseURL(url).params.d;
			that.setState({curIndex});
		}
		if (utils.parseURL(url).params.i) {
			const shareInfo = utils.parseURL(url).params.i;
			that.setState({shareInfo});
		}
	}
	async componentDidMount () {
		let user_id;
		const url = window.location.href;
		if (utils.parseURL(url).params.token) {  //有权限
			const token = utils.parseURL(url).params.token;
			try {
				this.initTime();
				let promise = axios.get(`${UserHost}/platform/user/user-info-detail`, {
					headers: {
						'Accept': 'application/json, text/plain, */*',
						'Content-Type': 'application/json; charset=UTF-8',
						'LOCALS-ACCESS-TOKEN': 'Bearer ' + token
					}
				})
				let response = await promise;
				user_id = response.data.data.platformUser.id				
			} catch (err) {
				console.log(err)
			}
		}
		this.getAllInfo(user_id);  //获取全部信息
		this.getShareData();
	}
	componentWillUnmount () {
		clearInterval(this.timer)
	}
	getShareData = () => { //获取分享人的信息
		const url = window.location.href;
		const sceneShare = this.judgeAuth();
		if( sceneShare ) {  //如果是非本人用户
			const shareInfo = utils.parseURL(url).params.i;  //获取分享人的信息
			this.getShareInfo(shareInfo);  //分享场景调取接口查询详细信息
		} 
		
	}
	initTime = () => {
		let curTime = moment(),
		end_time = "";
		let momentClone = moment();
		let momentTen = moment(`${momentClone.format("YYYY-MM-DD")} 22:00`);//重新开始时间
		let momentTw = moment(`${momentClone.format("YYYY-MM-DD")} 24:00`)
		if( curTime.isBefore(moment(`${momentClone.format("YYYY-MM-DD")} 21:00`)) ){  //如果时间在今天截止前
			this.setState({
				btnVisible: true
			})
			end_time = moment(`${momentClone.format("YYYY-MM-DD")} 21:00`).unix()
		} else {
			if(curTime.isBefore(momentTen)){  //重新开始之前
				this.setState({
					btnVisible: false
				})
				end_time = moment(`${momentClone.format("YYYY-MM-DD")} 21:00`).unix()
			} else if(curTime.isAfter(momentTen) && curTime.isBefore(momentTw) ){ //重新开始之后如果在当前24点前
				this.setState({
					btnVisible: true
				})
				end_time = moment(`${momentClone.add(1, 'd').format("YYYY-MM-DD")} 21:00`).unix()
			} else{ //过了第二天时间
				end_time = moment(`${momentClone.format("YYYY-MM-DD")} 21:00`).unix()
			}
		}

		this.coverTime(end_time);
	}
	getAllInfo = (user_id) => {  //获取房源信息
		let curIndex = '';
		let that = this;
		const url = window.location.href;
		
		if (utils.parseURL(url).params.d) {
		 	curIndex = utils.parseURL(url).params.d;
		} 
		axios.get(`https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/dataHouse.json`,{
			params:{  
				timestamp: new Date().getTime()
			}
		})
		.then(function (response) {
			const arr = response.data.houseSource;
			let obj = {};
			arr.forEach((item,index) =>{
				if(item.dataIndex === curIndex){
					obj = {...item}
				}
			})	
			if(response.data) {
				that.setState({
					houseListData: response.data.houseSource,
					houseTicketData: response.data.houseTicket,
				})
			} else {
				that.setState({
					houseListData: [],
					houseTicketData: [],
				})
			}
			that.setState({
				curData: obj
			},() => {
				 //判断转发进来的
				const sceneShare = that.judgeAuth();
				if(sceneShare) {
					return;
				} 
				that.getLeaderboard(user_id);
				that.setActivity(user_id)
			})
		})
		.catch(function (err){
			
		})

	}
	setActivity = (user_id) => {  //发起活动
		const that = this;
		let curData = this.state.curData;
		axios.post(`${Host}/report/index`, {
			activity_id: "1904222209237" ,
			payload: user_id+'|'+curData.name	
		})
		.then(function (response) {
			// token无效去登陆
			if (response.data.errorCode === "20113") {
				adapter.signIn();
				return
			}
			if(response.data.success) {
				that.setState({
					friendsList: response.data.data ? response.data.data.friends : []
				})
			} else {
				that.setState({
					btnVisible: false,
					errorMsg: response.data.errorMsg,
					errorVisible: true
				})
			}
		})
		.catch(function (err){
			console.log(err);
		})

	}
	getShareInfo = () => {  //根据分享的用户id查询用户信息
		let that = this;
		if(this.state.shareInfo) {
			axios.get(`${Host}/report/index/detail`, {
				params: {
					activity_id: 1904222209237,
					payload: this.state.shareInfo
				}
			})
			.then(function (response) {
				// token无效去登陆
				if (response.data.errorCode === "20113") {
					adapter.signIn();
					return
				}
				if(response.data.success) {
					that.setState({
						curUserInfo: response.data.data
					})
				} else {
					that.setState({
						errorMsg: response.data.errorMsg,
						errorVisible: true
					})
				}
			})
			.catch(function (err){
				console.log(err);
			})
		}
	}
	getLeaderboard = (user_id) => {  //获取排行榜
		let that = this;
		const sceneShare = this.judgeAuth();
		const curData = this.state.curData;
		if( sceneShare ) {
			console.log("不获取排行榜")
			return;
		} 
		axios.get(`${Host}/report/index`, {    //排行榜api
			params: {
				activity_id: 1904222209237,
				payload: `${user_id}|${curData.name}`
			}
		})
		.then(function (response) {
			// token无效去登陆
			if (response.data.errorCode === "20113") {
				adapter.signIn();
				return
			}
			if(response.data.success) {
				let leadArr = response.data.data ? response.data.data : [];
				let curNum = "";
				leadArr.forEach((item,index)=>{
					if( item.id === user_id ) {
						curNum = index + 1;
					}
				})
				that.setState({
					leaderboard: leadArr,
					myOrder: curNum
				})
			} else {
				that.setState({
					myOrder: '',
					errorMsg: response.data.errorMsg,
					errorVisible: true
				})
			}
		})
		.catch(function (err){
			console.log(err);
		})
	}
	// 领取操作
	getReceive() {
		const that = this
		// 没有登录就先进行登录
		if (!this.state.token) {
			adapter.signIn();
			return
		}
		// 已经参与过不进行并成功领券的不进行转转盘
		if (this.state.isTurned) {
			that.setState({
				modelMsg: '您已获得优惠，赶紧预订吧！',
				showModel: true,
				isTurned: true
			})
			setTimeout(() => {
				that.setState({ showModel: false })
			}, 3000)
			return
		}
		// 没有手机号不进行转转盘
		if (this.state.phone === '') return
		// 将手机号与storage进行比对，如果有则无法进行领券，并做友好提示
		try {
			const phone = localStorage.getItem(this.state.phone)
			if (phone && phone === '1') {
				that.setState({
					modelMsg: '您已获得优惠，赶紧预订吧！',
					showModel: true,
					isTurned: true
				})
				setTimeout(() => {
					that.setState({ showModel: false })
				}, 3000)
				return
			}
		} catch (error) {
			console.log(error)
		}
		// 转转盘
		let name = 'myfirst'
		const random = Math.random();
		if (random < 0.3) {
			name = 'myfirst'
		} else if (0.3 <= random && random < 0.7) {
			name = 'myfirst1'
		} else {
			name = 'myfirst2'
		}
		this.setState({
			move: {
				animation: `${name} 4s infinite forwards`,
				animationIterationCount: '1'
			}
		})
		// 定时6s在动画结束后1s进行领券请求
		setTimeout(() => {
			that.getCoupon()
		}, 4100)
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
					console.log(response.data.data.platformUser, "response.data.data.platformUser")
					
					const phone = response.data.data.platformUser.mobile
					const avatar = response.data.data.platformUser.avatar
					const user_id = response.data.data.platformUser.id
					// 存储phone,id
					that.setState({
						phone,
						user_id,
						avatar
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
			.post(`${Host}/report/index/`, _data)
			.then(function (response) {
				if (response.data.success) {
					const data = response.data.data;
					that.setState({
						houseList: data,
					});
				} else {
					that.setState({
						errorMsg: response.data.errorMsg,
						errorVisible: true
					})
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	// 转跳逻辑
	jumpPage(id) {
		adapter.navigate({ url: `/pages/housing/detail/index?houseId=${id}` });
	}
    jumpReturn = () => {
        browserHistory.push("/")
    }
    makePoster = () => {  //生成海报
		if (!this.state.token) {   //先登录
			adapter.signIn();
			return
		}
		// eslint-disable-next-line no-restricted-globals
		// const path = encodeURIComponent(`@u@?user_id=${this.state.user_id}&dataIndex=${this.state.curIndex}&reEntry=2`)
			// eslint-disable-next-line no-restricted-globals
		const path = encodeURIComponent(`${location.origin}${location.pathname}#/sharePage?i=${this.state.user_id}&d=${this.state.curIndex}&r=2`)
		const pages = `/pages/h5/index?url=${path}`
		adapter.skipToPoster({ title: ``, path: `${pages}`, imageUrl: `https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/shareAgain.png`});
	}	
	formatTime = (num) => {
		if( num < 10 ) {
			return '0' +  num
		} else {
			return '' + num
		}
	}
	countdown = (end_time) => { //倒计时
		// let end_time = this.state.end_time//终止时间
		let cur_time = moment();
		cur_time = cur_time.unix();
		// console.log(end_time, cur_time)
        let diff_time = parseInt(end_time - cur_time);// 倒计时时间差
        let h = this.formatTime ( Math.floor(diff_time / 3600) );
        let m = this.formatTime ( Math.floor((diff_time / 60 % 60)) );
		let s = this.formatTime ( Math.floor((diff_time % 60)) );
		let timeObj = {
			h,m,s
		};
        if (diff_time <= 0) {
			this.setState({
				btnVisible: false
			})
            timeObj = {
				h: '00',
				m: '00',
				s: '00'
			}
		};
		this.setState({
			timeObj
		})
	}
	coverTime = (end_time) => {  //倒计时
		this.countdown(end_time);
		this.timer = setInterval(()=>{ this.countdown(end_time) },1000);
	} 
	entryHome = () => {   //分享后重新进入首页
		if (!this.state.token) {
			adapter.signIn();
			return
		}
		console.log(window.location.href ,window.location ,browserHistory.getCurrentLocation().pathname)
		//重新进入页面	
		// eslint-disable-next-line no-restricted-globals
		const path = encodeURIComponent(`${location.origin}${location.pathname}#/?r=1`)
		adapter.navigate({ url: `/pages/h5/index?url=${path}` });
	}
	helpFriend = () => {  //帮助好友助力
		let that = this;
		if (!this.state.token) {
			adapter.signIn();
			return
		}
		let curUserInfo = this.state.curUserInfo
		axios
		.put(`${Host}/report/index/${this.state.shareInfo}`, {
			activity_id: "1904222209237",
			payload: `${that.state.user_id}|${curUserInfo.address}`
		})
		.then(function (response) {
			if (response.data.success) {
				that.setState({
					sucVisible: true
				})
				
			} else {
				that.setState({
					errorMsg: response.data.errorMsg,
					errorVisible: true
				})
			}
		})
		.catch(function (error) {
			console.log(error);
		});

	}
	showOrigin = (id) => {
		console.log(id,"id")
	}
	entryShare = (item) => {
		if (!this.state.token) {   //先登录
			adapter.signIn();
			return
		}
		if(item.open !== "true") {
			return;
		}
		console.log(item,"item")
		// eslint-disable-next-line no-restricted-globals
		const path = encodeURIComponent(`${location.origin}${location.pathname}#/sharePage?r=1&d=${item.dataIndex}`)
		adapter.navigate({ url: `/pages/h5/index?url=${path}` });
	}

	buyNow = (item) => {
		if (!this.state.token) {   //先登录
			adapter.signIn();
			return
		}
		console.log(item.ID,"item", this.state.user_id)
		let that = this;
		axios
		.put(`${Host}/report/index/receive_coupon`, {
			activity_id: "1904222209237",
			payload: that.state.user_id+'|'+item.ID
		})
		.then(function (response) {
			if (response.data.success) {
				that.setState({
					panicVisible: true
				})
			} else {
				that.setState({
					resultVisible: true
				})
			}
		})
		.catch(function (error) {
			console.log(error);
		});
	}
	closeSucTip = () => {
		this.setState({
			sucVisible: false
		})
	}

	closeErrorTip = () => {
		this.setState({
			errorVisible: false
		})
	}

	entryOffer = (e) => {
		console.log(e,"eeeeee")
		e.stopPropagation();
		adapter.navigate({ url: `/pages/coupon/index` });
	}

	closeResultModel = () => {
		this.setState({
			resultVisible: false
		})
	}

	renderModal = () => {
		let modalDom;	
		let resultVisible  = this.state.resultVisible;
		modalDom = (
			<div className="model resultSuc">
				<div>
					<div className="model_text" onClick={(e)=>{ this.entryOffer(e)}}>
						<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E6%8C%89%E9%92%AE%20%E6%8B%B7%E8%B4%9D.png" alt=""/>
					</div>
					<img className="bg" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E4%BB%8A%E6%97%A5%E5%B7%B2%E6%8A%A2%E5%AE%8C.png" alt=""/>
				</div>
				<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E5%85%B3%E9%97%AD.png" className="backBtn" onClick={this.closeResultModel.bind(this)} alt='' />
			</div>
		)
		return resultVisible && <div className='ruleTips' onClick={this.closeResultModel.bind(this)}>
			{modalDom}
		</div>
	}

	judgeAuth = () => {
		const url = window.location.href;
		return utils.parseURL(url) && utils.parseURL(url).params.i && utils.parseURL(url).params.i !== this.state.user_id
	}
   
	render() {
		const {h, m, s} = this.state.timeObj;
		const self = this;
		// const url = window.location.href;
		// const sceneShare = utils.parseURL(url) && utils.parseURL(url).params.i 
		const sceneShare = this.judgeAuth();
		const { houseTicketData, leaderboard, curUserInfo, houseListData , friendsList = []} = this.state;
		return (
			<div className='app' id="app">
				{sceneShare ? 
					<div className="sceneShare">
						<div className="pageBox">
							<img className="headBoxImage" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/homePage.png" alt='' />
						</div>
						<div className="share_display_section">
							<div className="share_dec_section">
								<div className="head_img">
									<img className="headBoxImage" src={curUserInfo.avatar || "https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/tmphead.png"} alt='' />
								</div>
								<div className="status_title">
									<div className="status_title_info">{curUserInfo.nick_name ? curUserInfo.nick_name : ''}在抢:</div>
									<div className="house_title">{curUserInfo.address ? curUserInfo.address : ''}0元住</div>
									<div className="house_title">只差你的助力了！</div>
								</div>
							</div>
							<div className="help_btn_section">
								<button onClick={this.helpFriend}>帮助好友助力</button>
								<button onClick={this.entryHome}>我也想参加</button>
							</div>
							<div className="mt30"><span className="active_text">4.25-5.4</span> 每晚<span className="active_text">10:00</span>准点开抢</div>	
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
												<div key={index} className="headBox" onClick={function(){ self.entryShare(item) } }>
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
					</div>
					:
					<div className="normal">
					<div className="shareBox">
						<img className="headBoxImage" src={this.state.curData.innerImg} alt='' />
						<button className="show0riginBtn" onClick={()=> {this.jumpPage(this.state.curData.ID)}}>查看房源</button>
						{/* <div className="descrption">
							<p className="houseTitle">杭州<span>·</span>不足山宿</p>
							<p>¥{1098}</p>
						</div> */}
						{/* <img onClick={this.jumpReturn}  className="returnArrow" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/%E5%B7%A6%E7%AE%AD%E5%A4%B4.png" alt=""/> */}
					</div>
					<div className="share_display_section">
						<div className="share_dec_section">
							<div className="head_img">
								<img className="headBoxImage" src={this.state.avatar ? this.state.avatar : ''} alt='' />
							</div>
							<div className="status_title">
								<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E6%AF%8F%E5%A4%A9%E9%82%80%E8%AF%B7%E4%BA%BA%E6%95%B0%E6%9C%80%E5%A4%9A%20%E5%8D%B3%E5%8F%AF0%E5%85%83%E4%BD%8F.png" alt="" />
								<p className="countTime" ><span className="countTitle">剩余时间 </span> <span className="countTimeCard">{ h + ':' + m + ':' + s  }</span></p>
							</div>
						</div>
						<div className="share_btn_section">
						    {
							this.state.btnVisible &&
							<button onClick={this.makePoster}>
								<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E9%82%80%E8%AF%B7%E5%A5%BD%E5%8F%8B%E5%8A%A9%E5%8A%9B.png" alt=""/>
							</button>
							}
						</div>
						<div className="friend_section">
							<img className="friend_title" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E5%8A%A9%E5%8A%9B%E5%A5%BD%E5%8F%8B.png" alt="" />
							<div className="renderImage">
								{ 
									friendsList.map((item, index)=> {
										return (
											<div className="headBox" key={index}>
												<img className="headBoxImage" src={item.avatar} alt='' />
												<p className="nickName">{item.nick_name}</p>
											</div>
										)
									})
								}   
							</div>
						</div>
						<div className="rank_section">
							<img className="rank_title" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E5%8A%A9%E5%8A%9B%E6%8E%92%E8%A1%8C%E6%A6%9C.png" alt="" />
							{leaderboard && leaderboard.length > 0 && <p className="rank_text">我的排名 <span style={{ "color": "rgb(234, 122, 109)" }}>{ this.state.myOrder ? `第${this.state.myOrder}名` : '' }</span> </p>}
						</div>	
					</div>
					<div className="rankTable">
						<div>
							<div className="ranking_header">
								<div className="table_header">昵称</div>
								<div className="table_header">邀请人数</div>
								<div className="table_header">排名</div>
							</div>
							{
								leaderboard.map((item, index)=> {
									return (
										<div className="ranking_header" key={index}>
											<div className="table_name">
												<div className="avator">
													{ index === 0  ? 
														<img className="winner" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/%E7%9A%87%E5%86%A0.png" alt=""/>
														: null
													}
													<img src={item.avatar}alt=""/>
												</div>
												<div>{item.nick_name}</div>
											</div>
											<div className="table_item">{item.count}人</div>
											<div className="table_item">{index === 0 ? <span style={{"color": "#f00"}}>第{index + 1}名</span> : `第${index + 1}名`}</div>
										</div>
									)
								})
							}
						</div>
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
					this.state.sucVisible &&
					<div className='ruleTips' onClick={this.closeSucTip.bind(this)}>
						<div className="model resultSuc">
						
							<div className="resultSucBox">
								<img className="bg" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E5%8A%A9%E5%8A%9B%E6%88%90%E5%8A%9F%E5%BC%B9%E7%AA%97.png" alt=""/> 
								<div className="model_text" onClick={  (e) => { this.entryOffer(e) } }>
									<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E6%8C%89%E9%92%AE%20%E6%8B%B7%E8%B4%9D.png" alt=""/>
								</div>
							</div>
						
							<img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/boost51/%E5%85%B3%E9%97%AD.png" className="backBtn" onClick={this.closeResultModel.bind(this)} alt='' />
						</div>
					</div>
				}
				{this.renderModal()}
			</div>
		);
	}
}

export default App;
