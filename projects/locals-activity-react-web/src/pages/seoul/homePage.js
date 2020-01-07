import React from 'react';
import './assets/index.css'

export default class homePage extends React.Component {
	render () {
		return (
			<div className="poster-container">
				<img className="poster"
				     src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/localhomeqy/seoul/seoul-poster-h5.jpg"
				     alt=""/>
			</div>
		)
	}
}
