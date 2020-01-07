import React from 'react';
import './assets/index.css'
import adapter from "../../common/adapter";
import utils from "../../common/utils";

export default class landingPage extends React.Component {
	constructor (props) {
		super(props)
	}

	book = () => {
		utils.gioTrack('jnby_gold_vip_landing_book_btn')
		adapter.navigate({url: `/pages/h5/index?url=https%3A%2F%2Fi.localhome.cn%2Fv%2F1908141100907%3Fhouseid%3D1070936381446778881&barTitle=江南布衣风民宿`});
	}

	render () {
		return (
			<div className="landing-page-container">
				<div className="landing-page-header"></div>
				<img className="landing-page-body"
				     src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/jnby/jnby-body.jpg">
				</img>
				<div className="landing-book-btn" onClick={this.book}></div>
				<img className="landing-page-footer" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/jnby/jnby-footer.png"></img>
			</div>
		)
	}
}
