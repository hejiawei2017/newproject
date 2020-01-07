import React from "react"
import './assets/dialog.css'
import BaseDialog from "./baseDialog";

export default class RuleDialog extends React.Component {
	close = (e) => {
		this.props.changeParentState({
			visibleRuleDialog: false
		})
	}

	render () {
		return (
			<BaseDialog>
				<div className="dialog-container rule-dialog">
					<div className="dialog-content">
						<p className="rule">活动时间：10.11-11.10；</p>
						<p className="rule">活动内容：活动期间，用户在下单之后可以发起砍价活动，每一个好友帮助砍价即可返还相应的砍价金额，累计砍价金额最高可获得免单，砍价所得总金额将在订单退房后通过储值的方式返还至用户的余额；</p>
						<p className="rule">用户在下单之后到退房之前均可发起砍价活动，退房之后将无法发起活动；</p>
						<p className="rule">砍价时间为活动发起后的三天内；</p>
						<p className="rule">砍价期间如取消订单，则砍价活动失效，砍价金额不予返还；砍价期间如已退房，则砍价金额在砍价结束后发放；</p>
						<p className="rule">砍价的最高金额为实际支付的房费（不含押金），实际支付金额为0的订单无法参与活动；</p>
						<p className="rule">每个好友只能帮砍1次，每个帮砍好友均可获得100元红包；</p>
						<p className="rule">活动所获得的余额可抵扣房费；</p>
						<p className="rule">本活动最终解释权归北京路客所有。</p>
					</div>
				</div>
				<div className="close-btn-row">
					<div className="close-btn" onClick={this.close}></div>
				</div>
			</BaseDialog>
		)
	}
}
