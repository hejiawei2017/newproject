import React from 'react'
import ReactDOM from 'react-dom'
import ToastCtr from './ToastCtr'
import Toast from './Toast'
import './Toast.css'

function createNotificationCtr () {
  return new Promise((resolve, reject) => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    ReactDOM.render(
      <ToastCtr
        // eslint-disable-next-line react/jsx-no-bind
        ref={c => {
          resolve(methods(c))
        }}
      />,
      div
    )
    const methods = ref => {
      return {
        addNotice (notice) {
          return ref.addNotice(notice)
        },
        destroy () {
          ReactDOM.unmountComponentAtNode(div)
          document.body.removeChild(div)
        }
      }
    }
  })
}

let ctr
const notice = async (type, content, duration = 2000, onClose) => {
  if (!ctr) ctr = await createNotificationCtr()
  return ctr.addNotice({ type, content, duration, onClose })
}

// 默认配置
const defaultConf = {
  limit: 1
}

// 配置config的方法
const conf = (Ctr, opts = {}) => {
  const confCached = (Ctr.options = Ctr.options || {})
  Ctr.options = Object.assign({}, confCached, opts)
  return Ctr.config
}

conf(ToastCtr, defaultConf) // 初始化配置Toast的配置

const methods = {
  config (opts) {
    conf(ToastCtr, opts)
  },
  notice (opts) {
    const { type, content, duration, onClose } = opts
    return notice(type, content, duration, onClose)
  },
  text (content, duration, onClose) {
    return notice('none', content, duration, onClose)
  },
  info (content, duration, onClose) {
    return notice('info', content, duration, onClose)
  },
  success (content = '操作成功', duration, onClose) {
    return notice('success', content, duration, onClose)
  },
  error (content, duration, onClose) {
    return notice('error', content, duration, onClose)
  },
  loading (content = '加载中...', duration = 0, onClose) {
    return notice('loading', content, duration, onClose)
  },
  /**
   * 关闭toast
   * @param {*} noticePromise
   */
  async hide (noticePromise) {
    if (!noticePromise) return
    const close = await noticePromise
    return close()
  }
}

Object.keys(methods).forEach(key => {
  Toast[key] = methods[key]
})

export default Toast
