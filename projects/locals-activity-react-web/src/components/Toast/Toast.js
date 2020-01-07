import React, { Component } from 'react'
const icons = {
  none: '',
  info: 'toast--icon__info',
  success: 'toast--icon__success',
  error: 'toast--icon__error',
  loading: 'toast--icon__loading'
}
class Toast extends Component {
  render () {
    const { type = '', content } = this.props
    return (
      <div className="toast">
        <div className="toast--box">
          <div
            className={
              type && icons[type] && `toast--icon ${icons[type] || ''}`
            }
          ></div>
          <div className="toast--text">{content}</div>
        </div>
      </div>
    )
  }
}

export default Toast
