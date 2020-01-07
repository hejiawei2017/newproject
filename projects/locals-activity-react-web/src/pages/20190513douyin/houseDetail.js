import React from 'react';
import { withRouter } from 'react-router-dom';
import Swiper from '../../components/Swiper/Swiper';
import utils from '../../common/utils';
import  {scrollTop} from './scrollTop.js';
import Image from '../../components/Image/Image';
import './index.css';
const douyinData = require('./douyinData.json');
const localstroage = window.localStorage;

class HouseDetail extends React.Component {
  state = {
    id: 1,
    chooseNo: 0,
    detailInfo: {
      tag: [],
      info: [],
      contact: {},
      notice: [],
      swiperData: [],
    },
    showModal: false,
    time: {
      day: [0, 0],
      hour: [0, 0],
      minute: [0, 0],
      second: [0, 0],
    },
    isOver:false
  };
  componentWillMount(){
    scrollTop(0)
    
  }
  componentDidMount() {

    const that = this;
    that.currentIdChangid = this.state.id
    // 获取url，并解析根据id获取数据
    if (utils.getQueryString("id")) {
      const id = utils.getQueryString("id");
      that.setState({
        detailInfo: douyinData.data[id - 1],
        id,
      });
      that.currentIdChangid = id
      utils.setTitle(douyinData.data[id - 1].title)
    } else {
      utils.setTitle(douyinData.data[0].title)
      that.setState({ detailInfo: douyinData.data[0] });
    }

    // 倒计时逻辑
    this.getDate();
    this.interval = setInterval(() => {
      that.getDate();
    }, 1000);
    localstroage.removeItem('orderData');
  }

  // 销毁时进行清理定时器，防止内存泄漏
  componentWillUnmount() {
    clearInterval(this.interval);
    
  }

  // 选择tag逻辑
  chooseTag(id) {
    if (id === this.state.chooseNo) return;
    this.setState({
      chooseNo: id,
    });
  }

  // 显示联系人模态框
  showContactModal() {
    this.setState({
      showModal: !this.state.showModal,
    });
  }

  getDate() {
 
    let oDate = new Date(); //获取日期对象
    let oldTime = oDate.getTime(); //现在距离1970年的毫秒数
    let newDate = new Date('2019/6/23 23:59:59');
     if(this.currentIdChangid === '7'){
      newDate =  new Date('2019/7/22 23:59:59');
     }
   //let newDate = new Date('2019/6/15 14:47:50')
    let newTime = newDate.getTime(); //2019年距离1970年的毫秒数
    if(oldTime>newTime){
      let timeO = {
        day: [0,0],
        hour: [0,0],
        minute: [0,0],
        second: [0,0],
        maxhour:0
      };
      this.setState({ time:timeO,isOver:true });
      return;

    }
    let second = Math.floor((newTime - oldTime) / 1000); //未来时间距离现在的秒数
    let day = Math.floor(second / 86400); //整数部分代表的是天；一天有24*60*60=86400秒 ；
    second = second % 86400; //余数代表剩下的秒数；
    let hour = Math.floor(second / 3600); //整数部分代表小时；
    let maxhour = hour + day*24;
    second %= 3600; //余数代表 剩下的秒数；
    let minute = Math.floor(second / 60);
    second %= 60;
    const time = {
      day: `${tow(day)}`.split(''),
      hour: `${tow(hour)}`.split(''),
      minute: `${tow(minute)}`.split(''),
      second: `${tow(second)}`.split(''),
      maxhour:maxhour
    };
    this.setState({ time });
    function tow(n) {
      return n >= 0 && n < 10 ? '0' + n : '' + n;
    }
  }

  jumpPage() {
    this.props.history.push('/inquire');
  }

  jumpOrder() {
    if(this.state.isOver){
      return;
    }
    this.props.history.push( `/order/${this.state.id}`);
  }
  jumpShop(){
    this.props.history.push( `/shop/${this.state.id}`);
  }
  render() {
    const { detailInfo, chooseNo, time, showModal } = this.state;
    const { tag, info, contact, notice, swiperData } = detailInfo;
    return (
      <div className="houseDetail">
        <Swiper swiperData={swiperData} />
        <div className="houseInfo">
         <div className="priceCon">
            <div className="new_priceInfo">
              <span className="new_nowPrice">
                  <span className="money-dot">￥</span>{detailInfo.price}
               </span>
               <span className="new_oldPrice">
                  原价：<span className="money-dot">￥</span>{detailInfo.oldPrice}
               </span>
            </div>
            <div className="new_timeInfo">
               <span  className="new_lessTime">剩余时间</span>
               <div className="timePancel">
                <span className="timePoit">{time.day[0]}</span><span className="timePoit">{time.day[1]}</span><span>天</span>
                <span className="timePoit">{time.hour[0]}</span><span className="timePoit">{time.hour[1]}</span><span>时</span>
                <span className="timePoit">{time.minute[0]}</span><span className="timePoit">{time.minute[1]}</span><span>分</span>
                <span className="timePoit">{time.second[0]}</span><span className="timePoit">{time.second[1]}</span><span>秒</span>
               </div>
            </div>
         </div>
          {/*

          
          <div className="price">
            <span className="priceNum">￥{detailInfo.price}</span>
            <span className="priceIcon">活动进行中</span>
            <span className="lessTime">剩余时间</span>
          </div>
          <div className="timeInfo">
            <span className="oldPrice">原价：￥{detailInfo.oldPrice}</span>
            <div className="time">
              <span className="timeBlack">{time.day[0]}</span>
              <span className="timeBlack">{time.day[1]}</span>
              <span className="timeText">天</span>
              <span className="timeBlack">{time.hour[0]}</span>
              <span className="timeBlack">{time.hour[1]}</span>
              <span className="timeText">小时</span>
              <span className="timeBlack">{time.minute[0]}</span>
              <span className="timeBlack">{time.minute[1]}</span>
              <span className="timeText">分</span>
              <span className="timeBlack">{time.second[0]}</span>
              <span className="timeBlack">{time.second[1]}</span>
              <span className="timeText">秒</span>
            </div>
          </div>
          
           */}
          <div className="title">
            <p>{detailInfo.title}</p>
            <p className="title2">{detailInfo.title2}</p>
          </div>
          {tag && tag.length !== 0 && (
            <div className="tips">
              {tag.map((item, index) => {
                 if(index>0){
                    return  <span key={index}>{"+"}{item}</span>
                 }else{
                    return  <span key={index}>{item}</span>
                }
              }
              )}
            </div>
          )}
        </div>
        <div className="introduction">
          <div className="houseIntro">
            <div className="intro" onClick={this.chooseTag.bind(this, 0)}>
              <span>房源介绍</span>
              <div className={chooseNo === 0 ? 'choose' : ''}>
                <p />
              </div>
            </div>
            <div className="intro" onClick={this.chooseTag.bind(this, 1)}>
              <span>预订须知</span>
              <div className={chooseNo === 1 ? 'choose' : ''}>
                <p />
              </div>
            </div>
          </div>
          <div className="introDetail">
            {chooseNo === 0 ? (
              <div>
                {info &&
                  info.length !== 0 &&
                  info.map((item, index) => (
                    <div key={index} className="introBlock">
                      <p className="infoTip">{item.tip}</p>
                      {item.text && item.text.map((text, index) => (
                        <p key={index} className="infoText">
                          {text}
                        </p>
                      ))}
                      {item.img&&item.img[0]&& <img key={index} src={item.img[0]} alt="" className="infoImage" />}
                      {item.img && item.img.slice(1).map((img, index) => (
                          <Image key={index} src={img} alt="" className="infoImage" />
                      ))}
                    </div>
                  ))}
                </div>
            ) : (
              <div>
                {notice &&
                  notice.length !== 0 &&
                  notice.map((item, index) => (
                    <div key={index} className="introBlock">
                      <p className="infoTip">{item.tip}</p>
                      {item.text.map((text, index) => (
                        <p key={index} className="infoText">
                          {text}
                        </p>
                      ))}
                      {item.tip === '【抢购说明】' && (
                        <p className="infoText" onClick={this.jumpPage.bind(this)}>
                          {item.text.length + 1}
                          <span className="canClick">{`.点击这里查询订单`}</span>
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        <div className="bottomBtns">
          <div className="leftBtns">
            <div className="leftBtn lineBtn" onClick={this.jumpShop.bind(this)} > 
              <img src={require('../../assets/icon1.png')} alt=""  />
              <span>进入店铺</span>
            </div>
            <div className="leftBtn" onClick={this.showContactModal.bind(this)}>
              <img src={require('../../assets/icon2.png')} alt="" />
              <span>联系民宿</span>
            </div>
          </div>
          <div className={this.state.isOver?"rightBtns isOver":"rightBtns"} onClick={this.jumpOrder.bind(this)}>
            <span>立即抢购</span>
          </div>
        </div>
        {showModal && (
          <div className="contactModal">
            <div className="contact">
              <img src={require('../../assets/close.png')} onClick={this.showContactModal.bind(this)} alt="" />
              <p className="contactTip">民宿主联系方式</p>
              <p className="contactTitle">手机号</p>
              <p className="contactText">{contact.phone}</p>
              <span />
              <p className="contactTitle">微信号</p>
              <p className="contactText">{contact.wechat}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(HouseDetail);
