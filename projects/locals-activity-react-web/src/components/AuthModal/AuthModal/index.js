/*
 公共的站外登陆模块，用于取得用户信息
 默认样式采用小程序登录框
*/

import React, { Component } from 'react'
import Toast from '../../Toast'

import './index.css'
import { sendVerificationCode, register, login } from '../../../common/api'
import cbs from '../cbs'

function startCbs (type, params) {
  let callbacks = {}
  const { loginCbs, registerCbs } = cbs
  if (type === 'login') callbacks = loginCbs
  if (type === 'register') callbacks = registerCbs
  if (type === 'all') callbacks = { ...loginCbs, ...registerCbs }
  Object.keys(callbacks).forEach(key => {
    callbacks[key].call(null, params)
  })
}

class AuthModal extends Component {
  constructor () {
    super()

    this.handleMobileInput = this.handleMobileInput.bind(this)
    this.handleAuthCodeInput = this.handleAuthCodeInput.bind(this)
    this.loginSubmit = this.loginSubmit.bind(this)
    this.getVerificationCode = this.getVerificationCode.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  state = {
    mobile: '', //手机号码
    authCode: '', //验证码
    authCodeMsg: '获取验证码',
    errorVisible: false, //提示框控制
    errorMsg: '', //提示框消息
    isSend: false, //是否已经发送
    time: 60 //倒计时时间
  }

  /**
   * 卸载页面
   * 清除定时器
   */
  componentWillUnmount () {
    const { countdownTimer } = this.state
    clearInterval(countdownTimer)
  }

  /**
   * 处理号码输入
   * @param {*} event
   */
  handleMobileInput (event) {
    this.setState({
      mobile: event.target.value
    })
  }

  /**
   * 处理验证码输入
   * @param {*} event
   */
  handleAuthCodeInput (event) {
    this.setState({
      authCode: event.target.value
    })
  }

  /**
   * 登录提交
   */
  async loginSubmit () {
    //检查号码和验证码正确性
    const { mobile = '', authCode = '' } = this.state
    const { onError, onSuccess, onCloseModal } = this.props
    let checkMsg = ''
    if (!/^\d{11}$/.test(mobile)) {
      checkMsg = `手机号格式错误，请重新填写。`
    }
    if (!/^\d{4}$/.test(authCode)) {
      checkMsg = `验证码格式错误，请重新填写。`
    }
    if (checkMsg) {
      Toast.error(checkMsg)
      return
    }

    // 注册尝试
    const params = {
      mobile,
      authCode,
      authType: 1,
      appId: 4,
      platform: 'H5'
    }
    const registerRes = await register(params)
    const { success, errorCode, errorMsg, data } = registerRes

    // 注册失败
    if (!success && errorCode !== '20103') {
      const cbError = new Error(errorMsg || '注册失败')
      if (!onError) {
        throw cbError
      }
      onError(cbError)
      return
    }

    // 老用户
    if (!success && errorCode === '20103') {
      // 登录
      const { mobile, authCode, appId, platform } = params
      const loginParams = { mobile, authCode, appId, platform }
      const loginRes = await login(loginParams)
      const { success, data, errorMsg } = loginRes
      if (!success) {
        onError && onError(new Error(errorMsg || '登录失败'))
        return
      }
      // 记录token
      localStorage.setItem('token', `${data}`)
      sessionStorage.setItem('LOCALS-ACCESS-TOKEN', `Bearer ${data}`)
      localStorage.setItem('LOCALS-ACCESS-TOKEN', `Bearer ${data}`)
      onSuccess && onSuccess()
      startCbs('login', params) // 全局登录回调触发
      onCloseModal && onCloseModal()
    }

    // 注册成功
    if (success) {
      // 记录token
      localStorage.setItem('token', `${data}`)
      sessionStorage.setItem('LOCALS-ACCESS-TOKEN', `Bearer ${data}`)
      localStorage.setItem('LOCALS-ACCESS-TOKEN', `Bearer ${data}`)
      onSuccess && onSuccess()
      startCbs('all', params) // 全局注册登录回调触发
      onCloseModal && onCloseModal()
      return
    }
  }

  countdown () {
    const { time } = this.state
    if (time <= 0) {
      this.setState({
        time: 60,
        isSend: false
      })
      return
    }
    this.setState({
      time: time - 1
    })
  }
  getVerificationCode () {
    const { mobile } = this.state
    if (!/^\d{11}$/.test(mobile)) {
      const errorMsg = `手机号格式错误，请重新填写。`
      Toast.error(errorMsg)
      return
    }
    const params = {
      mobile
    }
    sendVerificationCode(params).then(res => {
      const { success } = res
      if (success) {
        this.setState({
          isSend: true,
          countdownTimer: setInterval(() => {
            this.countdown()
          }, 1000)
        })
      } else {
        const { errorMsg = '验证码发送失败' } = res
        Toast.error(errorMsg)
      }
    })
  }
  handleTouchMove (e) {
    // e.preventDefault()
    e.stopPropagation()
    return false
  }
  handleCancel () {
    const { onCloseModal } = this.props
    onCloseModal && onCloseModal()
  }
  render () {
    const { mobile, authCode, isSend, time } = this.state
    const { visible = true } = this.props
    return visible ? (
      <div className="auth-modal" onTouchMove={this.handleTouchMove}>
        <div className="mark"></div>
        <div className="auth-modal--view">
          <img
            className="logo"
            src="https://oss.localhome.cn/new_icon/logo.png"
            alt=""
          ></img>
          <h1 className="auth-modal-title">LOCALS路客精品民宿</h1>
          <div className="auth-modal-des">注册即送100元新人红包</div>
          <div className="auth-form">
            <div className="auth-form--item">
              <div className="lable">手机号</div>
              <input
                className="auth-form--mobile"
                placeholder="请输入手机号"
                value={mobile}
                onChange={this.handleMobileInput}
              ></input>
            </div>
            <div className="auth-form--item">
              <div className="lable">验证码</div>
              <input
                className="auth-form--code"
                placeholder="请输入验证码"
                value={authCode}
                onChange={this.handleAuthCodeInput}
              ></input>
              {isSend ? (
                <div className="count">{time}秒</div>
              ) : (
                <div className="count" onClick={this.getVerificationCode}>
                  发送验证码
                </div>
              )}
            </div>
          </div>
          <div className="btn-box">
            <button className="btn__cancel" onClick={this.handleCancel}>
              取消
            </button>
            <button className="btn__login" onClick={this.loginSubmit}>
              注册/登录
            </button>
          </div>
        </div>
      </div>
    ) : (
      ''
    )
  }
}

export default AuthModal
