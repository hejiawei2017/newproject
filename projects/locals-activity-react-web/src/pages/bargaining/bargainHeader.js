import React from "react";
import './assets/bargain-header.css'

export default class BargainHeader extends React.Component {
	render () {
		return (
			<div className="head">
				<div className="rule-btn" onClick={this.props.showRuleDialog}>活动规则</div>
			</div>
		)
	}
}
