import React from 'react'
import './index.css'
import Cell from '../../components/Cell'
import moment from 'dayjs'
import Modal from '../../components/Modal/Modal'
import Toast from '../../components/Toast'
import utils from '../../common/utils'
import { getUserDetail } from '../../common/api'

const {
  inviteFriendsRecords,
  getInviteFriendsBonusNum
} = require('../../common/api')

class App extends React.Component {
  constructor () {
    super()
    this.buildBonus = this.buildBonus.bind(this)
    this.buildBonusCard = this.buildBonusCard.bind(this)
    this.buildInviteFriendsRecords = this.buildInviteFriendsRecords.bind(this)
    this.buildCellContent = this.buildCellContent.bind(this)
    this.buildRightContent = this.buildRightContent.bind(this)
    this.showRules = this.showRules.bind(this)
    this.closeRules = this.closeRules.bind(this)
    this.buildRulesContent = this.buildRulesContent.bind(this)
    this.showMoreDetail = this.showMoreDetail.bind(this)
    this.sharePage = this.sharePage.bind(this)
    this.toBalance = this.toBalance.bind(this)
  }
  state = {
    myBonus: 0, // 我的奖励金
    isShowRules: false, // 是否展示活动规则
    modalViewStyle: {
      // 活动规则弹框样式自定义
      width: '90%',
      backgroundColor: 'white',
      borderRadius: '10px'
    },
    inviteFriendsPage: {
      // 邀请好友记录page信息
      page: 1,
      pageSize: 10
    },
    bonusShareDetail: [], // 邀请好友记录
    hasMoreShareDetail: true // 是否还有更多邀请好友记录
  }

  componentDidMount () {
    this.init()
  }

  init () {
    this.checkLogin()
      .then(() => {
        this.setState({
          inviteFriendsPage: {
            // 邀请好友记录page信息
            page: 1,
            pageSize: 10
          },
          bonusShareDetail: [], // 邀请好友记录
          hasMoreShareDetail: true // 是否还有更多邀请好友记录
        })
        this.showMoreDetail()
        this.getMyBonus()
      })
      .catch(e => {
        console.log(e)
      })
  }

  toBalance () {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        url: 'wallet'
      })
    )
  }

  sharePage () {
    const { userId = '' } = this.state
    const conf = {
      url: 'weChatShareMini',
      title: '送你100元路客精品民宿红包福利，点击领取~',
      path: `/pages/activity/invite-friends-201908/home/index?parentId=${userId}`,
      hdImageData:
        'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/invite_friends/banner.png?x-oss-process=image/resize,w_320/quality,Q_60'
    }
    window.ReactNativeWebView.postMessage(JSON.stringify(conf))
  }

  /**
   * 登录检查
   */
  checkLogin () {
    return new Promise((resolve, reject) => {
      const { token: tokenCached, userId: userIdCached } = this.state
      if (tokenCached && userIdCached) {
        resolve(tokenCached)
        return
      }
      const url = window.location.href
      const { token = '', channel = '' } = utils.parseURL(url).params || {}
      if (!token) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            url: 'login'
          })
        )
        reject('未登录')
      }
      this.setState({
        token,
        channel
      })
      const ref = Toast.loading()
      getUserDetail(token)
        .then(res => {
          const { success, errorCode, data, errorMsg, errorDetail } = res || {}
          if (!success) {
            reject('获取用户信息失败')
            return
          }
          const userInfo = Object.assign(
            {},
            data.platformUser || {},
            data.platformUserDetail || {}
          )
          const { mobile, id } = userInfo
          const phone = mobile
          const userId = id
          this.setState({
            phone,
            userId: userId
          })
          resolve(token)
        })
        .finally(() => {
          Toast.hide(ref)
        })
    })
  }

  showRules () {
    this.setState({
      isShowRules: true
    })
  }

  /**
   * 分页获取分享的记录（被分享者获取100元）
   */
  async showMoreDetail () {
    const { page, pageSize } = this.state.inviteFriendsPage
    const { userId, token } = this.state
    // TODO 获取userid
    const id = userId
    const res = await inviteFriendsRecords(id, page, pageSize, token)
    if (res.success) {
      const cached = Array.isArray(res.data) ? res.data : []
      const concatArr = []
      if (cached.length < pageSize) {
        // 如果返回的数据没有足够多条，则没有更多
        this.setState({
          hasMoreShareDetail: false
        })
      }
      cached.forEach(item => {
        // 如果原先已经包含这条记录，则这条记录不要增加重复展示出来
        const has = this.state.bonusShareDetail.filter(
          detail => detail.id === item.id
        )
        if (has.length > 0) return
        concatArr.push(item)
      })
      const { page: pageCached } = this.state.inviteFriendsPage
      this.setState({
        bonusShareDetail: this.state.bonusShareDetail.concat(concatArr),
        inviteFriendsPage: {
          page: pageCached + 1
        }
      })
    } else {
      Toast.text(res.errorDetail || res.errorMsg)
      return
    }
  }

  /**
   * 获取奖励金额
   */
  async getMyBonus () {
    const { userId, token } = this.state
    const res = await getInviteFriendsBonusNum(userId, token)
    if (res.success) {
      this.setState({
        myBonus: res.data
      })
    }
  }

  closeRules () {
    this.setState({
      isShowRules: false
    })
  }

  buildRulesContent () {
    return (
      <div className="rules-content invite-panel">
        <div className="header">
          <span className="title">活动规则</span>
        </div>
        <div className="text-content">
          <span>
            1.用户通过邀请好友转发活动页面或生成海报，每成功邀请一位好友注册可获得1元奖金奖励，现金将以储值的方式返还至您的路客账户的余额，好友获得100元新人红包（内含2*50元立减券）；
            <br />
            2.好友需完成注册，双方方可获得优惠券；每成功邀请一位好友注册，会在邀请好友的列表中出现；
            <br />
            3.首次参与邀请有礼活动时，需累计分享三位新用户并全部注册成功后，方可发放3元奖金至您的余额（我的-我的钱包-余额）并同步显示在上方的奖励金总额处，之后每多分享1位新用户可多得1元奖金，每月最多累计奖励100元。
            <br />
            4.余额内的储值金可抵扣房费，可累积使用；
            <br />
            5.本活动与房源详情页的分享有礼活动为同一活动，规则共享；
            <br />
          </span>
          <span className="title">50元立减券规则如下：</span>
          <br />
          <span>
            1.可抵扣入住房费，不抵扣清洁费、保证金等其他费用；
            <br />
            2.不可与其他优惠叠加使用，仅限本人预订本人入住使用，使用后取消订单不可退回不可兑现；
            <br />
            3.可与路客会员折扣同时使用；
            <br />
            4.仅限会员线上支付是抵扣部分金额，抵扣部分不开发票；
            <br />
            5.预定及入住有效期为自领取之日起3个月；
            <br />
            6.节假日通用；
            <br />
          </span>
          <span className="title">
            *本活动最终解释权归北京路客互联网科技有限公司所有
          </span>
          <br />
        </div>
        <div className="rules-btn" onClick={this.closeRules}>
          我知道了
        </div>
      </div>
    )
  }

  buildBonus () {
    return (
      <div className="bonus">
        <div className="bonus-item">
          <div className="bonus-item--title">自己得到</div>
          <img
            className="bonus-item--img"
            src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/invite_friends/1yuan_bonus.png"
            alt=""
          ></img>
        </div>
        <div className="bonus-item">
          <div className="bonus-item--title">朋友得到</div>
          <img
            className="bonus-item--img"
            src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/invite_friends/100yuan_bonus.png"
            alt=""
          ></img>
        </div>
      </div>
    )
  }

  buildBonusCard () {
    const { myBonus } = this.state
    return (
      <div className="bonus-card" onClick={this.toBalance}>
        <span className="title">我的奖励金总额</span>
        <div className="content">
          <span className="text__bottom__small">¥ </span>
          <span className="text__big">{myBonus}</span>
        </div>
        <span className="des">可累计！可无门槛抵扣房费！快去分享吧！</span>
      </div>
    )
  }

  buildCellContent (name) {
    return (
      <div className="cell-content">
        {name}通过我的分享注册
        <br />
        并领取了100元新人红包
      </div>
    )
  }

  /**
   * 将dateTime 分离为date 和 time两部分，并设置到data中
   */
  separateDateTime (dateTime) {
    if (!dateTime) return
    const date = moment(dateTime).format('YYYY-MM-DD')
    const time = moment(dateTime).format('HH:mm:ss')
    return {
      date,
      time
    }
  }

  buildRightContent (dateTime) {
    const { date, time } = this.separateDateTime(dateTime)
    return (
      <div className="cell-right">
        <div className="time">{date}</div>
        <div className="time">{time}</div>
      </div>
    )
  }

  buildInviteFriendsRecords () {
    const { hasMoreShareDetail, bonusShareDetail } = this.state
    return (
      <div className="invite-records invite-panel">
        <div className="header">
          <span className="title">邀请好友</span>
        </div>
        <div>
          {bonusShareDetail.map(item => {
            return (
              <Cell
                content={this.buildCellContent(item.nick_name)}
                right={this.buildRightContent(item.create_time)}
                imgUrl={item.avatar}
              ></Cell>
            )
          })}

          {hasMoreShareDetail ? (
            <div className="show-more-btn" onClick={this.showMoreDetail}>
              查看更多
            </div>
          ) : (
            <div className="record-empty">暂无更多</div>
          )}
        </div>
      </div>
    )
  }
  render () {
    const { isShowRules, modalViewStyle } = this.state
    return (
      <div className="app-container">
        <Modal
          visible={isShowRules}
          content={this.buildRulesContent()}
          modalViewStyle={modalViewStyle}
          onClose={this.closeRules}
          isShowCloseBtn={false}
        ></Modal>
        <div className="banner">
          <img
            className="banner-img"
            src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/invite_friends/banner.png"
            alt=""
          ></img>
          <div className="rules-btn" onClick={this.showRules}>
            活动规则
          </div>
        </div>
        {this.buildBonus()}
        <div className="invite-button" onClick={this.sharePage}>
          邀请好友
        </div>
        <div className="bonus-box">
          {this.buildBonusCard()}
          {this.buildInviteFriendsRecords()}
        </div>
      </div>
    )
  }
}

export default App
