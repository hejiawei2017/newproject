import React, { Component } from 'react'
import './index.css'

export default class Cell extends Component {
  constructor () {
    super()
    this.buildLeft = this.buildLeft.bind(this)
  }
  buildLeft () {
    const { imgUrl, left } = this.props
    if (left) return left
    if (imgUrl)
      return <img className="cell--left--img" src={imgUrl} alt=""></img>
    return ''
  }
  render () {
    const { content, right } = this.props
    return (
      <div className="cell">
        <div className="cell--left">{this.buildLeft()}</div>
        <div className="cell--center">{content}</div>
        <div className="cell--right">{right}</div>
      </div>
    )
  }
}
