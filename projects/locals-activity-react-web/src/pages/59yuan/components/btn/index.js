import React from 'react'
import './index.css'

class Btn extends React.Component {
  constructor () {
    super()
    this.handleClick = this.handleClick.bind(this)
  }
  state = {
    btnImag:
      'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/59_yuan/59_btn.png',
    tapImg:
      'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/59_yuan/tap_btn.png'
  }
  componentDidMount () {}
  handleClick () {
    const { onClick } = this.props
    onClick && onClick()
  }
  render () {
    const { btnImag, tapImg } = this.state
    return (
      <div className="btn" onClick={this.handleClick}>
        <img className="btn-img" src={btnImag} alt="" />
        <img className="tap-img" src={tapImg} alt="" />
      </div>
    )
  }
}

export default Btn
