import React from 'react';
import { withRouter } from 'react-router-dom';
import  {scrollTop} from './scrollTop.js';
import './index.css';
import Image from '../../components/Image/Image';
const douyinData = require('./douyinData.json');
class lookReason extends React.Component {
  state = {
    detailInfo:{},
    id:""
  };
  componentWillMount() {
    const id = this.props.match.params.id;
    this.setState({
      detailInfo: douyinData.data[id - 1],
      id,
    });
    scrollTop(0)
  }
  gobackhome(){
      window.location.href = "https://www.douyinvideo.net/magic/runtime/?id=6551&appType=douyin"
  }
  HeaderClik(){
    window.location.href = "https://webchat.7moor.com/wapchat.html?accessId=4e520c00-8b29-11e8-b387-adb0dd3142d1&fromUrl=&urlTitle="
  }
  goparty(id){
    if(this.state.id==="7"){
      window.location.href = "https://oss.localhome.cn/localhomeqy/20190513/index.html#/?id=7"
    }
   
  }
  jumpPage(id){
    window.location.href = "https://oss.localhome.cn/localhomeqy/20190513/index.html#/?id="+id
  }
  render() {
    const {  } = this.state;

    return (
      <div className="shop-container">
        <div  className="top-img-con">
             <img  className="top-img" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin59/7b5061390359efa7e18f45682f14d17.jpg" />
              <div className="top-cover"></div>
              <p className="top-tip">#向往的民宿#</p>
        </div>
        <p className="middle-tip">#向往的民宿#活动 7*24小时咨询入口</p>

        <div  className="head-contact">
        <div className="middle-head">
            <img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douying59/%E5%A4%B4%E5%83%8F.png"  onClick={this.HeaderClik.bind(this)}/>
            <div className="middle-head-tip">
              <p  onClick={this.HeaderClik.bind(this)}>点击在线咨询</p>
            </div>
        </div>
         <div className="middle-contact">
              <div className="contact-left">
                  <p className="contact-top">7*24小时客服电话</p>
                  <p className="contact-bottom">
                      <img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douying59/%E7%94%B5%E8%AF%9Dicon.png" />
                      4009999270</p>
              </div>
              <div className="contact-right">
                  <p className="contact-top">客服微信号</p>
                  <p className="contact-bottom">
                      <img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douying59/%E5%BE%AE%E4%BF%A1icon.png" />
                      mcdulloO</p>
              </div>
           
         </div>
         <p style={{'clear':"both"}}></p>
         </div>
         <div className="middel-details">
             <header>路客精品民宿</header>
             <p>2018最佳民宿品牌</p>
         </div>
         {/*this.state.id==="7" && (<div  className="bottom-goparty">
          <img src=" https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin62/goingqiangou.jpg" /> 
          <div  className="bottom-goparty-btn" onClick={this.goparty.bind(this)}></div>
         </div>)
    */}

        <div className="jumpItem">
        <div  onClick={this.jumpPage.bind(this,1)}>
           <Image  src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin04/wuxi.png" /> 
           </div>
        </div>

        <div className="jumpItem">
        <div  onClick={this.jumpPage.bind(this,5)}>
           <Image  src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin04/yicun.png"  /> 
           </div>
        </div>

        <div className="jumpItem">
        <div onClick={this.jumpPage.bind(this,6)}>
           <Image  src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin04/baicuishang.png" /> 
           </div>
        </div>

        <div className="jumpItem">
        <div  onClick={this.jumpPage.bind(this,7)}>
           <Image  src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin04/lukemingshu.png" /> 
           </div>
        </div>

        <div className="jumpItem">
        <div  onClick={this.jumpPage.bind(this,2)}>
           <Image  src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin04/yejia.png" /> 
           </div>
        </div>

        <div className="jumpItem">
           <div onClick={this.jumpPage.bind(this,4)}>
           <Image  src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin05/dali.png"  /> 
           </div>
        </div>

        <div className="jumpItem">
           <div onClick={this.jumpPage.bind(this,3)}>
           <Image  src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin05/pingcou.png"  /> 
           </div>
        </div>
      
         <div className="bottom-footer">
            <Image  src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin62/ercode0616.png" /> 
         </div>
      </div>
    );
  }
}

export default withRouter(lookReason);
