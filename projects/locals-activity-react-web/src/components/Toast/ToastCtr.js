import React, { Component } from 'react'
import Toast from './Toast'
let key = 0
class ToastCtr extends Component {
  constructor () {
    super()
    this.state = {
      notices: []
    }
    this.transitionTime = 300
    this.removeNotice = this.removeNotice.bind(this)
  }

  getNoticeKey () {
    return `notice-${++key}-${new Date().getTime()}`
  }

  addNotice (notice) {
    const { notices } = this.state
    notice.key = this.getNoticeKey()
    const { limit = 1 } = ToastCtr.options || {}
    // 如果大于限制，将最开始添加的notice删除，空出位子给接下来的notice
    if (notices.length >= limit) {
      notices.shift()
    }
    notices.push(notice)

    this.setState({
      notices
    })
    if (notice.duration > 0) {
      setTimeout(() => {
        this.removeNotice(notice.key)
      }, notice.duration)
    }
    return () => {
      this.removeNotice(notice.key)
    }
  }

  removeNotice (key) {
    const { notices } = this.state
    const newNotices = notices.filter(notice => {
      if (notice.key === key) {
        if (notice.onClose) setTimeout(notice.onClose, this.transitionTime)
        return false
      }
      return true
    })
    this.setState({
      notices: newNotices
    })
  }

  render () {
    const { notices } = this.state
    const Toasts = notices.map(notice => (
      <Toast key={notice.key} type={notice.type} content={notice.content} />
    ))
    return Toasts
  }
}

export default ToastCtr
