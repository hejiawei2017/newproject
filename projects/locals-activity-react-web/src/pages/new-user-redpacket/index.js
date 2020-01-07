import React from 'react'
import adapter from '../../common/adapter'
import utils from '../../common/utils'
import Modal from '../../components/Modal/Modal'
import {
  statisticsEvent,
  statisticsJoin,
  getUserDetail,
  sendNewUserCoupon
} from '../../common/api'

import { receiveCoupon } from '.././../apis/new-user-redpacket'

import './index.css'
const { gioTrack } = utils
const ACTIVITY_NAME = 'new-user-redpacket'
class App extends React.Component {
  constructor () {
    super()
    this.handleSignupTap = this.handleSignupTap.bind(this)
    this.getUserMsg = this.getUserMsg.bind(this)
    this.receiveCoupon = this.receiveCoupon.bind(this)
    this.reporting = this.reporting.bind(this)
    this.reportingJoin = this.reportingJoin.bind(this)
    this.sendYZCoupons = this.sendYZCoupons.bind(this)
    this.showModal = this.showModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.showErrModal = this.showErrModal.bind(this)
    this.closeErrModal = this.closeErrModal.bind(this)
    this.buildSucessContent = this.buildSucessContent.bind(this)
    this.toCoupon = this.toCoupon.bind(this)
    this.toIndex = this.toIndex.bind(this)
    this.signInAndReceiveCoupon = this.signInAndReceiveCoupon.bind(this)
    this.buildRules = this.buildRules.bind(this)
  }

  state = {
    token: '',
    channel: '',
    phone: '',
    user_id: '',
    visible: false,
    errVisible: false
  }

  /**
   * 钩子函数
   * 组件挂载
   */
  async componentDidMount () {
    // 获取url，并解析
    const url = window.location.href
    const { token = '', channel = '', from } = utils.parseURL(url).params || {}
    this.setState(
      {
        token,
        channel
      },
      () => {
        //登录而来，说明是点击按钮跳登录再跳回来的，这时候应该执行领券动作
        if (this.isFromLogin(from)) {
          setTimeout(() => {
            this.signInAndReceiveCoupon()
          }, 1000)
        }
      }
    )
    token && channel && this.reportingJoin() // 上报进入信息
  }

  isFromLogin (route) {
    return route === 'pages/h5/login/index'
  }

  /**
   * 处理登录按钮点击
   */
  handleSignupTap () {
    gioTrack('redpacket_tap_login_btn')
    this.signInAndReceiveCoupon()
  }

  /**
   *
   */
  async signInAndReceiveCoupon () {
    const { token } = this.state
    if (!token) {
      // 未登录则登录
      adapter.signIn()
    }
    await this.getUserMsg() // 获取user_id，并上报信息
    this.receiveCoupon()
  }
  /**
   * 领券
   */
  async receiveCoupon () {
    const params = {
      phone: this.state.phone,
      userInfo: this.state.userInfo,
      traceId: this.state.sid,
      activity_id: '1902220547571'
    }
    // debugger
    const token = this.state.token
    const res = await receiveCoupon(params, {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'LOCALS-ACCESS-TOKEN': 'Bearer ' + token
      }
    })
    // debugger
    const { success, errorCode = '', errorMsg = '' } = res
    if (success) {
      gioTrack('received_redpacket')
      this.sendYZCoupons() // 发送有赞券
      this.showModal() // 成功弹窗
      this.reporting()
      return
    }
    if (errorCode === 100004) {
      // 老用户
      this.showErrModal()
      return
    } else {
      this.showToast(errorMsg)
    }
  }

  /**
   * 有赞派券
   */
  sendYZCoupons () {
    let couponGroups = ['5414719', '6119775']
    const { phone: mobile } = this.state
    let tmpinner = null
    if (mobile) {
      let dcount = 0
      tmpinner = setInterval(() => {
        if (dcount >= couponGroups.length) {
          clearInterval(tmpinner)
          return
        }
        sendNewUserCoupon({
          mobile,
          couponGroupId: couponGroups[dcount]
        })
        dcount++
      }, 300)
    }
  }

  reporting () {
    const { user_id, channel } = this.state
    const _data = {
      user_id,
      event: 'attend',
      share_user: channel,
      activity_name: ACTIVITY_NAME
    }
    statisticsEvent(_data).then(res => {
      console.log(res)
    })
  }

  // 上报进入信息
  reportingJoin () {
    const { user_id, channel } = this.state
    const _data = {
      ticket_id: ACTIVITY_NAME,
      share_user_id: channel,
      join_user_id: user_id
    }
    statisticsJoin(_data).then(res => {
      console.log(res)
    })
  }

  // 获取用户信息
  async getUserMsg () {
    const { token, phone, user_id } = this.state

    if (phone || user_id) return // 如果已经获取过了，之后触发不在重新获取

    try {
      const response = await getUserDetail(token)
      const { success, errorCode, data, errorMsg, errorDetail } = response || {}

      // token无效去登陆
      if (errorCode === '20113') {
        adapter.signIn()
        return
      }

      // 错误提示
      if (!success) {
        this.showToast(errorMsg || errorDetail)
        return
      }

      const userInfo = Object.assign(
        {},
        data.platformUser || {},
        data.platformUserDetail || {}
      )
      const { mobile, id } = userInfo
      const phone = mobile
      const user_id = id
      // 存储phone,id
      this.setState({
        phone,
        user_id,
        userInfo: JSON.stringify(userInfo)
      })
    } catch (error) {
      this.showToast('网络错误，请稍后再试！')
    }
    return true
  }

  showToast (msg) {
    this.setState({
      modelMsg: msg,
      showToast: true
    })
    setTimeout(() => {
      this.setState({
        showToast: false
      })
    }, 3000)
  }

  showModal () {
    this.setState({ visible: true })
  }
  closeModal () {
    this.setState({ visible: false })
  }

  showErrModal () {
    this.setState({ errVisible: true })
  }

  closeErrModal () {
    this.setState({ errVisible: false })
  }

  toIndex () {
    gioTrack('redpackt_tap_to_index')
    adapter.navigate({
      method: 'reLaunch',
      url: '/pages/index/index'
    })
  }

  toCoupon () {
    gioTrack('redpaket_tap_to_coupon')
    adapter.navigate({
      url: '/pages/coupon/index'
    })
  }

  toInviteFriends () {
    gioTrack('redpackt_tap_to_invite_friends')
    adapter.navigate({
      url: '/pages/activity/invite-friends-201908/home/index'
    })
  }

  toUpGrade () {
    gioTrack('redpacket_tap_to_upgrade')
    adapter.navigate({
      url: '/pages/activity/upgrade29-201907/index'
    })
  }

  buildSucessContent () {
    return (
      <div className="modal-content modal-content__success">
        <div className="modal-content-success" />
        <div className="modal-content-success-des">
          新零售和旅行券
          <br />
          请前往【路客生活馆】查询
        </div>
        <div className="modal-content-success-btns">
          <div className="btn btn__left" onClick={this.toCoupon} />
          <div className="btn btn__right" onClick={this.toIndex} />
        </div>
      </div>
    )
  }

  buildErrContent () {
    return (
      <div className="modal-content modal-content__fail">
        <div className="content-box">
          <div
            className="img-item img-item--send-coupon"
            onClick={this.toInviteFriends}
          />
          <div
            className="img-item img-item--upgrade"
            onClick={this.toUpGrade}
          />
        </div>
      </div>
    )
  }

  buildRules () {
    return (
      <div className="activity-rules">
        <div className="activity-rules--title">活动规则</div>
        <div className="activity-rules--content">
          1.新人红包仅限路客新会员礼券；
          <br />
          2.新人红包包含：民宿50元立减券2张、生活馆30元满减券1张、当地旅行20元立减券1张；
          <br />
          3.生活馆和当地旅行优惠，请前往微信公众号【Locals路客精品民宿】-菜单【我的路客】-【路客生活馆】使用；
          <br />
          <div className="activity-rules--title">优惠券说明</div>
          <h4 className="item-title">1.民宿50元立减券</h4>
          <div className="item-detail">
            a.可抵扣入住首晚房费，不抵扣清洁费、保证金等其他费用；
            <br />
            b.不可与其他优惠叠加使用，仅限本人预订本人入住使用，使用后取消订单不可退回不可兑现；
            <br />
            c.可与路客会员折扣同时使用；
            <br />
            d.仅限会员线上支付抵扣部分金额，抵扣部分不开发票；
            <br />
            e.本券自获得之日生效，本券有效期为领取之日起1个月；
            <br />
            f.节假日通用；海外民宿不可使用；
            <br />
          </div>
          <h4 className="item-title">2.生活馆30元满减券</h4>
          <div className="item-detail">
            a.领券当日起265天内可用；
            <br />
            b.部分商品可用，满100元减30元；
            <br />
            c.仅限原价购买商品时使用；
            <br />
          </div>
          <h4 className="item-title">3.当地旅行20元立减券</h4>
          <div className="item-detail">
            a.有效期2019-08-06到2019-10-01；
            <br />
            b.部分商品可用，立减20元；
            <br />
            <br />
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { visible, errVisible } = this.state
    return (
      <div className="app-container">
        <Modal
          visible={visible}
          content={this.buildSucessContent()}
          onClose={this.closeModal}
        />
        <Modal
          visible={errVisible}
          content={this.buildErrContent()}
          onClose={this.closeErrModal}
        />
        <h1 className="container--title">新会员红包 </h1>
        <h1 className="container--big-title orange-color">150元优惠券</h1>
        <p className="container--des orange-color">
          全国60+城市 15000套热门房源
        </p>
        <div className="red-packet-box">
          <div className="signup-btn" onClick={this.handleSignupTap} />
          <p className="activity-des">活动解释权归路客民宿所有</p>
          <div
            className="img-btn-block send-redpacket"
            onClick={this.toInviteFriends}
          />
          <div className="img-btn-block up-grade" onClick={this.toUpGrade} />
        </div>

        {/* 活动规则模块 */}
        {this.buildRules()}
      </div>
    )
  }
}

export default App
