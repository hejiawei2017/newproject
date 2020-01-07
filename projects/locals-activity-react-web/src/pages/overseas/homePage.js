import React from 'react';
import '../seoul/assets/index.css'
import utils from "../../common/utils";

const OSS_PATH = 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/overseas/'
export default class homePage extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			channel: ''
		}
	}

	componentWillMount () {
		document.title = '海外精品民宿'
		// 获取url，并解析
		const url = window.location.href
		const params = utils.parseURL(url).params
		// 如果有channel，进行记录
		if (params.channel) {
			this.setState({channel: params.channel});
		}
	}

	showPoster (channel) {
		let img
		switch (channel) {
			case 'bali':
				img = 'bali01.jpg';
				break;
			case 'Kyoto01':
				img = 'Kyoto01-1.jpg';
				break;
			case 'Kyoto02':
				img = 'Kyoto02-1.jpg';
				break;
			case 'Kyoto03':
				img = 'Kyoto03-1.jpg';
				break;
			case 'Osaka01':
				img = 'Osaka01-1.jpg';
				break;
			case 'Osaka02':
				img = 'Osaka02-1.jpg';
				break;
			case 'Phuket':
				img = 'Phuket01.jpg';
				break;
			case 'Samui':
				img = 'Samui01.jpg';
				break;
			default:
				img = 'bali01.jpg';
				break;
		}
		console.log(img)
		return `${OSS_PATH}${img}`
	}

	render () {
		const {channel} = this.state
		return (
			<div className="poster-container">
				<img className="poster"
				     src={this.showPoster(channel)}
				     alt=""/>
			</div>
		)
	}
}
