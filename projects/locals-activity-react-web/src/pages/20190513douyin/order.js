import React from 'react';
import { pay, checkPay, douyinOrder } from '../../common/api';
import { withRouter } from 'react-router-dom';
import utils from '../../common/utils';
import TopBanner2 from './topBanner2/index';
import './index.css';

const douyinData = require('./douyinData.json');
const localstroage = window.localStorage;

class Order extends React.Component {
  state = {
    url: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin05/%E8%AE%A2%E5%8D%95%E7%A1%AE%E8%AE%A4.jpg',
    title: '订单确认',
    orderInfo: {},
    count: 1,
    truePrice: 0,
    name: '',
    phone: '',
    id: 1,
    paying: false,
    errModal: false
  };

  componentDidMount() {
    // 检查是否要显示弹窗
    this.checkNeedShowModal()
    // 获取页面参数
    const id = this.props.match.params.id;
    const orderInfo = douyinData.data[id - 1].order;
    this.setState({
      id,
      orderInfo,
      truePrice: douyinData.data[id - 1].order.price,
    });
    try {
      let orderData = localstroage.getItem('orderData');
      if (orderData) {
        orderData = JSON.parse(orderData);
        this.setState({
          phone: orderData.phone,
          name: orderData.name,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 退出清除定时器防止内存泄漏
  componentWillUnmount() {
    clearInterval(this.interval);
    clearTimeout(this.timeout);
  }

  // 检查是否要显示弹窗
  checkNeedShowModal() {
    const orderNeedModal = localstroage.getItem('orderNeedModal');
    // 判断是否是从支付页返回，是则弹窗提示
    if(window.performance.navigation.type === 2 && orderNeedModal === 'true'){
      this.setState({ errModal: true });
      this.timeout = setTimeout(() => {
        this.setState({ errModal: false });
      }, 3000);
    } else {
      localstroage.removeItem('orderNeedModal');
    }
  }

  // 检查数据是否合法
  checkData() {
    const name = this.state.name;
    const phone = this.state.phone;
    if (
      utils.validator(name, 'realname', '请正确填写姓名！') &&
      utils.validator(phone, 'phone', '请正确填写手机号！')
    ) {
      return true;
    } else {
      return false;
    }
  }

  // 下单，创建订单
  order(type) {
    if(this.props.match.params.id!=="7"){
      alert('抱歉活动已经下架啦！');
      return
    }
    if(this.props.match.params.id==="7"&&window.localStorage['CouponPhone'+this.state.phone]){
        alert('您已经购买过了请勿重复购买！');
        return
    }

    const isCheckOk = this.checkData();
    if (!isCheckOk) {
      alert('请检查是否正确填写姓名/手机号！');
      return;
    }
    this.setState({ paying: true })
    const data = {
      commodity: this.props.match.params.id,
      phone: this.state.phone,
      name: this.state.name,
      price: this.state.truePrice,
      number: this.state.count,
    };
    douyinOrder(data).then(res => {

      if (res.success === true) {
        this.doPay(type, res.data);
        localstroage.setItem('orderData', JSON.stringify(data));
      }else{
        if(res.errorMsg){
          alert(res.errorMsg);
        }
      }
    }).catch((e) => {
      console.log(e)
      this.setState({ paying: false })
    });
  }

  // 支付逻辑
  doPay(type, orderId) {
    const time = Date.parse(new Date());
    const orderInfo = this.state.orderInfo;
    const data = {
      accountId: 1,
      isInvoice: false,
      amount: orderInfo.price,
      //amount:0.01,
      outTradeNo: orderId,
      tradeType: 'WAP_PAY',
      subject: orderInfo.title,
      body: orderInfo.type,
      currency: 'CNY',
      source: 'douyinH5',
      returnUrl: `https://oss.localhome.cn/localhomeqy/20190513/index.html#/complete/${this.state.id}/${orderId}/${this.state.truePrice}/${time}/${this.state.phone}`,
    };
    console.log(data)
    if (type === 'wechat') {
      data.accountId = 4;
      data.tradeType = 'MWEB';
      data.body = '路客民宿预订';
      data.wapUrl = 'i.localhome.cn';
      data.wapName = '路客';
    }
    pay(data).then(res => {

      if (res.success) {
        this.setState({ paying: false })
        // 转跳去支付页面建标识
        localstroage.setItem('orderNeedModal', 'true');
        if (type === 'wechat') {
          window.location.href = res.data.mwebUrl;
          let booking = { outTradeNo: res.data.outTradeNo };
          this.interval = setInterval(() => {
            const params = {
              outTradeNo: booking,
            };
            checkPay(params).then(res => {
              if (res.success) {
                if (res.data.orderStatus === 'SUCCESS') {
                  window.location.href = `https://oss.localhome.cn/localhomeqy/20190513/index.html#/complete/${this.state.id}/${orderId}/${this.state.truePrice}/${time}/${this.state.phone}`;
                } else if (res.data.orderStatus === 'PAYERROR') {
                  console.log('失败');
                }
              }
            });
          }, 3000);
        } else {
          const div = document.createElement('div');
          div.innerHTML = res.data.body;
          document.body.appendChild(div);
          document.forms[0].submit();
          let booking = { outTradeNo: res.data.outTradeNo };
          this.interval = setInterval(() => {
            const params = {
              outTradeNo: booking,
            };
            checkPay(params).then(res => {
              if (res.success) {
                if (res.data.orderStatus === 'TRADE_SUCCESS') {
                  window.location.href = `https://oss.localhome.cn/localhomeqy/20190513/index.html#/complete/${this.state.id}/${orderId}/${this.state.truePrice}/${time}/${this.state.phone}`;
                }
              }
            });
          }, 3000);
        }
      }
    }).catch(() => {
      this.setState({ paying: false })
    });
  }

  // 修改数量
  changeCount(type) {
    let count = this.state.count;
    let truePrice = this.state.orderInfo.price;
    if (type === 'add') {
      count++;
    } else {
      count--;
    }
    if (count < 1) return;
    truePrice = parseInt(count) * parseInt(truePrice);
    this.setState({
      count,
      truePrice,
    });
  }

  changeOne = event => {
    this.setState({ name: event.target.value });
  };

  changeTwo = event => {
    this.setState({ phone: event.target.value });
  };

  showErrModal = () => {
    this.setState({
      errModal: !this.state.errModal
    })
  }

  render() {
    const { url, title, orderInfo, count, truePrice, name, phone, paying, errModal } = this.state;

    return (
      <div className="order">
        <TopBanner2 url={url} title={title} />
        <div className="orderInfo">
          <div>
            <p className="orderTitle">{orderInfo.title}</p>
            <p className="orderType">{orderInfo.type}</p>
            <p>民宿地址：{orderInfo.address}</p>
            <p>使用有效期：{this.props.match.params.id!=="7"?'有效期至':'有效期即日起至'}{orderInfo.time}</p>
            <p>入住有效期：{this.props.match.params.id!=="7"?'有效期至':'有效期即日起至'}{orderInfo.checkIn}</p>
            <p>订单金额：￥{orderInfo.price}</p>
          </div>
        </div>
        <div className="orderInfo">
          <div>
            <p className="orderNum">购买数量</p>
            <div className={this.props.match.params.id==="7"?"orderCount hideBtn":'orderCount'}>
              <span>商品数量  <span className="onePick"> {this.props.match.params.id==="7"?'(每个手机号限购一张)':''}</span></span>
              <div className="count">
                <p onClick={this.changeCount.bind(this, 'cut')}>
                  <img src={require('../../assets/cut.png')} alt="" />
                </p>
                <span>{count}</span>
                <p onClick={this.changeCount.bind(this, 'add')}>
                  <img src={require('../../assets/add.png')} alt="" />
                </p>
              </div>
            </div>
            <div className="truePrice">
              订单金额：<span>￥{truePrice}</span>
            </div>
          </div>
        </div>
        <div className="orderInfo">
          <div>
            <p className="orderTip">入住人信息</p>
            <input type="text" placeholder="姓名" value={name} onChange={this.changeOne} />
            <input type="text" placeholder="手机" value={phone} onChange={this.changeTwo} />
            {paying ? (
              <p className="pay">处理中...</p>
            ) : (
              <p className="pay" onClick={this.order.bind(this, 'ali')}> 立即支付 </p>
            )}
          </div>
        </div>
        {errModal && 
          <div className='modal' onClick={this.showErrModal.bind(this)}>
            <div className='errModal'>
              <p>支付失败，请确认订单！</p>
            </div>
          </div> 
        }
        {/* <div className='modal'>
          <div className='modalBtns'>
            <button className="btn" onClick={this.doPay.bind(this,'wechat')}>微信支付</button>
            <button className="btn" onClick={this.doPay.bind(this,'ali')}>支付宝支付</button>
          </div>
        </div> */}
      </div>
    );
  }
}

export default withRouter(Order);
