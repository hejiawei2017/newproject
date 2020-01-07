import React from 'react'
import axios from 'axios'
import adapter from '../../common/adapter'
import HouseList from '../../components/HouseListMuQingJie/HouseList'
import './index.css'
import utils from '../../common/utils'
import { statisticsEvent, statisticsJoin, getCoupon } from '../../common/api'

const { tabData, tabData2 } = require('./muqingjie.json')

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      houseList: [],
      houseList2: [],
      tabData: tabData,
      tabData2: tabData2,
      nowTab: 'item1',
      nowTab2: 'item5',
      discount: 0.8,
      token: '',
      phone: '',
      showModel: false,
      showToast: false,
      modelMsg: '',
      move: {},
      isTurned: false,
      channel: ''
    }
    this.optBtnRender = this.optBtnRender.bind(this)
    this.lookMoreClick = this.lookMoreClick.bind(this)
    this.closeModel = this.closeModel.bind(this)
    this.jumpToCoupon = this.jumpToCoupon.bind(this)
    this.renderPrice82 = this.renderPrice82.bind(this)
    this.renderPrice50 = this.renderPrice50.bind(this)
  }

  componentWillMount() {
    // 获取数据
    this.getData()
    // 获取url，并解析
    const that = this
    const url = window.location.href
    // 如果有channel，进行记录
    if (utils.parseURL(url).params.channel) {
      const channel = utils.parseURL(url).params.channel
      that.setState({ channel })
    }
    // 判断url中是否有token，有则判断为已登录状态，将token进行存储
    if (utils.parseURL(url).params.token) {
      const token = utils.parseURL(url).params.token
      that.setState({ token })
      // 获取phone
      that.getphone(token)
    }
  }

  showToast(msg) {
    this.setState({
      modelMsg: msg,
      showToast: true
    })
    setTimeout(() => {
      this.setState({ showToast: false })
    }, 3000)
  }

  // 获取phone
  getphone(token) {
    const that = this
    axios
      .get('https://ms.localhome.cn/api/platform/user/user-info-detail', {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json; charset=UTF-8',
          'LOCALS-ACCESS-TOKEN': 'Bearer ' + token
        }
      })
      .then(function(response) {
        // token无效去登陆
        if (response.data.errorCode === '20113') {
          adapter.signIn()
          return
        }

        // 有token且有效
        if (response.data.data.platformUser) {
          const phone = response.data.data.platformUser.mobile
          const user_id = response.data.data.platformUser.id
          // 存储phone,id
          that.setState({
            phone,
            user_id
          })
          // 判断是否有过抽奖，将isturned设为true
          try {
            const _phone = localStorage.getItem(phone)
            if (_phone && _phone === '1') {
              that.setState({ isTurned: true })
            }
          } catch (error) {
            console.log(error)
          }
          that.reportingJoin()
        } else {
          this.showToast('网络错误，请稍后再试！')
        }
      })
      .catch(function(error) {
        this.showToast('网络错误，请稍后再试！')
      })
  }

  // 获取优惠券
  getCoupon() {
    if (!this.state.token) {
      this.getphone(this.state.token)
    }
    const that = this
    const phone = {
      master_uuid: that.state.phone
    }
    const _data = {
      activity_id: '1907191157973',
      payload: JSON.stringify(phone)
    }
    getCoupon(_data)
      .then(res => {
        if (res.success) {
          that.setState({
            showModel: true,
            isTurned: true
          })
          // 上报统计
          if (that.state.channel !== '') {
            that.reporting()
          }
          window.gio && window.gio('track', 'qixigetCoupon', 1)
          // 存下phone在storage
          const localstroage = window.localStorage
          localstroage.setItem(that.state.phone, 1)
        } else {
          if (res.errorCode === 100004) {
            that.setState({
              showModel: true,
              isTurned: true
            })
            const localstroage = window.localStorage
            localstroage.setItem(that.state.phone, 1)
          } else {
            that.setState({
              showModel: true,
              isTurned: false
            })
          }
        }
      })
      .catch(function(error) {
        console.log(error)
      })
  }

  // 上报领券信息
  reporting() {
    const _data = {
      user_id: this.state.user_id,
      event: 'attend',
      share_user: this.state.channel,
      activity_name: 'mqj20190505'
    }
    statisticsEvent(_data).then(res => {
      console.log(res)
    })
  }

  // 上报进入信息
  reportingJoin() {
    const _data = {
      ticket_id: 'mqj20190505',
      share_user_id: this.state.channel,
      join_user_id: this.state.user_id
    }
    statisticsJoin(_data).then(res => {
      console.log(res)
    })
  }

  // 获取数据
  getData(type) {
    const that = this
    const _type = type || this.state.nowTab
    let _data = []
    let tabdatas = [...this.state.tabData, ...this.state.tabData2]

    for (let i = 0; i < tabdatas.length; i++) {
      if (_type === tabdatas[i].type) {
        _data = tabdatas[i].ids
      }
    }
    if (_data === []) {
      return
    }
    axios
      .post(
        'https://ms.localhome.cn/api/prod-plus/activity/20190409/house',
        _data
      )
      .then(function(response) {
        if (response.data.success) {
          const data = response.data.data
          if ('item1#item2#item3#item4'.indexOf(_type) !== -1) {
            that.setState({
              houseList: data.reverse()
            })
          } else {
            that.setState({
              houseList2: data
            })
          }
        }
      })
      .catch(function(error) {
        console.log(error)
      })

    if (!type) {
      axios
        .post(
          'https://ms.localhome.cn/api/prod-plus/activity/20190409/house',
          this.state.tabData2[0].ids
        )
        .then(function(response) {
          if (response.data.success) {
            const data = response.data.data
            that.setState({
              houseList2: data
            })
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  }

  // 关闭model
  closeModel() {
    this.setState({ showModel: false })
  }

  // 改变tab
  changeTab(type) {
    if ('item1#item2#item3#item4'.indexOf(type) !== -1) {
      this.setState({
        nowTab: type
      })
    } else {
      this.setState({
        nowTab2: type
      })
    }

    this.getData(type)
  }

  clearClick(e) {
    e.stopPropagation()
  }

  // 转跳逻辑
  jumpPage(url) {
    adapter.navigate({ url: `/pages/${url}/index?channel=zhuhai01` })
  }
  appointmentClick() {}
  optBtnRender() {
    return (
      <span
        className="appointment"
        onClick={() => {
          this.appointmentClick()
        }}
      >
        立即预约
      </span>
    )
  }
  lookMoreClick() {
    adapter.navigate({ method: 'reLaunch', url: '/pages/index/index' })
  }
  jumpToCoupon() {
    adapter.navigate({ url: '/pages/coupon/index' })
  }
  renderPrice82(price) {
    return Number.parseInt(price * 0.82)
  }
  renderPrice50(price) {
    return price - 50
  }
  render() {
    const { tabData, tabData2 } = this.state
    return (
      <div id="app" className="shuqiContainer">
        <div className="topImg">
          <img
            src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/qixi/top-bg.png"
            alt=""
          />
        </div>
        <div className="main">
          <div className="receiveTicket">
            <div className="title">
              <img
                className="receiveTicket-top-tip"
                src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/qixi/top-tip.png"
                alt=""
              />
            </div>
            <img
              className="quan-img"
              src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/qixi/top-tick.png"
              alt=""
            />
            <img
              className="takeBtn"
              src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/qixi/lingqu.png"
              onClick={this.getCoupon.bind(this)}
              alt=""
            />
          </div>

          <div className="tabList">
            <div className="title">
              <img
                className="frist-project-top"
                src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/qixi/frist-project-top.png"
                alt=""
              />
            </div>
            <div className="receiveTab">
              {tabData.map(item => {
                return (
                  <div
                    key={item.type}
                    className="tabCom"
                    onClick={this.changeTab.bind(this, item.type)}
                  >
                    {this.state.nowTab === item.type ? (
                      <div className="tab ac">
                        {/* <img className="tabImg" src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557050161680tab-btn_ac.png" alt="" /> */}
                        <span>{item.name}</span>
                      </div>
                    ) : (
                      <div className="tab">
                        {/* <img className="tabImg" src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557050143343tab-btn.png" alt="" /> */}
                        <span>{item.name}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <HouseList
              houseList={this.state.houseList}
              discount={this.state.discount}
              isTurned={this.state.isTurned}
              optBtnRender={this.optBtnRender}
              renderPrice={this.renderPrice82}
            />

            <img
              className="lookMore"
              onClick={this.lookMoreClick.bind(this)}
              src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/qixi/look-more.png"
              alt=""
            />
          </div>

          <div className="tabList">
            <div className="title">
              <img
                className="frist-project-top"
                src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/qixi/hot-city.png"
                alt=""
              />
            </div>
            <div className="receiveTab">
              {tabData2.map(item => {
                return (
                  <div
                    key={item.type}
                    className="tabCom"
                    onClick={this.changeTab.bind(this, item.type)}
                  >
                    {this.state.nowTab2 === item.type ? (
                      <div className="tab ac">
                        {/* <img className="tabImg" src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557050161680tab-btn_ac.png" alt="" /> */}
                        <span>{item.name}</span>
                      </div>
                    ) : (
                      <div className="tab">
                        {/* <img className="tabImg" src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557050143343tab-btn.png" alt="" /> */}
                        <span>{item.name}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <HouseList
              houseList={this.state.houseList2}
              discount={this.state.discount}
              isTurned={this.state.isTurned}
              optBtnRender={this.optBtnRender}
              renderPrice={this.renderPrice50}
            />

            <img
              className="lookMore"
              onClick={this.lookMoreClick.bind(this)}
              src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/qixi/look-more.png"
              alt=""
            />
          </div>
        </div>

        {this.state.showModel && (
          <div className="ruleTips">
            {this.state.isTurned ? (
              <div className="dialog">
                <div className="dialog-success">
                  <img
                    className="dialog-img"
                    src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/qixi/receive-success.png"
                    alt=""
                  />
                  <div className="jumpToCoupon" onClick={this.jumpToCoupon} />
                </div>
                <div className="closeBtn">
                  <img
                    src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/20190717shuqi/shuqi2.0.png"
                    alt=""
                    onClick={this.closeModel}
                  />
                </div>
              </div>
            ) : (
              <div className="dialog">
                <div className="dialog-recived">
                  <div className="dialog-recived-container">
                    <img
                      className="dialog-img"
                      src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/qixi/have-take.png"
                      alt=""
                    />
                    <div className="dialog-img2" onClick={this.jumpToCoupon} />
                  </div>
                  <div className="jumpToCoupon" onClick={this.jumpToCoupon} />
                </div>
                <div className="closeBtn">
                  <img
                    src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/20190717shuqi/shuqi2.0.png"
                    alt=""
                    onClick={this.closeModel}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {this.state.showToast && (
          <div className="toast-wrap">
            <div className="toast">
              <p>{this.state.modelMsg}</p>
            </div>
          </div>
        )}

        <div className="imgPreload">
          <img
            src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557140745343dialog-success.png"
            alt=""
          />
          <img
            src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557140780802dialog-recived.png"
            alt=""
          />
        </div>
      </div>
    )
  }
}

export default App
