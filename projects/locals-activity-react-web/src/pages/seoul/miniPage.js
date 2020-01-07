import React from 'react';
import wx from 'weixin-js-sdk'
import './assets/index.css'

export default class miniPage extends React.Component {
	render () {
		return (
			<div className="poster-container">
				<img className="poster"
				     src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/seoul/seoul-poster-mini.jpg"
				     alt=""/>
			</div>
		)
	}
}
