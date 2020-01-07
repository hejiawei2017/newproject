import React from 'react';
import axios from 'axios';
import adapter from '../../common/adapter';
import HouseList from '../../components/HouseListMuQingJie/HouseList';
import './index.css';
import utils from '../../common/utils';
import { statisticsEvent, statisticsJoin, getCoupon } from '../../common/api'

const houseInfo = require('./muqingjie.json');

class App extends React.Component {
  state = {
    houseList: [],
    tabData: houseInfo,
    nowTab: 'item1',
    discount: 0.8,
    token: '',
    phone:'',
    showModel: true,
    showToast: false,
    modelMsg:'',
    move:{},
    isTurned: true,
    channel:''
  };

  componentWillMount() {
    // 获取数据
    this.getData();
    // 获取url，并解析
    const that = this
    const url = window.location.href;
    // 如果有channel，进行记录
    if (utils.parseURL(url).params.channel) {
      const channel = utils.parseURL(url).params.channel;
      that.setState({ channel });
    }
    // 判断url中是否有token，有则判断为已登录状态，将token进行存储
    if (utils.parseURL(url).params.token) {
      const token = utils.parseURL(url).params.token;
      that.setState({ token });
      // 获取phone
      that.getphone(token)
    }
  }

  showToast(msg) {
    this.setState({
      modelMsg: msg,
      showToast: true,
    })
    setTimeout(() => { this.setState({ showToast: false }) }, 3000)
  }

  // 获取phone
  getphone(token) {
    const that = this
    axios
      .get('https://ms.localhome.cn/api/platform/user/user-info-detail',{
        headers:{
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json; charset=UTF-8',
          'LOCALS-ACCESS-TOKEN': 'Bearer ' + token
        }
      })
      .then(function(response) {
        // token无效去登陆
        if (response.data.errorCode === "20113") {
          adapter.signIn();
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
            if(_phone && _phone === '1') {
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
      });
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
      activity_id: "1905071139977",
      payload: JSON.stringify(phone)
    }
    getCoupon(_data).then((res) => {
      if(res.success) {
        that.setState({
          showModel: true,
          isTurned: true
        })
        // 上报统计
        if(that.state.channel !== '') { that.reporting() }
        // 存下phone在storage
        const localstroage = window.localStorage;
        localstroage.setItem(that.state.phone, 1);
      } else {
        if(res.errorCode === 100004) {
          that.setState({
            showModel: true,
            isTurned: true
          })
          const localstroage = window.localStorage;
          localstroage.setItem(that.state.phone, 1);

        } else {
          that.setState({
            showModel: true,
            isTurned: false,
          })
        }
      }

    }).catch(function(error) {
      console.log(error);
    });
  }

  // 上报领券信息
  reporting() {
    const _data = {
      user_id: this.state.user_id,
      event: 'attend',
      share_user: this.state.channel,
      activity_name: 'mqj20190505',
    }
    statisticsEvent(_data).then(res => { console.log(res) })
  }

  // 上报进入信息
  reportingJoin() {
    const _data = {
      ticket_id: 'mqj20190505',
      share_user_id: this.state.channel,
      join_user_id: this.state.user_id
    }
    statisticsJoin(_data).then(res => { console.log(res) })
  }

  // 获取数据
  getData(type) {
    const that = this;
    const _type = type || this.state.nowTab
    let _data = [];
    for (let i = 0; i < houseInfo.length; i++) {
      if (_type === houseInfo[i].type) {
        _data = houseInfo[i].ids;
      }
    }
    if (_data === []) {
      return;
    }
    axios
      .post('https://ms.localhome.cn/api/prod-plus/activity/20190409/house', _data)
      .then(function(response) {
        if (response.data.success) {
          const data = response.data.data;
          that.setState({
            houseList: data,
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  // 关闭model
  closeModel() {
    this.setState({ showModel: false })
  }

  // 改变tab
  changeTab(type) {
    this.setState({
      nowTab: type,
    });
    this.getData(type);
  }

  clearClick(e) { e.stopPropagation() }

  // 转跳逻辑
  jumpPage(url) {
    adapter.navigate({ url: `/pages/${url}/index?channel=zhuhai01` });
  }

  render() {
    const tabData = this.state.tabData;
    return (
      <div id="app">
        <div className="topImg">
          <img src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557108478751%E5%A4%B4%E5%9B%BE.png" alt="" />
        </div>
        <img 
          className="bg" 
          src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557107931235bg.png"
          alt=""
        />
        <div className="main">
          <div className="receiveTicket">
            <div className="title">
              <img src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557049962814%E5%AD%9D%E5%BF%83.png" alt=""/>
            </div>
            <img src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557050211090%E4%BC%98%E6%83%A0%E5%88%B8.png" alt=""/>
            <img 
              className="takeBtn"
              src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557049820358%E9%A2%86%E5%8F%96.png"
              onClick={ this.getCoupon.bind(this) }
              alt="" />
          </div>

          <div className="tabList">
            <div className="title">
              <img src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557050086314title2.png" alt=""/>
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
                        <img className="tabImg" src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557050161680tab-btn_ac.png" alt="" />
                        <span>{item.name}</span>
                      </div>
                    ) : (
                      <div className="tab">
                        <img className="tabImg" src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557050143343tab-btn.png" alt="" />
                        <span>{item.name}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <HouseList
              houseList={this.state.houseList}
              discount={this.state.discount}
              isTurned={this.state.isTurned}
            />
          </div>

          <div className="footer">
            <img
              className="footer-img" 
              src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557232284336%E6%A0%8F%E5%B0%BE.jpg" 
              alt="" />
          </div>

        </div>

        {this.state.showModel &&

          <div className='ruleTips'>

            {this.state.isTurned ? (
              
              <div class="dialog">
                <div class="dialog-success">
                  <img class="dialog-img" src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557140745343dialog-success.png" alt="" />
                  <div class="jumpToCoupon"></div>
                </div>
                <div class="closeBtn">
                  <img src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557141102291close.png" alt="" />
                </div>
              </div>
              ) : (
                <div class="dialog">
                  <div class="dialog-recived">
                    <img class="dialog-img" src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557140780802dialog-recived.png" alt="" />
                    <div class="jumpToCoupon"></div>
                  </div>
                  <div class="closeBtn">
                    <img src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557141102291close.png" alt="" />
                  </div>
                </div>
              )}
            </div>
        }

        {this.state.showToast &&
          <div className='toast-wrap'>
            <div className='toast'>
              <p>{this.state.modelMsg}</p>
            </div>
          </div>
        }

        <div className="imgPreload">
          <img src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557140745343dialog-success.png" alt="" />
          <img src="http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/locals_1557140780802dialog-recived.png" alt="" />
        </div>
      </div>
    );
  }
}

export default App;
