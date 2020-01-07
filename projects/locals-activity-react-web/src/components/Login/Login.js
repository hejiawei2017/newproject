/*
 公共的站外登陆模块，用于取得用户信息
*/

import React, { Component } from 'react'
import './Login.css'
import {
  sendVerificationCode,
  register,
  login,
  purchaseRight,
  registerMemberInfo,

} from '../../common/api'
class Login extends Component {
  constructor() {
    super()
    this.state = {
      loginPhone: '', //手机号码
      verCode: '', //验证码
      vercodeMsg: '获取验证码',
      errorVisible: false, //提示框控制
      errorMsg: '', //提示框消息
      isSend: false, //是否已经发送
      time: 60 //倒计时时间
    }

    this.changeloginPhone = this.changeloginPhone.bind(this)
    this.changeverCode = this.changeverCode.bind(this)
    this.loginSubmit = this.loginSubmit.bind(this)
    this.showTipDialog = this.showTipDialog.bind(this)
    this.getVerificationCode = this.getVerificationCode.bind(this)
  }
  changeloginPhone(event) {
    this.setState({
      loginPhone: event.target.value
    })
  }

  changeverCode(event) {
    this.setState({
      verCode: event.target.value
    })
  }
  showTipDialog(msg) {
    //错误提示框
    this.setState({
      errorMsg: msg,
      errorVisible: true
    })
    this.setTimeoutTimer = setTimeout(() => {
      this.setState({
        errorVisible: false
      })
    }, 1500)
  }
  componentWillUnmount() {
    clearTimeout(this.setTimeoutTimer)
    clearInterval(this.state.interval)
  }
  loginSubmit() {
    //点击登录按钮
    if (!/^\d{11}$/.test(this.state.loginPhone)) {
      const errorMsg = `手机号格式错误，请重新填写。`
      this.showTipDialog(errorMsg)
      return
    }
    if (!/^\d{4}$/.test(this.state.verCode)) {
      const errorMsg = `验证码格式错误，请重新填写。`
      this.showTipDialog(errorMsg)
      return
    }
    const params = {
      mobile: this.state.loginPhone,
      authCode: this.state.verCode,
      authType: 1,
      appId: 4,
      platform: 'H5'
    }
    register(params).then(res => {
      /**
       * 情况：
       * 1.注册报错，错误码不为20103【用户已存在】，直接抛错误提示框
       * 2.注册报错，错误码为20103【用户已存在】，先帮用户自动登录，再发优惠券
       * 3.注册成功，接口帮用户自动登录，直接发优惠券
       */
      // 1
      const options = {}
      const { mobile } = params
      const couponParams = {
        guest_phone: mobile,
        master_phone: mobile,
        guest_avatar_url:
          'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/discount99/default-logo.jpg'
      }
      if (!res.success && res.errorCode != '20103') {
        //接口报错
        this.showTipDialog(res.errorMsg)
        return
      } else if (!res.success && res.errorCode === '20105') {
        this.showTipDialog(res.errorMsg)
      } else if (!res.success && res.errorCode === '20103') {
        //已经存在 测试
        const { mobile, authCode, appId, platform } = params
        const loginParams = { mobile, authCode, appId, platform }
        const couponParams = {
          guest_phone: mobile,
          master_phone: mobile,
          guest_avatar_url:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/discount99/default-logo.jpg'
        }
        login(loginParams).then(resl => {
          if (!resl.success) {
            this.showTipDialog(resl.errorMsg)
            this.props.loginFail(resl)
            return
          }
          options.headers = {
            'LOCALS-ACCESS-TOKEN': `Bearer ${resl.data}`
          }
          couponParams.token = resl.data
          couponParams.olduser = false
          purchaseRight({ 
          itemId: this.props.goodsId,
          buyNum: '1',},options).then((resp)=>{
            
          
            if(resp.data.itemPurchaseRights[2].isAuthenticated||resp.data.itemPurchaseRights[4].isAuthenticated){// 民宿老用户和商城老用户都不能买
              this.props.loginFail(res)
            }else{
              this.props.loginSuccess(resl, couponParams, options)
            }
          })
        })


     //   this.props.loginFail(res)

      } else if (!res.success) {
        this.showTipDialog(res.errorMsg)
      } else if (res.success) {
        // 3
        options.headers = {
          'LOCALS-ACCESS-TOKEN': `Bearer ${res.data}`
        }
        registerMemberInfo({}, options).then(resMember => {
          if (!resMember.success) {
            return
          }
        })
        couponParams.token = res.data
        this.props.loginSuccess(res, couponParams, options)
      }
    })
  }

  countdown() {
    const time = this.state.time
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
  getVerificationCode() {
    if (!/^\d{11}$/.test(this.state.loginPhone)) {
      const errorMsg = `手机号格式错误，请重新填写。`
      this.showTipDialog(errorMsg)
      return
    }
    const params = {
      mobile: this.state.loginPhone
    }
    sendVerificationCode(params).then(res => {
      if (res.success) {
        this.setState({
          isSend: true
        })
        this.setState({
          interval: setInterval(() => {
            this.countdown()
          }, 1000)
        })
      } else {
        this.showTipDialog(res.errorMsg)
      }
    })
  }
  render() {
    const {
      loginPhone,
      verCode,
      vercodeMsg,
      errorVisible,
      errorMsg,
      isSend,
      time
    } = this.state
    const href = 'javascript:void(0)'
    return (
      <div className="dialog-vague">
        <div className="login-container">
          <img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/dic99/login-model.png" />
          <div className="login-inner">
            <div className="login-tips">
              <div>登录</div>
              <div className="no-bold">登录后即可购买</div>
            </div>
            <div className="login-item">
              <input
                type="text"
                placeholder="手机号码"
                value={loginPhone}
                onChange={this.changeloginPhone}
              />
            </div>

            <div className="vercode-container">
              <div className="login-item">
                <input
                  type="text"
                  placeholder="验证码"
                  value={verCode}
                  onChange={this.changeverCode}
                />
              </div>

              <div className="vercode-container-btn">
                {isSend ? (
                  <span className="ipc-vercode">{time}秒</span>
                ) : (
                  <span
                    className="ipc-vercode"
                    onClick={this.getVerificationCode}
                  >
                    {vercodeMsg}
                  </span>
                )}
              </div>
            </div>

            <div className="">
              <a
                className="login-submit"
                href={href}
                onClick={this.loginSubmit || function() {}}
              >
                {this.submitMsg || '立即登录'}
              </a>
            </div>
          </div>

          <div className="login-footer">
            <img
              onClick={this.props.closeLogin}
              src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/20190717shuqi/shuqi2.0.png"
              alt=""
            />
          </div>
          {errorVisible && <div className="tip-dialog">{errorMsg}</div>}
        </div>
      </div>
    )
  }
}
Login.defaultProps = {
  loginSuccess: function() {},
  loginFail: function() {},
  closeLogin: function() {}
}

export default Login
