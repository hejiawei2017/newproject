import React, { Component } from 'react';
import adapter from '../../common/adapter'
import './ShareCom.css'

export default class ShareCom extends Component {
  // 转跳逻辑
  jumpPage(url){
    adapter.navigate({url:`/pages/activity/${url}/index?channel=gjh2019`})
  }
  render() {
    return (
      <div className='share'>
        <div className='shareBtn' onClick={this.jumpPage.bind(this,'new-user-redpacket')}>
          <img className='img' src='https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/gjhh5/share1.png' alt=''/>
          <span className='_info'>新人红包 首单立减</span>
        </div>
        <div className='shareBtn' onClick={this.jumpPage.bind(this,'hand-in-hand-201901/home')}>
          <img className='img' src='https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/gjhh5/share2.png' alt=''/>     
          <span className='_info'>邀请好友 即得100元</span>
        </div>
      </div>
    );
  }
}
