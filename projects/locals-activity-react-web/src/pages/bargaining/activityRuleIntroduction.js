import React from "react";
import adapter from "../../common/adapter"
import './assets/introduction.css'

export default class ActivityRuleIntroduction extends React.Component {
	toHomePage = () => {
		adapter.navigate({method: 'switchTab', url: '/pages/index/index'})
	}

	render () {
		return (
			<div className="introduction-container">
				<div className="introduction-rule-title">活动说明</div>
				<div className="introduction-rule">
					活动已结束
				</div>
				<div className="introduction-rule-btn" onClick={this.toHomePage}></div>
			</div>
		)
	}
}
