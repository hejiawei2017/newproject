import React, { Component } from 'react'
import adapter from '../../common/adapter'
import './HouseList.css'

export default class HouseList extends Component {
  state = {
    isJumping: false
  }
  // 转跳逻辑
  jumpPage (id) {
    adapter.navigate({
      url: `/pages/housing/detail/index?houseId=${id}&channel=${this.props.channel}"`
    })
  }
  render () {
    const list = this.props.houseList || []
    return (
      <div className="houseList">
        {list.map(item => {
          return (
            <div
              className="house"
              key={item.houseId}
              onClick={this.jumpPage.bind(this, item.houseId)}
            >
              <div className="houseTop">
                <img src={item.imgPath} alt="" />
              </div>
              <div className="houseBottom">
                <div className="houseTitle">{item.title}</div>
                <div className="priceInfo">
                  <div className="price">
                    <span
                      className="truePrice"
                      style={{
                        color: this.props.color
                      }}
                    >
                      <i className="symbol">￥</i>
                      {this.props.renderPrice
                        ? this.props.renderPrice(item.price)
                        : item.price}
                    </span>
                    <span className="standardPrice">
                      原价:
                      <i className="symbol">￥</i>
                      {item.price}
                    </span>
                  </div>
                  <div className="opt">
                    {this.props.optBtn ? (
                      <img src={this.props.optBtn} alt="" />
                    ) : this.props.optBtnRender ? (
                      this.props.optBtnRender()
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
