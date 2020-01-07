import React from "react";
import './assets/dialog.css'

export default class BaseDialog extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			scrollHeight: '100%'
		}
	}

	componentDidMount () {
		this.setMaskHeight()
	}

	componentWillReceiveProps (nextProps, nextContext) {
		this.setMaskHeight()
	}

	setMaskHeight = () => {
		const top = 652 / 2
		const scrollHeight = document.querySelector('.all-container').scrollHeight + top
		this.setState({
			scrollHeight: `${scrollHeight}px`
		})
	}

	render () {
		const {scrollHeight} = this.state
		const {children} = this.props
		return (
			<div className="dialog-mask" style={{'height': scrollHeight}}>
				{children}
			</div>
		)
	}
}
