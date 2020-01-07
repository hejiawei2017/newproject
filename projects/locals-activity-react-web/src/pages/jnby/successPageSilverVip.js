import React from 'react';
import '../businessTravel/assets/index.scss'
import utils from "../../common/utils";
import adapter from "../../common/adapter";

const OSS_PATH = 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/businessTravel'
export default class SuccessPage extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			services: [
				{icon: `${OSS_PATH}/silver-icon1.png`, name: '专属管家'},
				{icon: `${OSS_PATH}/silver-icon0.png`, name: '行李寄存'},
				{icon: `${OSS_PATH}/silver-icon2.png`, name: '现场接待'},
				{icon: `${OSS_PATH}/silver-icon3.png`, name: '延迟退房'}
			]
		}
	}
	componentDidMount () {
		document.title = '送您一张路客银卡'
	}

	backToHome = (e) => {
		e.stopPropagation()
		utils.gioTrack('jnby_silver_vip_success_back_to_home_btn')
		adapter.navigate({method: 'reLaunch', url: '/pages/index/index'})
	}

	render () {
		const {services} = this.state
		return (
			<div className="home-container success-container">
				<div className="success-content">
					<img className="success-icon"
					     src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/businessTravel/success-icon.png"
					     alt=""/>
					<div className="success-tip">恭喜您领取成功</div>
					<div className="success-tip-1">您已升级为银卡会员</div>
				</div>

				<div className="home-body success-home-body">
					<div className="silver-success-bg">
						<div className="discount-title-row">
							<img className="title-img silver-title"
							     src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/jnby/silver-vip-jnby-title.png"
							     alt=""/>
							<i className="silver-vip"></i>
						</div>

						<div className="main-discount-row silver-main-discount-row">
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

						<div className="gold-back-to-home-btn" onClick={this.backToHome}></div>
					</div>
				</div>
			</div>
		);
	}
}
