import React from 'react'
import './index.css'
import axios from 'axios'
// import payh5 from '../../common/payh5'
import utils from '../../common/utils'
import { copyText } from '../../utils/copy'
import {
  statisticsEvent,
  statisticsJoin,
  sendNewUserCoupon,
  trackingConversionAd
} from '../../common/api'
import Image from '../../components/Image/Image'
import Login from '../../components/Login/Login.js'
import RollMsgs from '../../components/RollMsgs/RollMsgs.js'
import config from './config.js'

let localsPay = null
let isWxBrowser = false
let ua = navigator.userAgent
if (/micromessenger/i.test(ua) || /_sq_/i.test(ua)) {
  isWxBrowser = true
}

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      showLoginModel: false, // 登录界面
      rollList: [
        '手机156****6571已购买9.9元路客精品民宿体验卡',
        '手机177****9991已购买9.9元路客精品民宿体验卡',
        '手机186****2039已购买9.9元路客精品民宿体验卡',
        '手机177****9991已购买9.9元路客精品民宿体验卡',
        '手机159****9455已购买9.9元路客精品民宿体验卡',
        '手机173****1231已购买9.9元路客精品民宿体验卡',
        '手机181****4467已购买9.9元路客精品民宿体验卡',
        '手机176****4113已购买9.9元路客精品民宿体验卡',
        '手机151****0110已购买9.9元路客精品民宿体验卡',
        '手机186****9223已购买9.9元路客精品民宿体验卡',
        '手机189****3469已购买9.9元路客精品民宿体验卡'
      ],
      loginFailModel: false, //登录失败提示框
      loginSuccessModel: false, //登录成功提示框
      buyManber: window.localStorage.buyManber
        ? window.localStorage.buyManber
        : 123645, //购买人数
      userToken: '', //用户token
      loginMsg: '', //登录信息
      channel: '', //频道码
      errorMsg: '', //错误提示信息
      errorVisible: false, //提示框
      openId: ''
    }
    this.changeloginPhone = this.changeloginPhone.bind(this)
    this.changevrCode = this.changevrCode.bind(this)
    this.loginSuccess = this.loginSuccess.bind(this)
    this.loginFail = this.loginFail.bind(this)
    this.closeLogin = this.closeLogin.bind(this)
    this.initbuyManber = this.initbuyManber.bind(this)
    this.buyDiscount = this.buyDiscount.bind(this)
    this.closeModel = this.closeModel.bind(this)
    this.reporting = this.reporting.bind(this)
    this.reportingJoin = this.reportingJoin.bind(this)
    this.copyStr = this.copyStr.bind(this)
    this.showTipDialog = this.showTipDialog.bind(this)
    this.getWxOpenId = this.getWxOpenId.bind(this)
    this.paySuccess = this.paySuccess.bind(this)
  }

  componentWillMount() {
    // window.axios = axios
    // 获取url，并解析
    const that = this
    const url = window.location.href
    // 如果有channel，进行记录
    let params = utils.parseURL(url).params
    this.params = params
    if (params.channel) {
      const channel = params.channel
      const openId = params.openId
      that.setState({ channel, openId })
    }

    // 成功支付逻辑处理

    localsPay = new window.LocalsPay({
      returnUrl: 'https://i.localhome.cn/v/1907191157974',
      callback: result => {
        this.paySuccess(result)
      }
    })
    // this.paySuccess({success:true})
    if (params.code) {
      //微信授权回调的页面
      this.getWxOpenId().then(res => {
        //调用起支付
        if (res) {
          this.payH5(JSON.parse(window.localStorage['loginMsg99']))
        } else {
          this.showTipDialog('抱歉支付失败，请稍后重试')
        }
      })
      let returnUrl = window.location.href
      returnUrl = utils.jsUrlHelper.delUrlParam(returnUrl, 'code')
      window.history.replaceState({}, '', returnUrl)
    }

    if (window.sessionStorage.payWxSuccess == 1) {
      //微信成功支付的时候需要刷新
      this.setState({
        loginSuccessModel: true,
        showLoginModel: false,
        loginFailModel: false
      })

      window.sessionStorage.payWxSuccess = 2
    }
    this.initbuyManber()
  }
  paySuccess(result) {
    if (result.success) {
      if (!config.isDev) {
        if (window.localStorage['successTip']) {
          return
        }
      }
      if (isWxBrowser) {
      } else {
        this.setState({
          loginSuccessModel: true,
          showLoginModel: false,
          loginFailModel: false
        })
      }

      window.localStorage['successTip'] = true
      let mobile = ''
      let loginMsg99 = JSON.parse(window.localStorage['loginMsg99'])
      if (loginMsg99) {
        mobile = loginMsg99.master_phone
      }
      let couponGroups = [
        '6031634',
        '6031635',
        '6031237',
        '6031632',
        '6031236',
        '6031238'
      ]
      if (mobile) {
        let dcount = 0
        this.tmpinner = setInterval(() => {
          if (dcount >= couponGroups.length) {
            clearInterval(this.tmpinner)
            return
          }
          sendNewUserCoupon({
            mobile: mobile,
            couponGroupId: couponGroups[dcount]
          })
          dcount++
        }, 300)
        this.reporting(mobile)
      }
      this.replaceUrl()
    }
  }
  getWxOpenId(type) {
    let ua = navigator.userAgent
    let isWechat = ua.toLowerCase().indexOf('micromessenger') > -1
    if (isWechat) {
      let code = null
      let search = window.location.search
      if (search) {
        let reg = new RegExp('(^|&)code=([^&]*)(&|$)', 'i')
        // 匹配目标参数
        let result = search.substr(1).match(reg)
        //返回参数值
        code = result ? decodeURIComponent(result[2]) : ''
      }
      // 如果没有code
      if (!code) {
        let href = window.location.href
        href = encodeURIComponent(href)
        let url = `https://f.localhome.cn/authorization/index.html?url=${href}&env=prod`
        if (type === 'base') {
          if (href.indexOf('?') === -1) {
            href += '?authType=base'
          } else {
            href += '&authType=base'
          }
        }
        return new Promise(resolve => {
          window.location.replace(url)
          resolve(false)
        })
      } else {
        return new Promise((resolve, reject) => {
          let data = {
            code: code,
            app: 3
          }
          axios
            .post(
              'https://ms.localhome.cn/api/wechat/wechat/auth/wx-user',

              data,
              {
                headers: {
                  'Content-type': 'application/json'
                },
                dataType: 'json'
              }
            )
            .then((res, textStatus, request) => {
              if (res.data.success) {
                let { token, openId } = res.data.data
                sessionStorage.setItem('token', token)
                sessionStorage.setItem('openId', openId)
                resolve(true)
              } else {
                let { errorCode } = res.data
                // code已被使用 无效的code
                if (errorCode === '40163' || errorCode === '40029') {
                  // 清空code重新授权登录, code参数必须是在最后一个参数
                  let { href } = window.location
                  let codeIndex = href.indexOf('code=')
                  href = href.slice(0, codeIndex - 1)
                  window.location.replace(href)
                  resolve(false)
                } else {
                  reject(res)
                }
              }
            })
            .catch(err => {
              reject(err)
            })
        })
      }
    }
  }
  replaceUrl() {
    //支付成功后替换url
    let depparams = [
      'auth_app_id',
      'payStatus',
      'timestamp',
      'seller_id',
      'sign_type',
      'app_id',
      'version',
      'trade_no',
      'sign',
      'total_amount',
      'method',
      'out_trade_no',
      'charset',
      'code',
      '_outTradeNo'
    ]
    let returnUrl = window.location.href
    for (var i = 0, l = depparams.length; i < l; i++) {
      returnUrl = utils.jsUrlHelper.delUrlParam(returnUrl, depparams[i])
    }
    window.history.replaceState({}, '', returnUrl)
    if (isWxBrowser) {
      //如果是微信下
      if (window.sessionStorage.payWxSuccess != 2) {
        window.sessionStorage.payWxSuccess = 1
        window.location.href = returnUrl
      }
    }
    return returnUrl
  }
  initbuyManber() {
    //记住购买人数
    if (!window.localStorage.buyManber) {
      window.localStorage.buyManber = this.state.buyManber
    } else {
      this.setState({
        buyManber: window.localStorage.buyManber
      })
    }
    let buyManber = this.state.buyManber
    this.buyManberInterval = setInterval(() => {
      this.setState({
        buyManber: buyManber++
      })
      window.localStorage.buyManber = this.state.buyManber
    }, 20000)
  }
  componentWillUnmount() {
    clearInterval(this.buyManberInterval)
  }
  closeModel() {
    this.setState({
      loginFailModel: false,
      loginSuccessModel: false
    })
  }
  changeloginPhone(e) {
    this.setState({
      loginPhone: e.target.value
    })
  }
  changevrCode(e) {
    this.setState({
      vrCode: e.target.value
    })
  }
  closeLogin() {
    //关闭登录框
    this.setState({
      showLoginModel: false
    })
  }
  // 上报领券信息
  reporting(phone) {
    const _data = {
      user_id: phone,
      event: 'attend',
      share_user: this.state.channel || '',
      activity_name: '20190724Discount99'
    }
    statisticsEvent(_data).then(res => {
      console.log(res)
    })
    let clickId = this.params.gdt_vid || this.state.channel || 'noparam'
    trackingConversionAd({
      clickId: clickId,
      url:
        'https://i.localhome.cn/v/' +
        config.activity_id +
        '?gdt_vid=' +
        clickId,
      actionType: 'COMPLETE_ORDER',
      actionValue: '9.9'
    })
  }

  // 上报进入信息
  reportingJoin(phone) {
    const _data = {
      ticket_id: '20190724Discount99',
      share_user_id: this.state.channel,
      join_user_id: phone
    }
    statisticsJoin(_data).then(res => {
      console.log(res)
    })
  }

  loginFail(res) {
    //登录失败，可能接口报错，也可能是老用户
    this.setState({
      showLoginModel: false,
      loginFailModel: true
    })
  }

  loginSuccess(res, commonparam, options) {
    this.reportingJoin(commonparam.master_phone)
    if (config.isDev) {
    } else {
      if (commonparam.olduser) {
        //老用户
        this.loginFail()
        return
      }
    }

    //登录成功
    //1.调用接口去支付
    //2.支付完成去派券
    this.setState({
      showLoginModel: false
    })
    window.localStorage['loginMsg99'] = JSON.stringify(commonparam)
    this.payH5(commonparam, () => {})
  }
  getPaySuccessURL() {
    let returnUrl = utils.jsUrlHelper.delUrlParam(
      window.location.href,
      'payStatus'
    )
    if (returnUrl.indexOf('?') == -1) {
      returnUrl = returnUrl + '?payStatus=1'
    } else {
      returnUrl = returnUrl + '&payStatus=1'
    }
    return returnUrl
  }
  payH5(commonparam, callback) {
    //支付模块
    let returnUrl = window.location.href

    let paymentChannel = []
    let openId = ''
    if (isWxBrowser) {
      //微信浏览器
      paymentChannel = ['wechat']
      if (!window.sessionStorage.openId) {
        this.getWxOpenId()
        return
      } else {
        openId = window.sessionStorage.openId
      }
    } else {
      //外部浏览器
      paymentChannel = ['wechatH5', 'alipay']
    }

    localsPay.pay({
      userToken: commonparam.token,
      goodsId: config.goodsId,
      buyNum: 1,
      env: 'prod',
      openId: openId,
      paymentChannel: paymentChannel,
      returnUrl: returnUrl,
      callback: res => {
        callback(res)
      }
    })
  }

  buyDiscount() {
    if (config.isDev) {
      this.setState({
        showLoginModel: true
      })
      return
    }

    //购买按钮
    if (!window.localStorage['successTip']) {
      this.setState({
        showLoginModel: true
      })
      return
    } else {
      //表示是老用户了
      this.loginFail()
    }
  }

  copyStr(str) {
    //复制文字
    copyText('Locals路客精品民宿', () => {
      this.showTipDialog('已复制到粘贴板')
    })
  }
  showTipDialog(msg) {
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
  render() {
    let { rollList, buyManber, errorVisible, errorMsg } = this.state
    return (
      <div id="app" className="shuqiContainer">
        <div className="rollMsgs">
          <RollMsgs rollList={rollList} />
        </div>
        <div className="topImg">
          <Image
            src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/nine99/nine-1.png"
            alt=""
          />
        </div>
        <div className="main">
          <div className="main-item-img">
            <div className="group-juan" onClick={this.buyDiscount}>
              <Image
                src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/nine99/nine-2.png"
                alt=""
              />
              <div className="top-buy-btn" onClick={this.buyDiscount}>
                &nbsp;
              </div>
              <div className="down-count-tip">已有{buyManber}人成功购买</div>
            </div>
          </div>
          {/* <div className="main-item-img">
            <div className="down-count-container">
              <Image
                className="down-count"
                src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/nice99/down-count.png"
                alt=""
              />
              <div className="down-count-tip">
                已有{buyManber}人成功购买 <br />
                路客精品民宿体验卡
              </div>
            </div>
          </div> */}

          <div onClick={this.buyDiscount} className="main-item-img baokuang">
            <Image
              src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/nine99/nine-3.png"
              alt=""
            />
          </div>
          <div className="main-item-img">
            <div onClick={this.buyDiscount} className="get-juan-btn">
              <Image
                src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/nine99/nine-8.png"
                alt=""
              />
            </div>
          </div>

          <div onClick={this.buyDiscount} className="main-item-img">
            <Image
              src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/nine99/nine-4.png"
              alt=""
            />
          </div>
          <div className="main-item-img">
            <div onClick={this.buyDiscount} className="get-juan-btn">
              <Image
                src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/nice99/get-juan-btn.png"
                alt=""
              />
            </div>
          </div>

          <div onClick={this.buyDiscount} className="main-item-img">
            <Image
              src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/nine99/nine-5.png"
              alt=""
            />
          </div>
          <div className="main-item-img tmpBuyBtn">
            <div onClick={this.buyDiscount} className="get-juan-btn">
              <Image
                src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/nice99/get-juan-btn.png"
                alt=""
              />
            </div>
          </div>

          <div className="main-item-img">
            <Image
              src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/nine99/nine-6.png"
              alt=""
            />
          </div>

          <div className="main-item-img">
            <div style={{ 'padding-left': '20px', 'padding-right': '20px' }}>
              <Image
                src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/nine99/nine-7.png"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="imgPreload">
          <img
            src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/dic99/login-model.png"
            alt=""
          />
        </div>

        {this.state.showLoginModel && (
          <Login
            loginSuccess={this.loginSuccess}
            loginFail={this.loginFail}
            closeLogin={this.closeLogin}
            goodsId={config.goodsId}
          />
        )}
        {this.state.loginFailModel && (
          <div className="dialog-vague">
            <div className="dialog">
              <div className="dialog-fail">
                <div>
                  <img
                    className="dialog-img"
                    src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/failmodel.png"
                    alt=""
                  />
                </div>
              </div>
              <div className="closeBtn">
                <img
                  src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/20190717shuqi/shuqi2.0.png"
                  alt=""
                  onClick={this.closeModel}
                />
              </div>
            </div>
          </div>
        )}
        {this.state.loginSuccessModel && (
          <div className="dialog-vague">
            <div className="dialog">
              <div className="dialog-success">
                <div>
                  <div className="success-top">恭喜您</div>
                  <img
                    className="dialog-img"
                    src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/successmodel.png"
                    alt=""
                  />
                  <div className="success-bottom" onClick={this.copyStr}>
                    Locals路客精品民宿
                  </div>
                </div>
              </div>
              <div className="closeBtn">
                <img
                  src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/20190717shuqi/shuqi2.0.png"
                  alt=""
                  onClick={this.closeModel}
                />
              </div>
            </div>
          </div>
        )}
        {errorVisible && <div className="tip-dialog">{errorMsg}</div>}
      </div>
    )
  }
}

export default App
