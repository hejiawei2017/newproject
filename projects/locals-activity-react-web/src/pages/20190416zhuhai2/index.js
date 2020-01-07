import React from 'react';
import axios from 'axios';
import adapter from '../../common/adapter';
import HouseList from '../../components/HouseList/HouseList';
import './index.css';
import utils from '../../common/utils';
import { statisticsEvent,statisticsJoin,getCoupon } from '../../common/api'
const houseInfo = require('./zhuhaidata.json');
const localstroage = window.localStorage;
let isTurn = false

class App extends React.Component {
  state = {
    houseList: [],
    tabData: houseInfo,
    nowTab: 'item1',
    discount: 0.8,
    token: '',
    phone:'',
    showModel:false,
    modelMsg:'',
    move:{},
    isTurned: false,
    openTips:false,
    channel:'',
    needJump: false,
    userInfo:{},
    canPlay:true,
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
      that.setState({channel});
    }
    // 判断url中是否有token，有则判断为已登录状态，将token进行存储
    if (utils.parseURL(url).params.token) {
      const token = utils.parseURL(url).params.token;
      that.setState({token});
      // 获取phone
      that.getphone(token)
    }
  }
  // 获取phone
  getphone(token) {
    const that = this
    axios.get('https://ms.localhome.cn/api/platform/user/user-info-detail',{
      headers:{
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'LOCALS-ACCESS-TOKEN': 'Bearer ' + token
      }
    }).then(function(response) {
      // token无效去登陆
      if(response.data.errorCode === "20113"){
        that.jumpLogin()
        return
      }
      // 有token且有效
      if(response.data.data.platformUser){
        const phone = response.data.data.platformUser.mobile
        const user_id = response.data.data.platformUser.id
        // 存储phone,id
        that.setState({
          phone,
          user_id,
          userInfo: response.data.data.platformUser,
          isNew: response.data.data.isNew
        })
        // 判断是否有过抽奖，将isturned设为true
        try {
          const _phone = localstroage.getItem(phone)
          if(_phone && _phone === '1') {
            that.setState({ 
              isTurned:true,
              canPlay:false
            })
          }else{
            that.reportingJoin()
          }
        } catch (error) {
          console.log(error)
        }
        // 判断是否人工转跳到登录页，如果是则直接转跳结果
        const manualLogin = localstroage.getItem('manualLogin')
        if(manualLogin && manualLogin === '1'){ 
          that.getReceive();
          localStorage.removeItem('manualLogin');
        }
      }else{
        that.setState({
          modelMsg: '网络错误，请稍后再试！',
          showModel:true,
        })
        setTimeout(()=>{ that.setState({ showModel:false }) },3000)
      }
    })
    .catch(function(error) {
      that.setState({
        modelMsg: '网络错误，请稍后再试！',
        showModel:true,
      })
      setTimeout(()=>{ that.setState({ showModel:false }) },3000)
    });
  }
  // 转转盘操作
  playTurntable() {
    if(isTurn) return
    console.log(isTurn)
    const that = this
    if(!this.state.canPlay) {
      that.setState({
        showModel:true,
        isTurned:true,
      })
      return
    }
    // 转转盘
    let name = 'myfirst'
    const random = Math.random();
    if(random<0.3){
      name = 'myfirst'
    }else if(0.3 <= random && random < 0.7){
      name = 'myfirst1'
    }else{
      name = 'myfirst2'
    }
    isTurn = true
    this.setState({
      move:{
        animation:`${name} 3s infinite forwards`,
        animationIterationCount:'1'
      }
    })
    // 定时6s在动画结束后1s进行领券请求
    setTimeout(()=>{
      that.setState({canPlay:false})
      that.getReceive()
      isTurn = false
    },3100)
  }
  // 领取操作，校验领取资格
  getReceive() {
    const that = this
    // 没有登录就先弹窗显示需要登录
    if (!this.state.token || this.state.phone === '') {
      that.setState({
        needJump:true,
        isTurned:true
      })
      return
    }
    // 已经参与过不进行并成功领券的不进行转转盘
    if(this.state.isTurned) {
      that.setState({
        showModel:true,
        isTurned:true,
        canPlay:false
      })
      setTimeout(()=>{
        that.setState({ showModel:false })
      },3000)
      return
    }
    // 将手机号与storage进行比对，如果有则无法进行领券，并做友好提示
    try {
      const phone = localstroage.getItem(this.state.phone)
      if(phone && phone === '1') {
        that.setState({
          showModel:true,
          isTurned:true,
          canPlay:false
        })
        setTimeout(()=>{
          that.setState({ showModel:false })
        },3000)
        return
      }
    } catch (error) {
      console.log(error)
    }
    // 有登录，且有资格进行领券
    that.getCoupon()
  }
  // 获取优惠券
  getCoupon() {
    const that = this
    const phone = {
      master_uuid:that.state.phone
    }
    const _data = {
      activity_id: "1904102011314",
      payload: JSON.stringify(phone)
    }
    getCoupon(_data).then((res) => {
      if(res.success){
        that.setState({
          showModel:true,
          isTurned:true,
          canPlay:false
        })
        // 上报统计
        if(that.state.channel !== ''){ that.reporting() }
        // 存下phone在storage
        localstroage.setItem(that.state.phone, 1);
      }else{
        if(res.errorCode === 100004){
          that.setState({
            showModel:true,
            isTurned:true,
            canPlay:false
          })
          localstroage.setItem(that.state.phone, 1);
        }else{
          that.setState({
            modelMsg: '抽取失败，请重试',
            showModel:true,
            isTurned:false,
          })
        }
      }
    }).catch(function(error) {
      console.log(error);
    });
    if(!this.state.isNew){
      // 新人100券
      this.get100Coupon()
    }
  }
  // 领取100元新人券
  get100Coupon() {
    const that = this
    const _data2 = {
      activity_id:'1902220547571',
      phone: that.state.phone,
      userInfo: JSON.stringify(that.state.userInfo) 
    }
    axios.post('https://i.localhome.cn/api/new_use_redpacket/index',_data2,
      {headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'LOCALS-ACCESS-TOKEN': 'Bearer ' + this.state.token
      }}
    ).then((res) => {
      console.log(res)
    }).catch(function(error) { console.log(error);});
  }
  // 上报领券信息
  reporting(){
    const _data = {
      user_id: this.state.user_id,
      event: 'attend',
      share_user: this.state.channel,
      activity_name: 'zhuhai20190409',
    }
    statisticsEvent(_data).then(res=>{ console.log(res) })
  }
  // 上报进入信息
  reportingJoin() {
    const _data = {
      ticket_id: 'zhuhai20190409',
      share_user_id: this.state.channel,
      join_user_id: this.state.user_id
    }
    statisticsJoin(_data).then(res=>{ console.log(res) })
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
    if (_data === []) { return; }
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
    if(this.state.token === '' && this.state.phone === ''){
      this.setState({
        move:{},
        canPlay:true
      })
    }
    this.setState({
      showModel:false,
      needJump:false
    })
  }
  // 改变tab
  changeTab(type) {
    this.setState({
      nowTab: type,
    });
    this.getData(type);
  }
  // 打开规则说明
  openTip() {
    this.setState({openTips: true})
  }
  closeRuleTip() {
    this.setState({openTips: false})
  }
  clearClick(e) { e.stopPropagation() }
  // 转跳逻辑
  jumpPage(url) {
    adapter.navigate({ url: `/pages/${url}/index?channel=zhuhai01` });
  }
  jumpLogin() {
    // 人工登陆记录，校验后要删除
    localstroage.setItem('manualLogin', '1');
    adapter.signIn();
  }

  render() {
    const tabData = this.state.tabData;
    return (
      <div id="app">
        <div className="index">
          <div className='receive'>
            <img className='power' onClick={this.playTurntable.bind(this)} src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/zhuhai/lotteryBtn001.png" alt=""/>
            <div className='turntable'>
              {this.state.canPlay ? (
                <img style={this.state.move} src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/zhuhai/turntable001.png" alt=""/>
              ) : (
                <img style={{transform: 'rotate(1630deg)'}} src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/zhuhai/turntable001.png" alt=""/>                
              )}
            </div>
            <img className='openTips' onClick={this.openTip.bind(this)} src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/zhuhai/tip001.png" alt=""/>
          </div>
          {this.state.openTips &&(
            <div className='ruleTips' onClick={this.closeRuleTip.bind(this)}>
              <img className='rule' onClick={this.clearClick.bind(this)} src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/zhuhai/rule001.png" alt=""/>
              <span onClick={this.closeRuleTip.bind(this)}></span>
            </div>
          )}
        </div>
        <img className="floatImg" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/zhuhai/fly001.png" alt="" onClick={this.jumpPage.bind(this, 'coupon')} />
        <div className="receiveTab">
          {tabData.map(item => {
            return (
              <div
                key={item.type}
                className="tabCom"
                onClick={this.changeTab.bind(this, item.type)}
              >
                {this.state.nowTab === item.type ? (
                  <div className="tab">
                    <img className="tabImg" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/zhuhai/tap01.png" alt="" />
                    <span>{item.name}</span>
                  </div>
                ) : (
                  <div className="tab2">
                    <img className="tabImg" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/zhuhai/tap1.png" alt="" />
                    <span>{item.name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {this.state.showModel &&
          <div className='ruleTips' onClick={this.closeModel.bind(this)}>
            <div className='_tip' onClick={this.clearClick.bind(this)}>{this.state.modelMsg}</div>
            {this.state.isTurned ? (
              <div>
                <img className='rule1' onClick={this.clearClick.bind(this)} src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/zhuhai/model004.png" alt=""/>
                <div className='jumpToCoupon' onClick={this.jumpPage.bind(this, 'coupon')}></div>
              </div>
            ):(
              <div>
                <img className='rule1' onClick={this.clearClick.bind(this)} src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/zhuhai/model000.png" alt=""/>
                <div className='jumpToCoupon' onClick={this.closeModel.bind(this)}></div>
              </div>
            )}
            <span onClick={this.closeModel.bind(this)}></span>
          </div>
        }
        {this.state.needJump && 
          <div className='ruleTips' onClick={this.closeModel.bind(this)}>
            <img className='rule1' onClick={this.clearClick.bind(this)} src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/zhuhai/model001.png" alt=""/>
            <div className='jumpToCoupon' onClick={this.jumpLogin.bind(this)}></div>
            <span onClick={this.closeModel.bind(this)}></span>
          </div>
        }
        <HouseList
          houseList={this.state.houseList}
          discount={this.state.discount}
          isTurned={this.state.isTurned}
        />
      </div>
    );
  }
}

export default App;
