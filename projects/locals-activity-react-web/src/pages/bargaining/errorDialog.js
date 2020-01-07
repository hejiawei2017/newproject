import React from "react";
import BaseDialog from "./baseDialog";
import {hashHistory} from "react-router";
import utils from "../../common/utils";

export default class ErrorDialog extends React.Component {
	close = (e) => {
		this.props.changeParentState({
			visibleBargainErrorDialog: false
		})
	}

	joinIn = (e) => {
		utils.gioTrack('bargain_join_in_btn')
		hashHistory.push('/')
	}

	render () {
		const {errorMsg} = this.props
		return (
			<BaseDialog>
				<div className="dialog-container error-dialog">
					<div className="error-dialog-content">
						{errorMsg}
					</div>
					<div className="error-join-in-btn" onClick={this.joinIn}></div>
				</div>
				<div className="close-btn-row">
					<div className="close-btn" onClick={this.close}></div>
				</div>
			</BaseDialog>
		)
	}
}
