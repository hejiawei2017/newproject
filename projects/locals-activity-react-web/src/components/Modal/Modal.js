import React, { Component } from 'react'
import './Modal.css'

export default class Modal extends Component {
  constructor () {
    super()
    this.closeModal = this.closeModal.bind(this)
  }

  state = {}

  closeModal () {
    const { onClose } = this.props
    onClose && onClose()
  }

  render () {
    const {
      visible,
      header,
      content,
      footer,
      modalViewStyle = {},
      isShowCloseBtn = true
    } = this.props
    return (
      (visible && (
        <div className="modal">
          <div className="modal-view" style={modalViewStyle}>
            {header && <div className="modal-view--header">{header}</div>}
            {<div className="modal-view--content">{content}</div>}

            {footer && <div className="modal-view--footer">{footer}</div>}

            {isShowCloseBtn && (
              <div className="close" onClick={this.closeModal}>
                ×
              </div>
            )}
          </div>
          <div className="mask" />
        </div>
      )) ||
      ''
    )
  }
}
