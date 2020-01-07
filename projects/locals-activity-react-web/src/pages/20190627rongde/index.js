import React from 'react';
import axios from 'axios';
import adapter from '../../common/adapter';
import HouseList from '../../components/HouseList/HouseList';
import './index.css';
import utils from '../../common/utils';
import { statisticsEvent,statisticsJoin,getRongDeCoupon } from '../../common/api'
const houseInfo = require('./rongdeData.json');
const localstroage = window.localStorage;

const ActiveName = 'rongde20190627'

class App extends React.Component {
  state = {
    houseList: [],
    tabData: houseInfo,
    nowTab: 'item1',
    discount: 0.78,
    token: '',
    phone:'',
    showModel:false,
    modelMsg:'',
    isTurned: false,
    channel:'',
    userInfo:{},
    showModelType: 1,
  };
  componentWillMount() {
    // 获取数据
    this.getData();
    // 获取url，并解析
    const url = window.location.href;
    // 如果有channel，进行记录
    if (utils.parseURL(url).params.channel) {
      const channel = utils.parseURL(url).params.channel;
      this.setState({channel});
    }
    // 判断url中是否有token，有则判断为已登录状态，将token进行存储
    if (utils.parseURL(url).params.token) {
      const token = utils.parseURL(url).params.token;
      this.setState({token});
      // 获取phone
      this.getphone(token)
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
          if(_phone && _phone === ActiveName) that.setState({ isTurned:true }) 
          else that.reportingJoin()
        } catch (error) {
          console.log(error)
        }
      }else{
        that.setState({
          modelMsg: '网络错误，请稍后再试！',
          showModel:true,
          showModelType:1,
        })
        setTimeout(()=>{ that.setState({ showModel:false }) },3000)
      }
    })
    .catch(function(error) {
      that.setState({
        modelMsg: '网络错误，请稍后再试！',
        showModel:true,
        showModelType:1,
      })
      setTimeout(()=>{ that.setState({ showModel:false }) },3000)
    });
  }
  // 领取操作，校验领取资格
  getReceive() {
    const that = this
    // 没有登录就先弹窗显示需要登录
    if (!this.state.token || this.state.phone === '') {
      that.jumpLogin()
      return
    }
    // 已经参与过不进行并成功领券的不进行转转盘
    if(this.state.isTurned) {
      that.setState({
        showModel:true,
        showModelType:1,
      })
      setTimeout(()=>{ that.setState({ showModel:false }) },3000)
      return
    }
    // 将手机号与storage进行比对，如果有则无法进行领券，并做友好提示
    try {
      const phone = localstroage.getItem(this.state.phone)
      if(phone && phone === ActiveName) {
        that.setState({ showModel:true,showModelType:1, isTurned:true })
        setTimeout(()=>{ that.setState({ showModel:false }) },3000)
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
      activity_id: "1906271047893",
      payload: JSON.stringify(phone)
    }
    getRongDeCoupon(_data).then((res) => {
      if(res.success){
        that.setState({
          showModel:true,
          isTurned:true,
          showModelType:0,
        })
        // 上报统计
        if(that.state.channel !== ''){ that.reporting() }
        // 存下phone在storage
        localstroage.setItem(that.state.phone, ActiveName);
      }else{
        if(res.errorCode === 100004){
          that.setState({
            showModel:true,
            isTurned:true,
            showModelType:1,
          })
          localstroage.setItem(that.state.phone, ActiveName);
        }else{
          that.setState({
            modelMsg: '抽取失败，请重试',
            showModel:true,
            isTurned:false,
            showModelType:1,
          })
        }
      }
    }).catch(function(error) {
      console.log(error);
    });
  }
  // 上报领券信息
  reporting(){
    const _data = {
      user_id: this.state.user_id,
      event: 'attend',
      share_user: this.state.channel,
      activity_name: ActiveName,
    }
    statisticsEvent(_data).then(res=>{ console.log(res) })
  }
  // 上报进入信息
  reportingJoin() {
    const _data = {
      ticket_id: ActiveName,
      share_user_id: this.state.channel,
      join_user_id: this.state.user_id
    }
    statisticsJoin(_data).then(res=>{ console.log(res) })
  }
  // 获取数据
  getData(type) {
    const that = this;
    type = type || this.state.nowTab
    const params = houseInfo.filter(item => item.type === type)
    axios
      .post('https://ms.localhome.cn/api/prod-plus/activity/20190409/house', params[0].ids)
      .then(function(response) {
        if (response.data.success) {
          const houseList = response.data.data;
          that.setState({ houseList })
        }
      })
      .catch(function(error) { console.log(error) })
  }
  // 关闭model
  closeModel() {
    this.setState({
      showModel:false,
    })
  }
  // 改变tab
  changeTab(type) {
    if (this.state.nowTab === type) return
    this.setState({
      nowTab: type,
    });
    this.getData(type);
  }
  clearClick(e) { e.stopPropagation() }
  // 转跳逻辑
  jumpPage(url) {
    adapter.navigate({ url: `/pages/${url}/index?channel=${ActiveName}` });
  }
  // 转跳登陆
  jumpLogin() {
    adapter.signIn();
  }
  // 转跳到房源列表页面（带城市）
  jumpList(city) {
    adapter.navigate({ url: `/pages/housing/list/index?channel=${ActiveName}&selectCityName=${city}` });
  }

  render() {
    const { tabData, nowTab, showModel, showModelType, houseList, discount} = this.state
    return (
      <div id="app">
        <div className="index">
          <img className='receiveBtn' onClick={this.getReceive.bind(this)} src="https://oss.localhome.cn//localhomeqy/20190627rongde/btn.png" alt=""/>
        </div>
        <div className="receiveTab">
          {tabData.map(item => {
            return (
              <div
                key={item.type}
                className="tabCom"
                onClick={this.changeTab.bind(this, item.type)}
              >
                <div className={nowTab === item.type ? 'tab' : 'tab chooseTab'}>
                  <span>{item.name}</span>
                </div>
              </div>
            );
          })}
        </div>
        {showModel &&
          <div className='ruleTips' onClick={this.closeModel.bind(this)}>
            {showModelType === 1 ? (
              <div className='_tipDiv'>
                <img className='rule1' onClick={this.clearClick.bind(this)} src="https://oss.localhome.cn//localhomeqy/20190627rongde/tanchuang2.png" alt=""/>
                <div className='jumpToCoupon' onClick={this.jumpPage.bind(this, 'coupon')}></div>
              </div>
            ):(
              <div className='_tipDiv'>
                <img className='rule1' onClick={this.clearClick.bind(this)} src="https://oss.localhome.cn//localhomeqy/20190627rongde/tanchuang.png" alt=""/>
                <div className='jumpToCoupon' onClick={this.jumpPage.bind(this, 'coupon')}></div>
              </div>
            )}
            <span onClick={this.closeModel.bind(this)}></span>
          </div>
        }
        <HouseList
          houseList={houseList}
          discount={discount}
        />
        <div className='moreHouse'>
          <img className='moreHouseTips' src="https://oss.localhome.cn//localhomeqy/20190627rongde/title2.png" alt=""/>          
          <div className='moreHouseContent'>
            <div>
              <img className='moreHouseImg' onClick={this.jumpList.bind(this,'广州市')} src="https://oss.localhome.cn//localhomeqy/20190627rongde/guangzhou.png" alt=""/>          
              <p>广州</p>
            </div>
            <div>
              <img className='moreHouseImg' onClick={this.jumpList.bind(this,'珠海市')} src="https://oss.localhome.cn//localhomeqy/20190627rongde/zhuhai.png" alt=""/>          
              <p>珠海</p>
            </div>
            <div>
              <img className='moreHouseImg' onClick={this.jumpList.bind(this,'成都市')} src="https://oss.localhome.cn//localhomeqy/20190627rongde/chengdu.png" alt=""/>          
              <p>成都</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
