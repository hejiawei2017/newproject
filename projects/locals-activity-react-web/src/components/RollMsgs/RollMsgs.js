/*
  滚动显示信息
*/

import React, { Component } from 'react'
import './RollMsgs.css'
class RollMsgs extends Component {
  constructor() {
    super()
    this.state = {
      currentRollIndex: 0 //初始滚动的index
    }
    this.startRoll = this.startRoll.bind(this)
  }
  componentDidMount() {
    this.startRoll()
  }
  startRoll() {
    let that = this
    if (that.rollInterVal) {
      clearInterval(that.rollInterVal)
    }
    that.rollInterVal = setInterval(() => {
      let rIndex = that.state.currentRollIndex
      rIndex++
      that.setState({
        currentRollIndex: rIndex //初始滚动的index
      })
    }, that.props.rollInterTime)
  }
  render() {
    const { rollList } = this.props
    let { currentRollIndex } = this.state
    let nowIndex = currentRollIndex
    if (rollList.length) {
      nowIndex = currentRollIndex % rollList.length
    }
    return (
      <div>
        <div className="rollsmsg-container">
          <div className="rollsmsg-item">{rollList[nowIndex]}</div>
        </div>
      </div>
    )
  }
}
RollMsgs.defaultProps = {
  rollList: [],
  rollInterTime: 3000
}
export default RollMsgs
