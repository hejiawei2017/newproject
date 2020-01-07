import React from 'react';
import '../businessTravel/assets/index.scss'
import utils from "../../common/utils";

export default class SuccessPage extends React.Component {
	componentDidMount () {
		document.title = '送您一张路客金卡'
	}

	handleClickMiniCode = (e) => {
		e.stopPropagation()
		utils.gioTrack('company_travel_act_success_mini_code_btn')
	}

	render () {
		return (
			<div className="home-container success-container">
				<div className="success-content">
					<img className="success-icon"
					     src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/businessTravel/success-icon.png"
					     alt=""/>
					<div className="success-tip">申请提交成功</div>
					<div className="success-tip-1">我们会在3个工作日内联系您</div>
				</div>

				<div className="home-body success-home-body">
					<img className="success-services"
					     src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/businessTravel/success-rights.png"
					     alt=""/>

					<div className="footer-mini-code">
						<div className="mini-code-tip"></div>
						<img onClick={this.handleClickMiniCode}
						     src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/businessTravel/mini-code.png"
						     className="mini-code"></img>
					</div>
				</div>
			</div>
		);
	}
}
