import React from "react";
import './assets/introduction.css'

export default class ActivityProgressIntroduction extends React.Component {
	render () {
		return (
			<div className="introduction-container">
				<div className="introduction-rule-title">活动流程</div>
				<div className="introduction-progress-content">
					<p className="introduction-progress">下单预订民宿</p>
					<p className="introduction-progress">点击参与砍价活动</p>
					<p className="introduction-progress">在规定时间内完成砍价</p>
					<p className="introduction-progress">订单退房之后，发放奖金至余额</p>
				</div>
			</div>
		)
	}
}
