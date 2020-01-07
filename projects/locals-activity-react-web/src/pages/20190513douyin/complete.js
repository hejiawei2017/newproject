import React from 'react';
import { withRouter } from 'react-router-dom';
import { douyinUpdate, sendMessage,getCouponDouyin } from '../../common/api';
import TopBanner from './topBanner/index';
import utils from '../../common/utils';
import './index.css';

const douyinData = require('./douyinData.json');
const localstroage = window.localStorage;

class Complete extends React.Component {
  state = {
    url: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin05/juchi1.5x.png',
    title: '支付完成',
    icon: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin05/zhifuwancheng.png',
    orderInfo: {},
    contact: {},
    orderid: '',
    orderData: {},
    price: 0,
    time: '',
    landlordPhone: '',
    payModalTip:false,
    payModalStateTip:'',
    douyinDataObj:{notice:[{},{text:[]},{}]}
  };

  componentDidMount() {
    const url = window.location.href;
    const orderData = utils.parseURL(url).params;
    const id = this.props.match.params.id;
    const orderid = this.props.match.params.orderid;
    const price = this.props.match.params.price;
    const phone = this.props.match.params.phone;
    const time = utils.formatTime(this.props.match.params.time);
    const douyinDataObj =  douyinData.data[id - 1];
    const orderInfo = douyinDataObj.order;
    const landlordPhone =douyinDataObj.contact.landlordPhone;
    this.setState({
      id,
      orderInfo,
      orderid,
      landlordPhone,
      price,
      time,
      orderData,
      contact: douyinData.data[id - 1].contact,
      phone,
      douyinDataObj: douyinDataObj
    });

    // 判断是否是支付页面的回调
    if (orderData && orderData !== {} && orderData.app_id) {
      this.updateOrder(orderData,orderInfo,landlordPhone);
    }
    // 清楚localstroage
    localstroage.removeItem('orderData');
    localstroage.removeItem('orderNeedModal');
  
    //如果是7的时候就派发券
    if(this.props.match.params.id==="7" &&  !window.localStorage['CouponPhone'+phone]){
      if(window.sessionStorage.orderListin==1){
        return
      }
      this.setState({//提示正在派券
        payModalTip:true
      })
      setTimeout(()=>{
        let data = {
          mobile:phone
        }
        console.log(data)
        getCouponDouyin(phone).then((res)=>{//2. 接口派发券
          if (res.success ) {//成功
            this.setState({
              payModalStateTip:"success"
            })
          }else{//失败
            this.setState({
              payModalStateTip:"fail"
            })
          }
          this.setState({//关闭提示派券
            payModalTip:false
          })
          window.localStorage['CouponPhone'+phone] = true
        }).catch((e) => {
          this.setState({ payModalTip: false })
        })
      },1000)
    }

    if(this.props.match.params.id==="7" &&  window.localStorage['CouponPhone'+phone] && window.sessionStorage.orderListin!=1){
        this.setState({
          payModalStateTip:"fail"
        })
    }
    if(window.sessionStorage.orderListin==1){
      window.sessionStorage.orderListin = 2
    }

  }
  updateOrder(orderData,orderInfo,landlordPhone) {
    const data = {
      orderId: orderData.out_trade_no,
      payId: orderData.app_id,
      payStatus: 2,
    };
    douyinUpdate(data).then(res => {
      console.log(res);
    });
    this.sendMsg(orderData,orderInfo,landlordPhone);
  }

  sendMsg(orderData,orderInfo,landlordPhone) {
    const data = {
      orderId: orderData.out_trade_no,
      commodity: `${orderInfo.title},${orderInfo.type}`,
      address: orderInfo.address,
      bookingStartDate: orderInfo.bookingStartDate,
      bookingEndDate: orderInfo.bookingEndDate,
      checkInDate: orderInfo.checkInDate,
      checkOutDate: orderInfo.checkOutDate,
      landlordPhone,
    };
    sendMessage(data).then(res => {
      console.log(res);
    });
  }
  modalPayTip(){//关闭提示框
    this.setState({
      payModalStateTip:''
    })
  }
  lookReason(){//查看原因
    this.props.history.replace( `/lookReason`);
  }
  goBackhome(){
    window.location.replace("https://www.douyinvideo.net/magic/runtime/?id=6551&appType=douyin")
  }
  render() {
    const {  orderInfo, orderData, contact, orderid, price, time,payModalTip,payModalStateTip,douyinDataObj } = this.state;
    return (
      <div className="complete">
        <div className="topImgCon">
          <img  src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin50/4a68c93b9e39b24d988490e8463aacb.png" />
        </div>
        <div className="orderInfo">
          <div>
            <p className="completeTitle">{orderInfo.title}</p> 
            <p className="completeType">{orderInfo.type}</p>
            <p>订单编号：{orderData.out_trade_no ? orderData.out_trade_no : orderid}</p>
            <p>民宿地址：{orderInfo.address}</p>
            <p>使用有效期：有效期至{orderInfo.time}</p>
            <p>入住有效期：有效期至{orderInfo.checkIn}</p>
            <p>下单时间：{time}</p>
            <p>订单金额：￥{orderData.total_amount ? orderData.total_amount : price}</p>
          </div>
        </div>
        <div className="orderInfo">
          <div>
            <p className="completeTitle">民宿主联系方式</p>
            <p>手机号：{contact.phone}</p>
            <p>微信号：{contact.wechat}</p>
          </div>
        </div>
        <div className="wayOfUse">
          <p className="wayOfUseTitle">使用方式</p>
            {douyinDataObj.notice&&douyinDataObj.notice[1].text&&(douyinDataObj.notice[1].text.map((item)=>{
              return <p  key={item}>{item}</p>
            }))}
        </div>
        <div className="backIndex" onClick={this.goBackhome.bind(this)}>回到首页</div>

        {payModalTip && 
          <div className='modal' >
            <div className='payModal'>
              <p>支付成功，正在为你派券，请稍后</p>
            </div>
          </div> 
        }
      {payModalStateTip=="fail" && 
         <div className='modal'>
            <div className='payStatus fail' >
            <div className="textTip">
             <p>非常抱歉</p>
             <p>派券失败</p>
            </div>
           <div className="tipBtn"  onClick={this.lookReason.bind(this)}>查看原因</div>

           </div>  
          </div>
        }

      {payModalStateTip=="success" && 
          <div className='modal' >
            <div className='payStatus success'>
              <div className="textTip">
                <p >派券成功</p>
                <p className="minshow">可登录“路客精品民宿预定”</p>
                <p className="minshow">微信小程序查看</p>
                <p className="minshow">具体方式请查看“使用说明”</p>
              </div>
              <div className="tipBtn" onClick={this.modalPayTip.bind(this)}>关闭</div>
            </div>
          </div> 
        }
      </div>
    );
  }
}

export default withRouter(Complete);
