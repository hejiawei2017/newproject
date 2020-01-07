import React, { Component } from 'react';
import adapter from '../../common/adapter';
import Image from '../../components/Image/Image'
import './HouseList.css';

export default class HouseList extends Component {
  state = {
    isJumping:false
  }
  // 转跳逻辑
  jumpPage(id) {
    adapter.navigate({ url: `/pages/housing/detail/index?houseId=${id}&channel=zhuhai01` });
  }
  render() {
    const { houseList,discount } = this.props
    const list = houseList || [];
    return (
      <div className="houseList">
        {list.map(item => {
          return (
            <div className='house' key={item.houseId} onClick={this.jumpPage.bind(this,item.houseId)}>
              <div className='houseTop'>
                <Image src={item.imgPath} alt=""/>
              </div>
              <div className='houseBottom'>
                <div className='houseTitle'>{item.title}</div>
                <div className='price'>
                  <img src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/zhuhai/tip002.png" alt=""/>
                  <span className='truePrice'>￥{parseInt(item.price * discount)}</span>
                  <span className='standardPrice'>原价:{item.price}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    );
  }
}
