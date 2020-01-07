import React, {Component} from 'react';
import './activity-progress.css'
import {Progress} from 'antd'
import 'antd/dist/antd.css';

/**
 * 进度条组件
 * 说明：
 * percent: 必填，进度条百分比
 * showInfo: 选填，是否显示百分比
 * strokeWidth: 选填，进度条的宽度
 * strokeLinecap: 选填，Enum{ 'round', 'square' }
 * strokeColor: 选填，进度条的颜色
 */
export default class ActivityProgress extends Component {
	constructor (props) {
		super(props);
		const {percent, strokeWidth, strokeLinecap, strokeColor, showInfo} = this.props
		this.state = {
			percent,
			showInfo: !!showInfo,
			strokeWidth: strokeWidth || 36,
			strokeLinecap: strokeLinecap || 'round',
			strokeColor: strokeColor || '#E42E1B'
		}
	}

	componentWillReceiveProps (nextProps, nextContext) {
		const {percent, strokeWidth, strokeLinecap, strokeColor, showInfo} = nextProps
		let state = {}
		percent && (state.percent = percent)
		strokeWidth && (state.strokeWidth = strokeWidth)
		strokeLinecap && (state.strokeLinecap = strokeLinecap)
		strokeColor && (state.strokeColor = strokeColor)
		showInfo && (state.showInfo = showInfo)
		this.setState(state)
	}

	componentDidMount () {
		this.setProgressHeight()
	}

	componentDidUpdate (prevProps, prevState, snapshot) {
		this.setProgressHeight()
	}

	setProgressHeight () {
		const {strokeWidth} = this.state
		const progressBg = document.querySelector('.ant-progress-bg')
		progressBg.style.height = `${strokeWidth / 75}rem`
	}

	render () {
		const {percent, strokeLinecap, strokeColor, showInfo} = this.state
		return (
			<div className="progress-container">
				<Progress className="activity-progress"
				          percent={percent} strokeLinecap={strokeLinecap}
				          strokeColor={strokeColor} showInfo={showInfo}/>
			</div>
		)
	}
}
