import React from 'react'
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'
import './index.css'
import Btn from './components/Btn'
import Login from '../../components/AuthModal'
import utils from '../../common/utils'
import Toast from '../../components/Toast'
import config from './config'
import axios from 'axios'
import {
  purchaseRight,
  statisticsEvent,
  statisticsJoin
} from '../../common/api'
import Modal from '../../components/Modal/Modal'
const { gioTrack } = utils

let localsPay = null
let isWxBrowser = false
let ua = navigator.userAgent
if (/micromessenger/i.test(ua) || /_sq_/i.test(ua)) {
  isWxBrowser = true
}
const ACTIVITY_NAME = 'coupon59-201906'
const usersMeta = {
  first: ['ceid', 'kraken', 'tedceil', 'vvie', 'mmk', 'quil', 'taro', 'vick'],
  name: [
    '456787',
    '876789',
    '378263',
    '907127',
    '076432',
    '763146',
    '1028',
    '0721'
  ]
}

// 获取随机数
function randomCount (max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

class App extends React.Component {
  constructor () {
    super()
    this.generateusageNotice = this.generateusageNotice.bind(this)
    this.startSwiper = this.startSwiper.bind(this)
    this.getWxOpenId = this.getWxOpenId.bind(this)
    this.loginSuccess = this.loginSuccess.bind(this)
    this.buy = this.buy.bind(this)
    this.buildSucessContent = this.buildSucessContent.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.openModal = this.openModal.bind(this)
    this.openFailModal = this.openFailModal.bind(this)
    this.closeFailModal = this.closeFailModal.bind(this)
    this.payCb = this.payCb.bind(this)
    this.paySuccess = this.paySuccess.bind(this)
    this.replaceUrl = this.replaceUrl.bind(this)
    this.reportingJoin = this.reportingJoin.bind(this)
    this.reporting = this.reporting.bind(this)
    this.toDownload = this.toDownload.bind(this)
  }

  state = {
    nameShow: '',
    nameTimer: null,
    bannerData: [
      'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1560411655588banner1.png',
      'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1560411690988banner2.png',
      'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1560411704353banner3.png',
      'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1560411718061banner4.png'
    ],
    senceData: [
      'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1560411731380banner5.png',
      'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1560411744547banner6.png'
    ],
    visible: false,
    failVisible: false
  }

  componentWillMount () {
    gioTrack('enter_59_activity')
    Login.config({
      onSuccess: this.loginSuccess
    })
    const url = window.location.href
    // 如果有channel，进行记录
    let params = utils.parseURL(url).params
    this.params = params
    if (params.channel) {
      const channel = params.channel
      const openId = params.openId
      this.setState({ channel, openId })
    }

    // 成功支付逻辑处理
    // todo return url 修改
    localsPay = new window.LocalsPay({
      returnUrl: 'https://i.localhome.cn/v/1908231919725',
      callback: result => {
        this.paySuccess(result)
      }
    })

    if (params.code) {
      //微信授权回调的页面
      this.getWxOpenId().then(res => {
        //调用起支付
        if (res) {
          this.payH5(this.payCb)
        } else {
          Toast.error('抱歉支付失败，请稍后重试')
        }
      })
      let returnUrl = window.location.href
      returnUrl = utils.jsUrlHelper.delUrlParam(returnUrl, 'code')
      window.history.replaceState({}, '', returnUrl)
    }

    if (parseInt(window.sessionStorage.payWxSuccess) === 1) {
      //微信成功支付的时候需要刷新
      this.openModal()
      window.sessionStorage.payWxSuccess = 2
    }
  }
  paySuccess (res) {
    // 支付回调
    if (res.success) {
      gioTrack('pay_59_success')
      this.reporting()
      this.replaceUrl()
      this.openModal()
    } else {
      this.openFailModal()
    }
  }

  replaceUrl () {
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
      if (parseInt(window.sessionStorage.payWxSuccess) !== 2) {
        window.sessionStorage.payWxSuccess = 1
        window.location.href = returnUrl
      }
    }
    return returnUrl
  }

  loginSuccess () {
    // 登录成功进行支付模块逻辑
    Login.close()
    this.reportingJoin()
    this.payH5(this.payCb)
  }

  isLogin () {
    // 页面级登录
    const token = localStorage.getItem('LOCALS-ACCESS-TOKEN')
    return !!token
  }

  // 处理购买按钮点击
  buy () {
    gioTrack('click_59_buy_btn')
    if (this.isLogin()) {
      this.payH5(this.payCb)
    } else {
      Login.show()
    }
  }

  async payH5 (callback) {
    const localsToken = localStorage.getItem('LOCALS-ACCESS-TOKEN')
    const options = {}
    options.headers = {
      'LOCALS-ACCESS-TOKEN': `${localsToken}`
    }
    const res = await purchaseRight(
      {
        itemId: config.goodsId,
        buyNum: '1'
      },
      options
    )

    const { success, errorCode } = res

    if (!success && errorCode === '20113') {
      // 无效token，重新登录
      Login.show()
      return
    }
    // todo 这里可以提前检查权限，无需支付组件去检查，未来优化

    const token = localStorage.getItem('token')
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
      userToken: token,
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

  payCb (res) {
    // 支付回调
    const { success } = res
    if (!success) {
      this.openFailModal()
    }
  }

  getWxOpenId (type) {
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

  componentDidMount () {
    setTimeout(() => {
      this.startSwiper()
    }, 1500)
    this.generateName()
  }

  componentWillUnmount () {
    const { nameTimer } = this.state
    nameTimer && clearTimeout(nameTimer)
  }

  startSwiper () {
    const defaultConf = {
      loop: true,
      slidesPerView: 'auto',
      // slidesPerView: 1.5,
      centeredSlides: true,
      spaceBetween: 0,
      grabCursor: true,
      autoplay: {
        delay: 2000
      }
    }

    new Swiper(
      '.banner-swiper',
      Object.assign({}, defaultConf, {
        pagination: {
          //分页器
          el: '.swiper-pagination'
        }
      })
    )

    new Swiper('.sence-swiper', defaultConf)
  }

  generateName () {
    const firstMaxIndex = usersMeta.first.length - 1
    const nameMaxIndex = usersMeta.name.length - 1
    let nameShow =
      usersMeta.first[randomCount(firstMaxIndex, 0)] +
      usersMeta.name[randomCount(nameMaxIndex, 0)]
    nameShow =
      nameShow.substr(0, 3) +
      '***' +
      nameShow.substr(nameShow.length - 3, nameShow.length)

    const nameTimer = setTimeout(() => {
      this.generateName()
    }, 2500)
    this.setState({
      nameShow,
      nameTimer
    })
  }

  generateusageNotice () {
    return (
      <div className="usage-notice">
        <div className="usage-notice--title">
          <img
            className="usage-notice--title-img"
            src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/59_yuan/usage_title.png"
            alt=""
          />
        </div>
        <div className="usage-notice--content">
          1.新用户专享，每人限购一次，只需支付59元即可获得300元房费抵扣券；
          <br />
          2.本券仅限本人购买使用，预订及入住手机号码必须一致；
          <br />
          3.本券自购买7天后起生效可用，有效期半年，节假日不可用；
          <br />
          4.本券自购买起7天内可退，仅退59元的实际支付金额，退款后该券自动作废；购买超过7天则不可退；
          <br />
          5.300元房费抵扣券适用于路客精品民宿全国房源，仅可抵扣首晚费用，房费不足300元按300元抵扣，超过300元补差额；不可抵扣清洁费、保证金等其他费用；{' '}
          <br />
          6.特惠部分不可开发票，发票金额按用户预订房源实际支付金额申请；
          <br />
          7.本券使用后取消订单视为特惠放弃，特惠资格不返还，已支付金额按现有取消规则退款；
          <br />
          8.如有任何问题，可在“Locals路客精品民宿”公众号对话框输入“人工”转人工服务在线咨询；
          <br />
          9.不可用日期：中秋节2019.09.12至2019.09.14、国庆节2019.09.30至2019.10.06、元旦2019.12.31至2020.01.01、春节2020.01.23至2020.01.29；清明节2020.04.04至2020.04.06；
          <br />
          劳动节2020.05.01至2020.05.03；端午节2020.06.25至2020.06.27；
          <br />
          10.广州广交会期间不可用：春交会2019.04.14至2019.05.04、秋交会2019.10.14至2019.11.03；
          <br />
          11.路客海外民宿不可用
          <br />
        </div>
      </div>
    )
  }
  toDownload () {
    gioTrack('tap_59_to_download')
    window.location.href = 'https://i.localhome.cn/v/1906192035544'
  }
  buildSucessContent () {
    return (
      <div className="modal-box">
        <img
          className="modal--img"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/59_yuan/59_success_modal.png"
          alt=""
        />
        <div className="download-btn" onClick={this.toDownload}>
          下载APP
        </div>
      </div>
    )
  }
  buildfailContent () {
    return (
      <div className="modal-box">
        <img
          className="modal--img"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/59_yuan/59_fail_modal.png"
          alt=""
        />
        <div className="download-btn" onClick={this.toDownload}>
          下载APP
        </div>
      </div>
    )
  }

  openModal () {
    this.setState({
      visible: true
    })
  }
  closeModal () {
    this.setState({
      visible: false
    })
  }

  openFailModal () {
    this.setState({
      failVisible: true
    })
  }

  closeFailModal () {
    this.setState({
      failVisible: false
    })
  }

  // 上报进入信息
  reportingJoin (phone = '') {
    const { channel = '' } = this.state
    const _data = {
      ticket_id: ACTIVITY_NAME,
      share_user_id: channel,
      join_user_id: phone
    }
    statisticsJoin(_data).then(res => {
      console.log(res)
    })
  }
  // 上报领券信息
  reporting (phone = '') {
    const { channel = '' } = this.state
    const _data = {
      event: 'attend',
      share_user: channel,
      activity_name: ACTIVITY_NAME
    }
    statisticsEvent(_data).then(res => {
      console.log(res)
    })
  }

  render () {
    const { bannerData, nameShow, senceData, visible, failVisible } = this.state
    return (
      <div className="app-container">
        <Modal
          visible={visible}
          content={this.buildSucessContent()}
          onClose={this.closeModal}
        />
        <Modal
          visible={failVisible}
          content={this.buildfailContent()}
          onClose={this.closeFailModal}
        />
        <div className="banner-swiper">
          <div className="swiper-wrapper">
            {bannerData.map((item, index) => (
              <div className="swiper-slide" key={index}>
                <img className="swiper-img" src={item} alt=""></img>
              </div>
            ))}
          </div>
        </div>
        <div className="swiper-pagination"></div>
        <Btn onClick={this.buy} />
        <div className="des">
          <img
            className="des-img"
            src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1560334683512send-des.png"
            alt=""
          />
        </div>
        <div className="des-notice">
          <img
            className="notice-icon"
            src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1560335399557laba.png"
            alt=""
          />
          <span className="notice-text">
            <span className="name">{nameShow}</span>
            <img
              className="notice-text"
              src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1560396255682send-des2.png"
              alt=""
            />
          </span>
        </div>
        <div className="experience-box">
          <Btn className="experience-btn" onClick={this.buy} />
        </div>
        <div className="joy-box">
          <div className="sence-swiper">
            <div className="swiper-wrapper">
              {senceData.map((item, index) => (
                <div className="swiper-slide" key={index}>
                  <img className="swiper-img" src={item} alt=""></img>
                </div>
              ))}
            </div>
          </div>
          <Btn onClick={this.buy} />
        </div>
        <div className="quality-box">
          <Btn className="quality-btn" onClick={this.buy} />
        </div>
        {this.generateusageNotice()}
        <div className="statement">
          *本活动的解释权归北京路客互联网科技有限公司所有
        </div>
      </div>
    )
  }
}

export default App
