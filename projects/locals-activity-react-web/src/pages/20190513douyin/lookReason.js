import React from 'react';

import { withRouter } from 'react-router-dom';


import './index.css';


class lookReason extends React.Component {
  state = {

  };

  componentDidMount() {
  
  }
  gobackhome(){
      window.location.href = "https://www.douyinvideo.net/magic/runtime/?id=6551&appType=douyin"
  }
  render() {
    const {  } = this.state;

    return (
      <div className="lookReason">
        <div className="header">
         <div><img  src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin59/payerrorTop1.5x.png" /></div>
        <p className="errorPayStateTip">购买失败</p>
        <p className="error-reason">
          非常抱歉，本活动优惠商品每个手机号仅限购买1次。
        </p>
        <p className="sawtooth"></p>
         <p className="error-refund-reason">
         关于退款：我们会在一个工作日内原路退还您的付款金额，支付宝退款可能会存在有延迟，如未退款，可联系客服4009999270.
         </p>
        </div>
        <div className="body-con">
            <img  src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin59/ecode1.5x.png" /> 
            <p>关注公众号，获取更多活动优惠 （长按保存图片，在微信扫码打开）</p>

            <a href="javascript:void(0)" className="gobackhome" onClick={this.gobackhome.bind(this)}> 回到首页 </a>
        </div>

        
      </div>
    );
  }
}

export default withRouter(lookReason);
