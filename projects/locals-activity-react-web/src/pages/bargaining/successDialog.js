import React from "react";
import BaseDialog from "./baseDialog";
import adapter from "../../common/adapter";
import {hashHistory} from "react-router";
import utils from "../../common/utils"

export default class SuccessDialog extends React.Component {
	close = (e) => {
		this.props.changeParentState({
			visibleBargainSuccDialog: false
		})
	}
	joinIn = (e) => {
		utils.gioTrack('bargain_join_in_btn')
		hashHistory.push('/')
	}
	viewRedPacket = (e) => {
		adapter.navigate({url: '/pages/coupon/index'})
	}

	render () {
		const {amount} = this.props
		return (
			<BaseDialog>
				<div className="dialog-container success-dialog">
					<div className="success-content">
						成功帮好友砍掉{amount}元，100元红包已到账
					</div>
					<div className="share-btn-row">
						<div className="view-btn" onClick={this.viewRedPacket}></div>
						<div className="join-in-btn" onClick={this.joinIn}></div>
					</div>
				</div>
				<div className="close-btn-row">
					<div className="close-btn" onClick={this.close}></div>
				</div>
			</BaseDialog>
		)
	}
}
