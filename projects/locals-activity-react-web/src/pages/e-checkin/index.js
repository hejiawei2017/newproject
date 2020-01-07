import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import utils from "../../common/utils";
import "./index.css";
import zhezhao from "./images/zhezhao.png";
import logo from "./images/logo.png";
import icon01 from "./images/icon01.png";
import icon02 from "./images/icon02.png";
import icon03 from "./images/icon03.png";
import paySuccess from "./images/success_icon.png";
import QRCode from "qrcode.react";
import { minaCode, ipadOrderLotel, lotelInfo } from "../../common/api";
import moment from "moment";
import { useTransition, animated, config } from "react-spring";
import EnvConfig from '../../config/env-config'

//state: 0关闭二维码，1小程序码，2入住登记码，3支付成功，4投保成功

class App extends React.Component {
  constructor () {
    super();
    let href = window.location.href;
    let params = utils.parseURL(href).params;
    console.log('parms',params);
    this.state = {
      state: '',
      response: false,
      endpoint: 'https://v.localhome.cn',
      listenId: params.targetId,
      houseId: params.hotel
    };
  }

  componentDidMount () {
    // let foo = params.get('query');
    const { endpoint, listenId } = this.state;
    console.log(this.props.params);
    this.getHotelInfo();
    const socket = socketIOClient(endpoint);
    socket.on('connect', () => {
      console.log('id===', socket.id); // 'G5p5...'
    });
    // socket.on('message', data => {
    //   console.log('messagedocker',data);
    // })
    socket.on(listenId, data => {
      console.log(data);
      let {orderNo:orderId,state,paramsId, url} = data;
      if (state === '0' || state === '4') {
        this.setState({
          state
        })
      } else {
        this.handleEvent({state,orderId,paramsId,url});
      }
    });
  }

  async getHotelInfo () {
    const {houseId = '1133566712436801680'} = this.state;
    const call = await lotelInfo(houseId);
    if (call.data) {
      const temgImages = call.data.images[0].images;
      const slides = temgImages.map(( e, index) => {
        return {id: index, url: e.imgPath}
      });
      const houseInfo = {
        hotelName: call.data.hotelName,
        slides
      }
      this.setState({
        houseInfo
      })
    }
  }

  async handleEvent ({state,orderId,paramsId, url}) {
    const ordercall = await ipadOrderLotel({ orderId });
    if (ordercall.data) {
      const { checkinDate, checkoutDate } = ordercall.data;
      const momentCheckin = moment(checkinDate);
      const momentCheckout = moment(checkoutDate);
      const fomatCheckIn = momentCheckin.format("LL");
      const fomatCheckOut = momentCheckout.format("LL");
      const checkinWeekDay = this.formatWeekCN(momentCheckin.day());
      const checkoutWeekDay = this.formatWeekCN(momentCheckout.day());
      const gap = momentCheckin
        .from(momentCheckout)
        .replace("天前", "")
        .trim();
      const stayinfo = `${fomatCheckIn}(周${checkinWeekDay})—${fomatCheckOut}(周${checkoutWeekDay})，共${gap}晚`;
      const orderInfo = { ...ordercall.data, stayinfo, url };
      if (state === '1') {
        const params = {
          page: 'pages/order/ebooking-order/index',
          scene: `paramsId=${paramsId}`
        }
         const minaCodecall = await minaCode(params)
         if (minaCodecall.data) {
           orderInfo.minaCode = 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com' + minaCodecall.data;
         }
      }
      console.log('something=', state, paramsId);
      this.setState({
        paramsId,
        state,
        orderInfo
      });
    }
  }

  formatWeekCN (day) {
    switch (day) {
      case 0:
        return "日";
      case 1:
        return "一";
      case 2:
        return "二";
      case 3:
        return "三";
      case 4:
        return "四";
      case 5:
        return "五";
      case 6:
        return "六";
      default:
        break;
    }
  }

  renderHotelCrossFade () {
    const {houseInfo} = this.state;
    return (
      <div>
        <CrossFade slides={houseInfo.slides}/>
        <div className="head">
          <img className="logo" src={logo} alt=""></img>
          <div className="welcome">欢迎您入住路客HOTELS{houseInfo.hotelName}</div>
        </div>
      </div>
    )
  }

  renderClose () {
    setTimeout(() => {
      this.setState({
        state: ''
      })
    }, 3000);
    return (
      <div className="closePanel">
        <img src={paySuccess} alt=""></img>
        <div className="title">支付成功</div>
        <div className="msg">路客君祝您入住愉快～</div>
        <div className="hint">3s后自动关闭</div>
      </div>
    );
  }

  renderOrderStatue () {
    const { state } = this.state;
    // 直接关闭
    if (state === '0' || state === '4') {
      this.setState({ state: '' })
      return;
    }
    if (state === '3') {
      console.info('入住成功');
      return this.renderClose();
    }
    return this.renderCheckin();
  }

  renderChildPanel () {
    const { state,houseInfo } = this.state;
    return (
      <div className="container">
        <img
          className="checkin__bg"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/aai/6230192045877890.png"
          alt=""
        />
        <div className="checkin__mask" />
        <div className="checkin__infoblock">
          <img className="logo" src={logo} alt=""></img>
          <div className="welcome">欢迎您入住路客HOTELS{houseInfo.hotelName}店</div>
          {this.renderOrderStatue()}
        </div>
      </div>
    );
  }

  renderCheckin () {
    const { state, orderInfo } = this.state;
    return (
      <div>
        <div className="item">
            <img src={icon01} alt=""></img>
            <div>预订房型：{orderInfo.roomName}</div>
          </div>
          <div className="item">
            <img src={icon02} alt=""></img>
            <div>入住人数：{orderInfo.tenantNumer}</div>
          </div>
          <div className="item">
            <img src={icon03} alt=""></img>
            <div>入住时间：{orderInfo.stayinfo}</div>
          </div>
          <div className="qrcode-block">
            <div className="qrcode-title">请用微信扫码</div>
            <div className="qrcode-wrap">
              <div className="qrcode-imgwrap">
                {state === '1' ? (
                  <img
                    className="qrcode-pic"
                    src={orderInfo.minaCode}
                    alt="11"
                  />
                ) : (
                  <QRCode
                    className="qrcode-pic"
                    value={orderInfo.url}
                    size={98}
                  />
                )}
              </div>
              {this.renderStateStep(state)}
            </div>
          </div>
      </div>
    )
  }

  renderStateStep (state) {
    const { paramsId } = this.state
    return state === '2' ? (
      <div className="qrcode-step">
        <div>
          <span className="step-icon">1</span>
          登记入住人信息
        </div>
        <div>
          <span className="step-icon">2</span>短信获取房客密码
        </div>
      </div>
    ) : (
      <div className="qrcode-step">
        <div>
          <span className="step-icon">1</span>
          确认入住信息： {paramsId}
        </div>
        <div>
          <span className="step-icon">2</span>
          微信支付
        </div>
        <div>
          <span className="step-icon">3</span>短信获取房客密码
        </div>
      </div>
    );
  }

  renderContentContainer () {
    const { state } = this.state
    if (state) {
      return this.renderChildPanel();
    }
    return this.renderHotelCrossFade();
  }

  render () {
    const { houseInfo } = this.state;
    if (!houseInfo) {
      return null;
    }

    return (
      <div className="page">{this.renderContentContainer()}</div>
    )
  }
}

const CrossFade = ({slides}) => {
  const [index, set] = useState(0);
  const transitions = useTransition(slides[index], item => item.id, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 1, tension: 180, friction: 120 }
  });
  useEffect(
    () => void setInterval(() => {
      set(state => (state + 1) % slides.length)
    }, 3000),
    []
  );
  return transitions.map(({ item, props, key }) => (
    <animated.div
      key={key}
      className="crossbg"
      style={{
        ...props,
        backgroundImage: `url(${item.url})`
      }}
    />
  ));
}

export default App;
