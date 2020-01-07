import React, {Component} from 'react';
import './count-down.css'
import moment from 'moment'

/**
 * 倒计时组件
 * 用法：
 * 1.只传{moment} endTime
 */
export default class CountDown extends Component {
	constructor (props) {
		super(props);
		this.state = {
			intervalId: null, // 倒计时器的id
			remaining: {
				day: '00',
				hour: '00',
				minute: '00',
				second: '00'
			}
		};
	}

	componentWillMount () {
		const {endTime} = this.props
		if (endTime === null) {
			return
		}

	}

	componentWillReceiveProps (nextProps, nextContext) {
		const {endTime} = nextProps
		if (endTime === null) {
			return
		}
		this.init(endTime)
	}

	componentWillUnmount () {
		if (this.state.intervalId !== null) {
			this.stopCountDownInterval(this.state.intervalId)
		}
	}

	init (endTime) {
		/**
		 * 处理毫秒值，避免定时器不能正常结束
		 */
		const now = moment().set('millisecond', 0)
		const remainingSeconds = endTime.set('millisecond', 0).diff(now, 'seconds')
		if (remainingSeconds <= 0) {// 该订单砍价活动时间已过期
			return
		}
		const remainingTime = moment.duration({seconds: remainingSeconds})
		if (this.state.intervalId !== null) {
			this.stopCountDownInterval(this.state.intervalId)
		}
		this.setState({
			intervalId: this.startCountDownInterval(remainingTime)
		})
	}

	/**
	 * 启动倒计时器
	 * @param {moment} remainingTime
	 */
	startCountDownInterval (remainingTime) {
		return setInterval(() => {
			if (remainingTime.asSeconds() === 0) { // 倒计时时间耗尽，结束
				this.stopCountDownInterval(this.state.intervalId)
				return
			}
			remainingTime = remainingTime.subtract(1, 'seconds')
			this.showRemainingTime(remainingTime)
		}, 1000)
	}

	/**
	 * 关闭倒计时器
	 * @param {Number} intervalId
	 */
	stopCountDownInterval (intervalId) {
		clearInterval(intervalId)
	}

	showRemainingTime (remainingTime) {
		this.setState({
			remaining: {
				day: this.deal2Digit(remainingTime.days()),
				hour: this.deal2Digit(remainingTime.hours()),
				minute: this.deal2Digit(remainingTime.minutes()),
				second: this.deal2Digit(remainingTime.seconds())
			}
		})
	}

	deal2Digit (num) {
		return num < 10 ? `0${num}` : num
	}

	render () {
		const {remaining} = this.state
		return <div className="count-down-container">
			<div className="number-box orange-box">{remaining.day}</div>
			<span>天</span>
			<div className="number-box orange-box">{remaining.hour}</div>
			<span>时</span>
			<div className="number-box orange-box">{remaining.minute}</div>
			<span>分</span>
			<div className="number-box blue-box">{remaining.second}</div>
			<span>秒</span>
		</div>;
	}
}
