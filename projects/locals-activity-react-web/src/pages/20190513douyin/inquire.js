import React from 'react'
import { withRouter } from 'react-router-dom'
import { sentMobile, checkMobile } from '../../common/api'
import TopBanner2 from './topBanner2/index'
import './index.css'

class Inquire extends React.Component {
  state = {
    time: 60,
    isSend: false,
    code: '',
    phone: '',
    title: '订单查询',
    url:
      'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin04/%E8%AE%A2%E5%8D%95%E6%9F%A5%E8%AF%A2.jpg',
    seaching: false
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  // 获取验证码后倒计时逻辑
  countdown = () => {
    const time = this.state.time
    if (time <= 0) {
      this.setState({
        time: 60,
        isSend: false
      })
    } else {
      this.setState({
        time: time - 1
      })
    }
  }

  // 获取验证码
  getCode = () => {
    if (!this.state.phone) {
      alert('请先填写手机号码')
      return
    }
    const that = this
    const data = {
      account: this.state.phone
    }
    sentMobile(data).then(res => {
      if (res.data) {
        that.setState({
          isSend: true
        })
        that.interval = setInterval(() => {
          that.countdown()
        }, 1000)
      }
    })
  }

  changeOne = event => {
    this.setState({ phone: event.target.value })
  }

  changeTwo = event => {
    this.setState({ code: event.target.value })
  }

  // 查询订单逻辑
  search = () => {
    if (this.state.code === '') return
    this.setState({
      seaching: true
    })
    const data = {
      account: this.state.phone,
      authCode: this.state.code
    }
    checkMobile(data).then(res => {
      if (res.data) {
        this.props.history.push(`/orderList/${this.state.phone}`)
        this.setState({
          seaching: false
        })
      } else {
        this.setState({
          seaching: false
        })
        alert('验证码错误!')
        return
      }
    })
  }

  render() {
    const { isSend, time, title, url, seaching } = this.state
    return (
      <div className="inquire">
        <TopBanner2 title={title} url={url} />
        <div className="inquireFrom">
          <p className="inquireTitle">订单查询</p>
          <input
            className="inquireInput1"
            type="text"
            placeholder="请输入手机号"
            maxLength="11"
            onChange={this.changeOne}
          />
          <div className="inquireInput2">
            <input
              type="text"
              maxLength="4"
              placeholder="输入验证码"
              onChange={this.changeTwo}
            />
            {isSend ? (
              <span>{time}秒</span>
            ) : (
              <span onClick={this.getCode}>获取验证码</span>
            )}
          </div>
          {seaching ? (
            <p className="seach">处理中...</p>
          ) : (
            <p className="seach" onClick={this.search}>
              立即查询
            </p>
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(Inquire)
