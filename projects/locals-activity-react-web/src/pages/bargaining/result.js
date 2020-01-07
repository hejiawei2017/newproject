import React from "react";
import './assets/result.css'

export default class Result extends React.Component {
	render () {
		const {amount, isHelper} = this.props
		return (
			<div className="result-container">
				<div className="result-title">
					活动已结束
				</div>
				{
					!isHelper && (
						<div className="result-content">
							<div className="bargain-result">
								恭喜您共砍<span className="bargain-amount">{amount}</span>元
							</div>
							< div className="introduction">
								{amount}元砍价金额将在退房之后通过储值的方式返还至余额中
							</div>
							<div className="qr-code"></div>
						</div>
					)
				}
			</div>
		)
	}
}
